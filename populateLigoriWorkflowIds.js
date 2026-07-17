const { sheets, SPREADSHEET_ID } = require('./googleClient');
const { lookupWorkflowIdByName } = require('./lookUpWorkflowIdByName');

async function populateLigoriWorkflowIdsLive() {
  const sheetName = "Ligori Workflow Mapping";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A2:F`
  });
  const rows = response.data.values || [];
  if (rows.length === 0) return;

  const WORKFLOW_NAME_COL_INDEX = 1; // Column B
  const WORKFLOW_ID_COL_INDEX = 5;   // Column F

  const dataToWrite = [];

  for (let i = 0; i < rows.length; i++) {
    const rowNum = i + 2;
    const workflowName = rows[i][WORKFLOW_NAME_COL_INDEX];
    const existingId = rows[i][WORKFLOW_ID_COL_INDEX];

    if (!workflowName || existingId) continue;

    let workflowId;
    try {
      workflowId = await lookupWorkflowIdByName(workflowName, 246);
    } catch (e) {
      workflowId = "error";
    }

    dataToWrite.push({
      range: `${sheetName}!F${rowNum}`,
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
    console.log(`Populated ${dataToWrite.length} Workflow IDs in Ligori mappings.`);
  } else {
    console.log("No new Ligori Workflow IDs to process.");
  }
}

module.exports = { populateLigoriWorkflowIdsLive };

if (require.main === module) {
  populateLigoriWorkflowIdsLive();
}