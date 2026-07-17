const { sheets, SPREADSHEET_ID } = require('./googleClient');

async function updateAlvandiWorkflowMapping() {
  const mappingResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Alvandi Workflow Mapping!A2:F'
  });
  const mappingData = mappingResponse.data.values || [];

  const workflowMap = {};
  mappingData.forEach(row => {
    const fileType = row[0];
    if (fileType) {
      workflowMap[fileType.trim()] = {
        workflowName: row[1] || "",
        chatterRoles: row[2] || "",
        chatterTemplate: row[3] || "",
        docTypeAudited: row[5] || ""
      };
    }
  });

  const logsHeadersResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Alvandi Logs!1:1'
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
        range: `Alvandi Logs!${colLetter}1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[name]] }
      });
    }
    return index;
  };

  const workflowCol = await ensureHeader("Workflow name");
  const rolesCol = await ensureHeader("Chatter Roles");
  const templateCol = await ensureHeader("Chatter message template");
  const docTypeAuditedCol = await ensureHeader("Doc Type Audited");

  const logsDataResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Alvandi Logs!A2:Z'
  });
  const logsRows = logsDataResponse.data.values || [];
  if (logsRows.length === 0) return;

  const dataToWrite = [];

  logsRows.forEach((row, idx) => {
    const fileType = (row[5] || "").toString().trim(); // File Type is Column F (index 5)
    const match = workflowMap[fileType];

    const rowNum = idx + 2;
    dataToWrite.push({
      range: `Alvandi Logs!${getColumnLetter(workflowCol + 1)}${rowNum}`,
      values: [[match ? match.workflowName : ""]]
    });
    dataToWrite.push({
      range: `Alvandi Logs!${getColumnLetter(rolesCol + 1)}${rowNum}`,
      values: [[match ? match.chatterRoles : ""]]
    });
    dataToWrite.push({
      range: `Alvandi Logs!${getColumnLetter(templateCol + 1)}${rowNum}`,
      values: [[match ? match.chatterTemplate : ""]]
    });
    dataToWrite.push({
      range: `Alvandi Logs!${getColumnLetter(docTypeAuditedCol + 1)}${rowNum}`,
      values: [[match ? match.docTypeAudited : ""]]
    });
  });

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      valueInputOption: 'USER_ENTERED',
      data: dataToWrite
    }
  });

  console.log("Workflow mapping + Doc Type Audited updated in 'Alvandi Logs'.");
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

module.exports = { updateAlvandiWorkflowMapping };

if (require.main === module) {
  updateAlvandiWorkflowMapping();
}