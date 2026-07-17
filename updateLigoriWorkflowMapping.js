const { sheets, SPREADSHEET_ID } = require('./googleClient');

async function updateLigoriWorkflowMapping() {
  const mappingResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ligori Workflow Mapping!A2:E'
  });
  const mappingData = mappingResponse.data.values || [];

  const workflowMap = {};
  mappingData.forEach(row => {
    const fileType = row[0];
    if (fileType) {
      workflowMap[fileType.trim()] = {
        hashtag: row[2] || "",
        staffAssigned: row[3] || "",
        staffMentioned: row[4] || ""
      };
    }
  });

  const logsHeadersResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ligori Logs!1:1'
  });
  let headers = logsHeadersResponse.data.values?.[0] || [];

  const ensureHeader = async (name) => {
    let index = headers.indexOf(name);
    if (index === -1) {
      index = headers.length;
      headers.push(name);
      const colLetter = getColumnLetter(index + 1);
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Ligori Logs!${colLetter}1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[name]] }
      });
    }
    return index;
  };

  const hashtagCol = await ensureHeader("Hashtag");
  const staffAssignedCol = await ensureHeader("Staff Assigned");
  const staffMentionedCol = await ensureHeader("Staff Mentioned");

  const logsDataResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Ligori Logs!A2:Z'
  });
  const logsRows = logsDataResponse.data.values || [];
  if (logsRows.length === 0) return;

  const dataToWrite = [];

  logsRows.forEach((row, idx) => {
    const fileType = (row[5] || "").toString().trim(); // File Type is Column F (index 5)
    const match = workflowMap[fileType];

    const rowNum = idx + 2;
    dataToWrite.push({
      range: `Ligori Logs!${getColumnLetter(hashtagCol + 1)}${rowNum}`,
      values: [[match ? match.hashtag : ""]]
    });
    dataToWrite.push({
      range: `Ligori Logs!${getColumnLetter(staffAssignedCol + 1)}${rowNum}`,
      values: [[match ? match.staffAssigned : ""]]
    });
    dataToWrite.push({
      range: `Ligori Logs!${getColumnLetter(staffMentionedCol + 1)}${rowNum}`,
      values: [[match ? match.staffMentioned : ""]]
    });
  });

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: 'USER_ENTERED',
      data: dataToWrite
    }
  });

  console.log("Hashtag, Staff Assigned, and Staff Mentioned updated in 'Ligori Logs'.");
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

module.exports = { updateLigoriWorkflowMapping };

if (require.main === module) {
  updateLigoriWorkflowMapping();
}