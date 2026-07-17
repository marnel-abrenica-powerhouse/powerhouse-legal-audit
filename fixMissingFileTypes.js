const { sheets, SPREADSHEET_ID } = require('./googleClient');

const LOG_SHEETS = [
  'Ligori Logs',
  'Alvandi Logs',
  'Berman Law Logs'
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
    for (const sheetName of LOG_SHEETS) {
      console.log(`\n🔎 Scanning sheet: "${sheetName}"...`);
      
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
        const fileType = rows[i][5] ? String(rows[i][5]).trim() : ""; // Column F
        
        if (fileId && invalidTypes.includes(fileType)) {
          rowsToRepair.push({
            rowIndex: i + 1,
            fileId: fileId
          });
        }
      }

      if (rowsToRepair.length === 0) {
        console.log(`   ✨ Sheet "${sheetName}" is perfectly clean! No broken file types found.`);
        continue;
      }

      console.log(`   Found ${rowsToRepair.length} broken entries in "${sheetName}". Repairing...`);

      // Fetch file types concurrently and log out the individual item adjustments
      const updatePayloads = await PromisePool(rowsToRepair, CONCURRENCY_LIMIT, async (row) => {
        const freshFileType = await fetchFileType(row.fileId);
        
        // Detailed tracking log printed directly to your console
        console.log(`     ↳ [FIXED] Row ${row.rowIndex.toString().padEnd(4)} | File ID: ${row.fileId.padEnd(8)} ➔ New Type: "${freshFileType}"`);
        
        return {
          range: `${sheetName}!F${row.rowIndex}`,
          values: [[freshFileType]]
        };
      });

      // Commit changes in one efficient block write
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

module.exports = { fixMissingFileTypes };

if (require.main === module) {
  fixMissingFileTypes();
}