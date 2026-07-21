const { sheets, SPREADSHEET_ID } = require('./googleClient');
const { ligoriCookie } = require('./cookies');

const ligoriDelay = 2000;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function executeLigoriLawVerification() {
  try {
    await verifyFolderPathLigori();
  } catch (error) {
    console.error('Error in auditing Ligori Law files:', error);
  }
}

async function verifyFolderPathLigori() {
  console.log('Fetching sheet timezone data...');
  const spreadsheetMeta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const timezone = spreadsheetMeta.data.properties.timeZone || 'America/Los_Angeles';

  const sheetName = 'Ligori Logs';
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:T`
  });
  const sheetData = response.data.values || [];
  if (sheetData.length === 0) return;

  const totalCount = sheetData.filter((item, idx) => 
    idx > 0 && 
    String(item[0]).toUpperCase() === 'FALSE' && 
    item[1] && String(item[1]).trim() !== ''
  ).length;

  let totalVerified = 0;

  for (let index = 1; index < sheetData.length; index++) {
    const x = sheetData[index];
    const rowNum = index + 1;

    // Skip if already audited (Col A = TRUE)
    if (x[0] === 'TRUE' || x[0] === 'true' || x[0] === true) {
      continue;
    }
    // Skip if already pass (Col N = pass)
    if (x[13] === 'pass') {
      totalVerified++;
      continue;
    }

    console.log(`Verifying ${totalVerified + 1}/${totalCount} fileId: ${x[3]}: ${x[4]} with caseId: ${x[7]}`);
    const caseId = x[7].toString();
    const docName = x[4];

    const rootFolderId = await getProjectRootFolderIDLigori(caseId);
    if (!rootFolderId) {
      totalVerified++;
      continue;
    }

    const fileDetails = await lookUpFileViaRootFolderIDLigori(caseId, rootFolderId, docName);
    const todayStr = getTodayInSheetTimezone(timezone);
    const rowUpdates = [];

    if (fileDetails.docUploaded === false) {
      rowUpdates.push({ range: `${sheetName}!N${rowNum}`, values: [['Missing Upload']] });
      rowUpdates.push({ range: `${sheetName}!A${rowNum}`, values: [[true]] });
      rowUpdates.push({ range: `${sheetName}!S${rowNum}`, values: [['File not found in Filevine']] });
      rowUpdates.push({ range: `${sheetName}!U${rowNum}`, values: [[todayStr]] });
    } else {
      const folderIds = fileDetails.foundFolderIds;
      const folderPath = await getPathViaFolderIdLigori(caseId, folderIds[0]);

      if (folderPath === x[8]) { // Col I (index 8)
        rowUpdates.push({ range: `${sheetName}!N${rowNum}`, values: [['Pass']] });
        rowUpdates.push({ range: `${sheetName}!A${rowNum}`, values: [[true]] });
      } else {
        rowUpdates.push({ range: `${sheetName}!N${rowNum}`, values: [['Incorrect folder']] });
        rowUpdates.push({ range: `${sheetName}!S${rowNum}`, values: [['Saved to ' + folderPath]] });
      }
      rowUpdates.push({ range: `${sheetName}!U${rowNum}`, values: [[todayStr]] });
    }

    // 🔥 Real-time immediate update to Google Sheets for this row
    if (rowUpdates.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: rowUpdates
        }
      });
      console.log(`  └─ 🚀 Real-time update applied to Row ${rowNum} in Google Sheets.`);
    }

    totalVerified++;
  }

  console.log('Execution of Ligori Law Verification complete.');
}

async function getProjectRootFolderIDLigori(caseId) {
  const url = `https://ligorilaw.filevineapp.com/api/projects/${caseId}/limitedProjectFolderTree`;
  const payload = { descendantFolderIDs: [], maxChildrenPerFolder: 500 };

  const options = {
    method: "POST",
    headers: { 'Cookie': ligoriCookie, 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) return null;
    const json = await response.json();
    return (json.data.index.projectRootFolderID).toString();
  } catch (e) {
    console.error(e.message);
    return null;
  } finally {
    await sleep(ligoriDelay);
  }
}

async function lookUpFileViaRootFolderIDLigori(caseId, rootFolderID, docName) {
  let returnData = { 'docUploaded': false, 'foundInRoot': false, 'foundFolderIds': [] };
  const url = `https://ligorilaw.filevineapp.com/api/docs/project/${caseId}`;

  let docNameCleaned = docName.replace(/:/g, '_').replace(/'/g, '_').replace(/\//g, ' ');

  console.log("Searching for Ligori document:", docNameCleaned);
  const payload = {
    "offset": 0,
    "filter": docNameCleaned,
    "sort": "uploaddate",
    "filterSingleDocID": null,
    "folderID": rootFolderID,
    "skipDocIDs": [],
    "isAscending": false
  };

  const options = {
    method: "POST",
    headers: { 'Cookie': ligoriCookie, 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) return returnData;
    const json = await response.json();
    if (json.data.length > 0) {
      returnData.docUploaded = true;
      json.data.forEach(x => {
        if ((x.folderID.toString()) === rootFolderID) {
          returnData.foundInRoot = true;
        } else {
          returnData.foundFolderIds.push(x.folderID.toString());
        }
      });
    }
    return returnData;
  } catch (e) {
    console.error(e.message);
    return returnData;
  } finally {
    await sleep(ligoriDelay);
  }
}

async function getPathViaFolderIdLigori(caseId, folderId) {
  if (!folderId) return "";
  const url = `https://ligorilaw.filevineapp.com/api/projects/${caseId}/folders/${folderId}/partialTree`;

  const payload = { "descendantFolderIDs": [folderId], "maxChildrenPerFolder": 500 };

  const options = {
    method: "POST",
    headers: { 'Cookie': ligoriCookie, 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) return "";
    const json = await response.json();
    const folderName = json.data.name;
    const prntCount = (json.data.parents).length;
    let parentFolderName = '';
    if (prntCount > 2) {
      parentFolderName = json.data.parents[prntCount - 1].name + '/';
    }
    return parentFolderName + folderName;
  } catch (e) {
    console.error(e.message);
    return "";
  } finally {
    await sleep(ligoriDelay);
  }
}

function getTodayInSheetTimezone(timezone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const parts = formatter.formatToParts(new Date());
  const partMap = {};
  for (const part of parts) {
    partMap[part.type] = part.value;
  }
  
  return `${partMap.year}-${partMap.month}-${partMap.day}`;
}

module.exports = { executeLigoriLawVerification };

if (require.main === module) {
  executeLigoriLawVerification();
}