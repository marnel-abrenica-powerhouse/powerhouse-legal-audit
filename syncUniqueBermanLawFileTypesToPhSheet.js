const { sheets, SPREADSHEET_ID } = require('./googleClient');
const { getStorageFolderByFiletype } = require('./getFolderStorageByFileType');

async function syncUniqueBermanLawFiletypesToPHSheet() {
  const companyId = 216;

  const phResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Berman Law PH Filetypes!A2:B'
  });
  const phRows = phResponse.data.values || [];
  const phFiletypes = phRows.map(row => (row[0] || "").toString().trim());

  const logsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Berman Law Logs!F2:F'
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
      range: 'Berman Law PH Filetypes!A:B',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: newMappings }
    });
    console.log(`Successfully synced ${newMappings.length} unique filetypes to Berman Law PH Sheet.`);
  } else {
    console.log("Berman Law PH sheet is already up to date.");
  }
}

module.exports = { syncUniqueBermanLawFiletypesToPHSheet };

if (require.main === module) {
  syncUniqueBermanLawFiletypesToPHSheet();
}