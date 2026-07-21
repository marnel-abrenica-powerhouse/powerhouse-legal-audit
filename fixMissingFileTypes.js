const { sheets, SPREADSHEET_ID } = require('./googleClient');

const LOG_SHEETS = [
  { sheetName: 'Ligori Logs', companyId: 246 },
  { sheetName: 'Alvandi Logs', companyId: 164 },
  { sheetName: 'Berman Law Logs', companyId: 216 }
];

// Controlled parallel pooling limit
const CONCURRENCY_LIMIT = 15;

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

async function fixMissingFileTypes() {
  console.log('=== 🛠️ STARTING MISSING FILETYPES REPAIR UTILITY ===');
  const startTime = Date.now();
  let totalFixed = 0;

  const invalidTypes = ["", "N/A", "Error"];

  try {
    for (const target of LOG_SHEETS) {
      const sheetName = target.sheetName;
      const companyId = target.companyId;

      console.log(`\n🔎 Scanning sheet: "${sheetName}" (Company ${companyId})...`);
      
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:J`
      });

      const rows = response.data.values || [];
      if (rows.length <= 1) {
        console.log(`   ⚠️ Sheet "${sheetName}" is empty or only contains headers. Skipping.`);
        continue;
      }

      const rowsToRepair = [];

      for (let i = 1; i < rows.length; i++) {
        const fileId = rows[i][3] ? String(rows[i][3]).trim() : "";   // Column D
        const fileName = rows[i][4] ? String(rows[i][4]).trim() : ""; // Column E
        const fileType = rows[i][5] ? String(rows[i][5]).trim() : ""; // Column F
        
        if (fileId && invalidTypes.includes(fileType)) {
          rowsToRepair.push({
            rowIndex: i + 1,
            fileId: fileId,
            fileName: fileName,
            companyId: companyId
          });
        }
      }

      if (rowsToRepair.length === 0) {
        console.log(`   ✨ Sheet "${sheetName}" is perfectly clean! No broken file types found.`);
        continue;
      }

      console.log(`   Found ${rowsToRepair.length} broken entries in "${sheetName}". Repairing...`);

      // Fetch file types concurrently (using Primary -> Secondary fallback)
      const updatePayloads = await PromisePool(rowsToRepair, CONCURRENCY_LIMIT, async (row) => {
        const freshFileType = await fetchFileType(row.fileId, row.fileName, row.companyId);
        
        console.log(`     ↳ [FIXED] Row ${row.rowIndex.toString().padEnd(4)} | File ID: ${row.fileId.padEnd(8)} ➔ New Type: "${freshFileType}"`);
        
        return {
          range: `${sheetName}!F${row.rowIndex}`,
          values: [[freshFileType]]
        };
      });

      // Commit changes in one batch
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          valueInputOption: 'USER_ENTERED',
          data: updatePayloads
        }
      });

      totalFixed += rowsToRepair.length;
      console.log(`   ✅ Successfully wrote updates to Google Sheets for "${sheetName}".`);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n=== 🎉 REPAIR COMPLETE. Fixed ${totalFixed} row entries across all logs in ${duration}s ===`);

  } catch (error) {
    console.error('An error occurred during the file type repair execution:', error);
  }
}

async function fetchFileType(fileId, fileName = "", companyId = null) {
  let fileType = "N/A";
  const invalidTypes = ["", "N/A", "Error", null, undefined];

  // 1. Try Primary API
  if (fileId) {
    const primaryUrl = `https://www.powerhouse.center/api/backend/nest/raw-files/processed-legal-file/${fileId}`;
    const primaryOptions = {
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
      const response = await fetch(primaryUrl, primaryOptions);
      if (response.ok) {
        const json = await response.json();
        fileType = json?.data?.legalProcessedFile?.companySpecificFileType?.name || "N/A";
      }
    } catch (e) {
      fileType = "Error";
    }
  }

  // Return immediately if Primary API succeeds
  if (!invalidTypes.includes(fileType)) {
    return fileType;
  }

  // 2. Fallback to Secondary API if Primary failed
  if (fileName && companyId) {
    try {
      console.log(`       ⚠️ Primary API returned "${fileType}" for File ID: ${fileId}. Triggering fallback API for "${fileName}"...`);
      const secondaryFileType = await fetchFileTypeSecondary(fileName, companyId);
      
      if (secondaryFileType && !invalidTypes.includes(secondaryFileType)) {
        return secondaryFileType;
      }
    } catch (err) {
      console.error(`       ❌ Secondary API lookup failed for "${fileName}":`, err.message);
    }
  }

  return "N/A";
}

async function fetchFileTypeSecondary(fileName, companyId) {
  const url = 'https://product-node-api.powerhouse.so/api/v1/admin/fetch-incoming-emails';

  const payload = {
    incomingMailSearch: fileName,
    processedAtDateRange: {
      start: "2023-12-02",
      end: "2027-12-09"
    },
    reviewerSelector: [],
    organizationSelectorIncomingMail: [Number(companyId)],
    fileTypeSelector: [],
    statusSelect: [],
    adjNumberSelector: [],
    page: 1,
    limit: 1
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Retool/2.0 (+https://docs.tryretool.com/docs/apis)",
      "x-api-key": "000647fd8e772d78e35b423895958090525a9f93084d9cd6978497cd8754748b"
    },
    body: JSON.stringify(payload)
  };

  const response = await fetch(url, options);
  if (!response.ok) return "N/A";

  const json = await response.json();
  return json?.data?.[0]?.legal_file_type_name || "N/A";
}

module.exports = { fixMissingFileTypes };

if (require.main === module) {
  fixMissingFileTypes();
}