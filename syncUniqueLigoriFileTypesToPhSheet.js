const { sheets, SPREADSHEET_ID } = require('./googleClient');
const { getStorageFolderByFiletype } = require('./getFolderStorageByFileType');

async function syncUniqueLigoriFiletypesToPHSheet() {
  await syncUniqueFiletypesCommon('Ligori Logs', 'Ligori PH Filetypes', 246);
}

async function syncUniqueBermanFiletypesToPHSheet() {
  await syncUniqueFiletypesCommon('Berman Law Logs', 'Berman Law PH Filetypes', 216);
}

async function syncUniqueFiletypesCommon(logsSheetName, phSheetName, companyId) {
  const phResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${phSheetName}!A2:B`
  });
  const phRows = phResponse.data.values || [];
  const phFiletypes = phRows.map(row => (row[0] || "").toString().trim());

  const logsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${logsSheetName}!F2:F`
  });
  const logFiletypes = (logsResponse.data.values || []).flat();

  const newMappings = [];

  for (const ft of logFiletypes) {
    const filetype = (ft || "").toString().trim();
    if (!filetype || phFiletypes.includes(filetype)) continue;

    const folder = await getStorageFolderByFiletype(filetype, companyId);
    newMappings.push([filetype, folder]);
    
    phFiletypes.push(filetype);
  }

  if (newMappings.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${phSheetName}!A:B`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: newMappings }
    });
    console.log(`Synced ${newMappings.length} unique filetypes to ${phSheetName}.`);
  } else {
    console.log(`${phSheetName} is already completely synchronized.`);
  }
}

module.exports = { syncUniqueLigoriFiletypesToPHSheet, syncUniqueBermanFiletypesToPHSheet };

if (require.main === module) {
  syncUniqueLigoriFiletypesToPHSheet();
  syncUniqueBermanFiletypesToPHSheet();
}