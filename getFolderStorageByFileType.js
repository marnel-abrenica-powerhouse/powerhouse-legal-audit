async function getStorageFolderByFiletype(filetype, companyId) {
  console.log(`Getting storage folder of filetype: "${filetype}" for Company ${companyId}`);

  if (!filetype || !companyId) return "";

  const page = 1;
  const pageSize = 10;
  const searchQuery = encodeURIComponent(filetype.trim());
  const url = `https://workflow-prd-api.powerhouse.so/api/v1/admin/getCompanySpecificFileTypesSql?companyIds=${companyId}&page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}&folderIds=&serviceLines=&categoryIds=`;

  const options = {
    method: "GET",
    headers: {
      "accept": "*/*",
      "content-type": "application/json",
      "origin": "https://www.powerhouse.center",
      "referer": "https://www.powerhouse.center/",
      "user-agent": "Mozilla/5.0",
      "x-api-key": "000647fd8e772d78e35b423895958090525a9f93084d9cd6978497cd8754748b"
    }
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const json = await response.json();

    if (!json.data || json.data.length === 0) {
      console.log(`Filetype: "${filetype}" → No data returned from API.`);
      return "";
    }

    const match = json.data.find(item => (item.name || "").trim().toLowerCase() === filetype.trim().toLowerCase());
    let folderPath = "";

    if (match && match.folder_path) {
      folderPath = match.folder_path;
    } else if (json.data.length === 1 && json.data[0].folder_path) {
      folderPath = json.data[0].folder_path;
    }

    console.log(`Filetype: "${filetype}" → Storage Folder: "${folderPath}"`);
    return folderPath || "";

  } catch (err) {
    console.error(`Error fetching storage folder for filetype "${filetype}":`, err.message);
    return "";
  }
}

module.exports = { getStorageFolderByFiletype };