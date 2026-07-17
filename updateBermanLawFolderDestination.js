const { sheets, SPREADSHEET_ID } = require('./googleClient');

async function updateBermanLawFolderDestination() {
  const phResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Berman Law PH Filetypes!A2:B'
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

  const logsHeadersResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Berman Law Logs!1:1'
  });
  const headers = logsHeadersResponse.data.values?.[0] || [];
  let folderDestCol = headers.indexOf("Folder Destination") + 1;

  if (folderDestCol === 0) {
    folderDestCol = headers.length + 1;
    const colLetter = getColumnLetter(folderDestCol);
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Berman Law Logs!${colLetter}1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [["Folder Destination"]] }
    });
  }

  const logsDataResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Berman Law Logs!A2:J'
  });
  const logsRows = logsDataResponse.data.values || [];
  if (logsRows.length === 0) return;

  const folderDestValues = logsRows.map(row => {
    const fileType = (row[5] || "").toString().trim(); // Column F is index 5
    return [fileTypeMap[fileType] || ""];
  });

  const targetColLetter = getColumnLetter(folderDestCol);
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Berman Law Logs!${targetColLetter}2:${targetColLetter}${logsRows.length + 1}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: folderDestValues }
  });

  console.log("Folder Destination updated in 'Berman Law Logs' from 'Berman Law PH Filetypes'.");
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

module.exports = { updateBermanLawFolderDestination };

if (require.main === module) {
  updateBermanLawFolderDestination();
}