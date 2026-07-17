async function getChatterRolesByWorkflowId(workflowId) {
  if (!workflowId) return null;

  const url = "https://product-api.powerhouse.so/graphql/v1";
  const payload = {
    operationName: "GetWorkflowById",
    variables: { id: Number(workflowId) },
    query: `
      query GetWorkflowById($id: Int!) {
        legal_workflowCollection(filter: {id: {eq: $id}}) {
          edges {
            node {
              legal_workflow_nodes: legal_workflow_nodeCollection {
                edges {
                  node {
                    type
                    data
                  }
                }
              }
            }
          }
        }
      }
    `
  };

  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://www.powerhouse.center/",
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyZGd5aG5ta3RsbmFzZXh5YWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwOTUzMDgsImV4cCI6MjAzMjY3MTMwOH0.nhY1weTsxGT7hDFQF4sTFB_wD0XjDqPcykobDI0HxgI"
    },
    body: JSON.stringify(payload)
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const json = await response.json();
    const nodes = json?.data?.legal_workflowCollection?.edges?.[0]?.node?.legal_workflow_nodes?.edges;
    if (!nodes || nodes.length === 0) return null;

    let rolesList = [];

    for (const edge of nodes) {
      const node = edge.node;
      if (node.type === "send_message_in_chatter") {
        const data = JSON.parse(node.data || "{}");

        if (Array.isArray(data.roles)) {
          rolesList.push(...data.roles.map(r => r.label));
        }

        if (Array.isArray(data.groups) && data.groups.length > 0) {
          const groupLabels = data.groups.map(g => g.label).join(", ");
          rolesList.push(`(${groupLabels})`);
        }
      }
    }

    if (rolesList.length === 0) return null;
    return rolesList.join(", ");
  } catch (e) {
    console.error(`Error fetching roles for Workflow ID ${workflowId}:`, e.message);
    return "Error";
  }
}

module.exports = { getChatterRolesByWorkflowId };