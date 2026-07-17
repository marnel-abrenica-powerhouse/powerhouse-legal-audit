const { sheets, SPREADSHEET_ID } = require('./googleClient');
const { getStorageFolderByFiletype } = require('./getFolderStorageByFileType');

async function syncFiletypesAndUpdateStorageFolders() {
  const companyId = 164;

  const logsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Alvandi Logs!F2:F'
  });
  const logsValues = logsResponse.data.values || [];
  
  const uniqueFiletypes = new Set();
  logsValues.forEach(row => {
    if (row && row[0]) {
      const ft = String(row[0]).trim();
      if (ft !== "") uniqueFiletypes.add(ft);
    }
  });

  if (uniqueFiletypes.size === 0) {
    console.log("No valid filetypes found in Alvandi Logs.");
    return;
  }

  const phResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Alvandi PH Filetypes!A2:B'
  });
  const phData = phResponse.data.values || [];
  
  const phMap = {}; // filetype -> row number
  phData.forEach((row, index) => {
    const existing = String(row[0] || "").trim();
    if (existing !== "") {
      phMap[existing] = index + 2;
    }
  });

  let nextPHRow = phData.length + 2;
  const dataToWrite = [];

  for (const filetype of uniqueFiletypes) {
    let targetRow;
    if (!phMap.hasOwnProperty(filetype)) {
      targetRow = nextPHRow++;
      dataToWrite.push({
        range: `Alvandi PH Filetypes!A${targetRow}`,
        values: [[filetype]]
      });
      phMap[filetype] = targetRow;
    } else {
      targetRow = phMap[filetype];
    }

    const storageFolder = await getStorageFolderByFiletype(filetype, companyId);
    dataToWrite.push({
      range: `Alvandi PH Filetypes!B${targetRow}`,
      values: [[storageFolder || ""]]
    });
  }

  if (dataToWrite.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: dataToWrite
      }
    });
    console.log("Manual Alvandi Filetypes storage sync complete.");
  }
}

module.exports = { syncFiletypesAndUpdateStorageFolders };

if (require.main === module) {
  syncFiletypesAndUpdateStorageFolders();
}