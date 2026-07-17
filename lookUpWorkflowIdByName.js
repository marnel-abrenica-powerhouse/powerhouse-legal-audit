async function lookupWorkflowIdByName(workflowName, companyId = 164) {
  if (!workflowName) return "";

  const url = "https://workflow-prd-api.powerhouse.so/api/v1/workflow/get-workflows";
  const payload = {
    company_ids: [companyId],
    page: 1,
    limit: 10,
    search: workflowName,
    is_deleted: false
  };

  const options = {
    method: "POST",
    headers: {
      "sec-ch-ua-platform": "\"Windows\"",
      "Referer": "https://www.powerhouse.center/",
      "User-Agent": "Mozilla/5.0",
      "sec-ch-ua": "\"Google Chrome\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
      "sec-ch-ua-mobile": "?0",
      "content-type": "application/json",
      "x-api-key": "000647fd8e772d78e35b423895958090525a9f93084d9cd6978497cd8754748b"
    },
    body: JSON.stringify(payload)
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const json = await response.json();
    const workflows = json?.data || [];

    if (workflows.length === 1) {
      return workflows[0].id;
    }
    if (workflows.length > 1) {
      return "unsure";
    }
    return "";
  } catch (e) {
    console.error("Workflow lookup failed:", e.message);
    return "";
  }
}

module.exports = { lookupWorkflowIdByName };