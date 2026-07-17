const { sheets, SPREADSHEET_ID } = require('./googleClient');
const { getChatterRolesByWorkflowId } = require('./getChatterRolesByWorkflowId');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function updateRolesColumn() {
  const sheetName = "Alvandi Workflow Mapping";
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A2:G`
  });
  const rows = response.data.values || [];
  if (rows.length === 0) return;

  const WORKFLOW_ID_COL_INDEX = 6; // Column G (index 6)
  const dataToWrite = [];

  for (let i = 0; i < rows.length; i++) {
    const workflowId = rows[i][WORKFLOW_ID_COL_INDEX];
    const rowNum = i + 2;

    if (!workflowId) continue;

    const roles = await getChatterRolesByWorkflowId(workflowId);
    dataToWrite.push({
      range: `${sheetName}!C${rowNum}`, // Write to Col C
      values: [[roles || "N/A"]]
    });

    await sleep(300); // 0.3s sleep to avoid over-taxing the api endpoints
  }

  if (dataToWrite.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: dataToWrite
      }
    });
    console.log(`Roles Column successfully updated for ${dataToWrite.length} mapping entries.`);
  } else {
    console.log("No missing roles to fetch.");
  }
}

module.exports = { updateRolesColumn };

if (require.main === module) {
  updateRolesColumn();
}