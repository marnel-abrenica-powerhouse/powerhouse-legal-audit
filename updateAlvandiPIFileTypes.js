const { sheets, SPREADSHEET_ID } = require('./googleClient');

async function populateAlvandiPiFiletypes() {
  await updateAlvandiPiFiletypes();
}

async function updateAlvandiPiFiletypes() {
  const logsSheetName = 'Alvandi Logs';
  const piFileTypesSheetName = 'PI Filetypes';

  const logsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${logsSheetName}!A:R`
  });
  const logsData = logsResponse.data.values || [];
  if (logsData.length === 0) return;

  const piResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${piFileTypesSheetName}!A:A`
  });
  const piFileTypesRaw = piResponse.data.values || [];
  const piFileTypes = piFileTypesRaw.flat().filter(Boolean).map(f => f.trim());

  const dataToWrite = [];

  logsData.forEach((item, index) => {
    if (index === 0) return; // Skip headers
    
    const fileType = item[5] ? item[5].trim() : ''; // Column F is index 5
    const existingPiStatus = item[17] ? item[17].trim() : ''; // Column R is index 17
    
    if (fileType === '') return;
    if (existingPiStatus !== '') return; // Skip already evaluated fields
    
    const rowNum = index + 1;
    if (piFileTypes.includes(fileType)) {
      console.log(`PI File Type Found: ${fileType} | updating range: R${rowNum}`);
      dataToWrite.push({
        range: `${logsSheetName}!R${rowNum}`,
        values: [['Yes']]
      });
    } else {
      console.log(`Non PI File Type: ${fileType} | updating range: R${rowNum}`);
      dataToWrite.push({
        range: `${logsSheetName}!R${rowNum}`,
        values: [['No']]
      });
    }
  });

  if (dataToWrite.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: dataToWrite
      }
    });
    console.log(`Completed processing Alvandi PI Filetypes. Updated ${dataToWrite.length} rows.`);
  } else {
    console.log("No new Alvandi PI filetype fields require mapping evaluation.");
  }
}

module.exports = { populateAlvandiPiFiletypes, updateAlvandiPiFiletypes };

if (require.main === module) {
  updateAlvandiPiFiletypes();
}