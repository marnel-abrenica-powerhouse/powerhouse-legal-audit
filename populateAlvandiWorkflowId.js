const { sheets, SPREADSHEET_ID } = require('./googleClient');
const { lookupWorkflowIdByName } = require('./lookUpWorkflowIdByName');

async function populateAlvandiWorkflowIdsLive() {
  const sheetName = "Alvandi Workflow Mapping";
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A2:G`
  });
  const rows = response.data.values || [];
  if (rows.length === 0) return;

  const WORKFLOW_NAME_COL_INDEX = 1; // Column B (index 1)
  const WORKFLOW_ID_COL_INDEX = 6;   // Column G (index 6)

  const dataToWrite = [];

  for (let i = 0; i < rows.length; i++) {
    const rowNum = i + 2;
    const workflowName = rows[i][WORKFLOW_NAME_COL_INDEX];
    const existingId = rows[i][WORKFLOW_ID_COL_INDEX];

    if (!workflowName || existingId) continue;

    let workflowId;
    try {
      workflowId = await lookupWorkflowIdByName(workflowName, 164);
    } catch (e) {
      workflowId = "error";
    }

    dataToWrite.push({
      range: `${sheetName}!G${rowNum}`,
      values: [[workflowId]]
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
    console.log(`Workflow IDs populated for Alvandi on ${dataToWrite.length} rows.`);
  } else {
    console.log("No new Alvandi Workflow IDs to populate.");
  }
}

module.exports = { populateAlvandiWorkflowIdsLive };

if (require.main === module) {
  populateAlvandiWorkflowIdsLive();
}