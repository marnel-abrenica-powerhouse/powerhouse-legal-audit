const { sheets, SPREADSHEET_ID } = require('./googleClient');
const { updateAlvandiWorkflowMapping } = require('./updateAlvandiWorkflowMappings');
const { updateLigoriWorkflowMapping } = require('./updateLigoriWorkflowMapping');
const { updateBermanLawFolderDestination } = require('./updateBermanLawFolderDestination');
const { populateAlvandiPiFiletypes } = require('./updateAlvandiPIFileTypes');

const orgInfo = {
  "ligori": {
    id: 246,
    name: 'Ligori',
    sheetName: 'Ligori Logs'
  },
  "alvandi": {
    id: 164,
    name: 'Alvandi',
    sheetName: 'Alvandi Logs'
  },
  "bermanLaw": {
    id: 216,
    name: 'Berman Law',
    sheetName: 'Berman Law Logs'
  }
};

// Elegant concurrency pool helper to limit parallel API lookups safely
async function PromisePool(items, batchSize, workerFn) {
  const results = [];
  const executing = new Set();
  for (const item of items) {
    const p = Promise.resolve().then(() => workerFn(item));
    results.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean, clean);
    if (executing.size >= batchSize) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

async function getAllSyncLogs() {
  try {
    console.log('Retrieving spreadsheet metadata...');
    const spreadsheetMeta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const timezone = spreadsheetMeta.data.properties.timeZone || 'America/Los_Angeles';

    console.log('Retrieving Document Sync Logs...');
    await getDocumentSyncLogs(orgInfo.ligori.id, orgInfo.ligori.sheetName, timezone);
    await getDocumentSyncLogs(orgInfo.alvandi.id, orgInfo.alvandi.sheetName, timezone);
    await getDocumentSyncLogs(orgInfo.bermanLaw.id, orgInfo.bermanLaw.sheetName, timezone);

    console.log('Syncing folder storage mappings...');
    await updateLigoriFolderStorage();
    await updateAlvandiFolderStorage();
    await updateBermanLawFolderStorage();

    console.log('Populating PI Filetypes...');
    await populateAlvandiPiFiletypes();

    console.log('Execution of getAllSyncLogs completed successfully!');
  } catch (error) {
    console.error('Error executing getAllSyncLogs:', error);
  }
}

async function updateFiletypeMappings() {
  try {
    await updateLigoriFolderStorage();
    await updateAlvandiFolderStorage();
    await updateBermanLawFolderStorage();
    console.log('All folder storage mappings updated successfully!');
  } catch (error) {
    console.error('Error updating folder storage mappings:', error);
  }
}

async function getDocumentSyncLogs(company_id, sheetName, timezone) {
  const url = "https://workflow-prd-api.powerhouse.so/api/v1/workflow/document-sync-logs";
  const payload = {
    company_id: company_id,
    page: 1,
    limit: 500,
    status: "Completed",
    started_after: "2026-07-19T00:00:00.000-07:00",
    started_before: "2027-12-01T23:59:59.999-07:00"
  };

  const headers = {
    "accept": "*/*",
    "content-type": "application/json",
    "x-api-key": "000647fd8e772d78e35b423895958090525a9f93084d9cd6978497cd8754748b",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const json = await response.json();
    const possibleKeys = ["data", "items", "results", "logs", "records"];
    
    for (const key of possibleKeys) {
      if (Array.isArray(json[key])) {
        await writeToSheet(json[key], sheetName, timezone);
        return;
      }
    }

    if (Array.isArray(json)) {
      await writeToSheet(json, sheetName, timezone);
      return;
    }

    throw new Error("No array found in response. Payload structure: " + JSON.stringify(json, null, 2));
  } catch (err) {
    console.error(`Error retrieving document sync logs for company ${company_id}:`, err);
  }
}

async function writeToSheet(data, sheetName, timezone) {
  const sheetId = await ensureSheetExists(sheetName);

  // Read existing content
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:J`
  });

  const existingRows = response.data.values || [];
  
  if (existingRows.length === 0) {
    const headers = [
      "Audited", "Synced At", "Processed At", "File ID", "File Name", 
      "File Type", "Case Name", "Case ID", "Folder Destination", "Folder Section"
    ];
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] }
    });
    existingRows.push(headers);
  }

  const invalidTypes = ["", "N/A", "Error"];
  const existingFileIds = new Set();
  const rowsToUpdate = [];

  // Parse existing rows to flag missing, null, N/A or Error fileTypes for re-fetching
  for (let i = 1; i < existingRows.length; i++) {
    const fileIdCol = existingRows[i][3] ? String(existingRows[i][3]).trim() : "";
    const fileTypeCol = existingRows[i][5] ? String(existingRows[i][5]).trim() : "";
    
    if (fileIdCol) {
      existingFileIds.add(fileIdCol);
      if (invalidTypes.includes(fileTypeCol)) {
        rowsToUpdate.push({ rowIndex: i + 1, fileId: fileIdCol });
      }
    }
  }

  // Filter incoming API records to extract completely new items
  const itemsToAppend = data.filter(item => {
    const fileId = String(item.legal_processed_file_id || "").trim();
    return fileId && !existingFileIds.has(fileId);
  });

  if (rowsToUpdate.length === 0 && itemsToAppend.length === 0) {
    console.log(`No new logs to write and no invalid file types to fix for sheet: ${sheetName}`);
    await sortBySyncedAt(sheetName, sheetId, existingRows.length);
    return;
  }

  // 1. Correct existing rows with bad fileTypes in place via batch updates
  if (rowsToUpdate.length > 0) {
    console.log(`Re-fetching and updating ${rowsToUpdate.length} rows with invalid File Types on: ${sheetName}...`);
    const updatePayloads = await PromisePool(rowsToUpdate, 15, async (row) => {
      const freshFileType = await fetchFileType(row.fileId);
      return {
        range: `${sheetName}!F${row.rowIndex}`,
        values: [[freshFileType]]
      };
    });

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: updatePayloads
      }
    });
  }

  // 2. Fetch fileTypes and append brand new records
  if (itemsToAppend.length > 0) {
    console.log(`Fetching File Types for ${itemsToAppend.length} new records on: ${sheetName}...`);
    const resolvedRows = await PromisePool(itemsToAppend, 15, async (item) => {
      const fileId = String(item.legal_processed_file_id || "").trim();
      const fileType = await fetchFileType(fileId);
      
      const syncedAtStr = parseDate(item.ended_at, timezone);
      const processedAtStr = parseDate(item.legal_processed_file?.created_at, timezone);

      return [
        false,                                             // Audited
        syncedAtStr,                                       // Synced At
        processedAtStr,                                    // Processed At
        fileId,                                            // File ID
        item.legal_processed_file?.name || "",             // File Name
        fileType,                                          // File Type
        item.legal_processed_file?.case_name || "",       // Case Name
        item.legal_processed_file?.case_id || "",         // Case ID
        "",                                                // Folder Destination placeholder
        ""                                                 // Folder Section placeholder
      ];
    });

    const startRow = existingRows.length + 1;
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${startRow}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: resolvedRows }
    });

    const totalRows = existingRows.length + resolvedRows.length;

    // Apply Checkboxes and DateTime formattings
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            setDataValidation: {
              range: {
                sheetId: sheetId,
                startRowIndex: startRow - 1,
                endRowIndex: totalRows,
                startColumnIndex: 0,
                endColumnIndex: 1
              },
              rule: {
                condition: { type: 'BOOLEAN' },
                showCustomUi: true
              }
            }
          },
          {
            repeatCell: {
              range: {
                sheetId: sheetId,
                startRowIndex: startRow - 1,
                endRowIndex: totalRows,
                startColumnIndex: 1,
                endColumnIndex: 3
              },
              cell: {
                userEnteredFormat: {
                  numberFormat: {
                    type: 'DATE_TIME',
                    pattern: 'mmm d, yyyy, h:mm AM/PM'
                  }
                }
              },
              fields: 'userEnteredFormat.numberFormat'
            }
          }
        ]
      }
    });
  }

  // Get accurate count of rows after mutations and run standard sorting spec
  const finalCountResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:A`
  });
  const finalRowsCount = finalCountResponse.data.values ? finalCountResponse.data.values.length : existingRows.length;
  await sortBySyncedAt(sheetName, sheetId, finalRowsCount);
}

function parseDate(dateString, timezone) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "";

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const parts = formatter.formatToParts(d);
  const partMap = {};
  parts.forEach(p => partMap[p.type] = p.value);

  return `${partMap.month} ${partMap.day}, ${partMap.year}, ${partMap.hour}:${partMap.minute} ${partMap.dayPeriod}`;
}

async function sortBySyncedAt(sheetName, sheetId, lastRow) {
  if (lastRow <= 2) return;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          sortRange: {
            range: {
              sheetId: sheetId,
              startRowIndex: 1,
              endRowIndex: lastRow,
              startColumnIndex: 0,
              endColumnIndex: 10
            },
            sortSpecs: [
              {
                dimensionIndex: 1, // Column B (Synced At)
                sortOrder: 'ASCENDING'
              }
            ]
          }
        }
      ]
    }
  });
}

async function fetchFileType(fileId) {
  if (!fileId) return "N/A";
  const url = `https://www.powerhouse.center/api/backend/nest/raw-files/processed-legal-file/${fileId}`;
  const options = {
    method: "GET",
    headers: {
      "sec-ch-ua-platform": "\"Windows\"",
      "Referer": "https://www.powerhouse.center/",
      "User-Agent": "Mozilla/5.0",
      "content-type": "application/json",
      "x-api-key": "000647fd8e772d78e35b423895958090525a9f93084d9cd6978497cd8754748b"
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) return "N/A";
    const json = await response.json();
    return json?.data?.legalProcessedFile?.companySpecificFileType?.name || "N/A";
  } catch (e) {
    return "Error";
  }
}

async function updateLigoriFolderStorage() {
  await updateFolderStorageCommon("Ligori PH Filetypes", "Ligori Logs");
}

async function updateAlvandiFolderStorage() {
  await updateFolderStorageCommon("Alvandi PH Filetypes", "Alvandi Logs");
}

async function updateBermanLawFolderStorage() {
  await updateFolderStorageCommon("Berman Law PH Filetypes", "Berman Law Logs");
}

async function updateFolderStorageCommon(phSheetName, logsSheetName) {
  const phResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${phSheetName}!A2:B`
  });
  const phData = phResponse.data.values || [];
  const fileTypeMap = {};
  phData.forEach(row => {
    const fileTypeName = (row[0] || "").toString().trim();
    const storageFolder = (row[1] || "").toString().trim();
    if (fileTypeName) {
      fileTypeMap[fileTypeName] = storageFolder;
    }
  });

  const logsMetaResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${logsSheetName}!1:1`
  });
  const headers = logsMetaResponse.data.values?.[0] || [];
  let folderDestColIndex = headers.indexOf("Folder Destination");

  if (folderDestColIndex === -1) {
    folderDestColIndex = headers.length;
    const colLetter = getColumnLetter(folderDestColIndex + 1);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${logsSheetName}!${colLetter}1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [["Folder Destination"]] }
    });
  }

  const logsDataResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${logsSheetName}!A2:J`
  });
  const logsRows = logsDataResponse.data.values || [];
  if (logsRows.length === 0) return;

  const folderDestValues = logsRows.map(row => {
    const fileType = (row[5] || "").toString().trim();
    return [fileTypeMap[fileType] || ""];
  });

  const targetColLetter = getColumnLetter(folderDestColIndex + 1);
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${logsSheetName}!${targetColLetter}2:${targetColLetter}${logsRows.length + 1}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: folderDestValues }
  });

  console.log(`Folder Destination updated in '${logsSheetName}' from '${phSheetName}'.`);
}

async function ensureSheetExists(sheetName) {
  const doc = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  let sheet = doc.data.sheets.find(s => s.properties.title === sheetName);
  if (!sheet) {
    const res = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: sheetName } } }]
      }
    });
    return res.data.replies[0].addSheet.properties.sheetId;
  }
  return sheet.properties.sheetId;
}

function getColumnLetter(columnNumber) {
  let temp, letter = '';
  while (columnNumber > 0) {
    temp = (columnNumber - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    columnNumber = (columnNumber - temp - 1) / 26;
  }
  return letter;
}

module.exports = {
  getAllSyncLogs,
  updateFiletypeMappings,
  updateLigoriFolderStorage,
  updateAlvandiFolderStorage,
  updateBermanLawFolderStorage
};

if (require.main === module) {
  getAllSyncLogs();
}