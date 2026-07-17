const { sheets, SPREADSHEET_ID } = require('./googleClient');

async function runReport() {
  try {
    console.log('Retrieving spreadsheet metadata and timezone...');
    const spreadsheetMeta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const timezone = spreadsheetMeta.data.properties.timeZone || 'America/Los_Angeles';
    console.log(`Target Timezone: ${timezone}`);

    console.log('Fetching sync logs from API concurrently...');
    // Fetch API logs in parallel to optimize processing speed
    const [
      ligoriFailedSyncCountToday,
      alvandiFailedSyncCountToday,
      bermanLawFailedSyncCountToday,
      ligoriFailedSyncCountAllTime,
      alvandiFailedSyncCountAllTime,
      bermanLawFailedSyncCountAllTime,
      ligoriSuccessSyncCountToday,
      alvandiSuccessSyncCountToday,
      bermanLawSucessSyncCountToday
    ] = await Promise.all([
      getFailedSyncLogs('246', timezone, true),
      getFailedSyncLogs('164', timezone, true),
      getFailedSyncLogs('216', timezone, true),
      getFailedSyncLogs('246', timezone, false),
      getFailedSyncLogs('164', timezone, false),
      getFailedSyncLogs('216', timezone, false),
      getSuccessSyncLogs('246', timezone, true),
      getSuccessSyncLogs('164', timezone, true),
      getSuccessSyncLogs('216', timezone, true)
    ]);

    const currentTime = getCurrentTime(timezone);

    console.log('Updating Google Sheet dashboard in a single batch update...');
    const dataToWrite = [
      { range: 'DASHBOARD!B4', values: [[bermanLawFailedSyncCountToday]] },
      { range: 'DASHBOARD!B5', values: [[bermanLawFailedSyncCountAllTime]] },
      { range: 'DASHBOARD!B6', values: [[bermanLawSucessSyncCountToday]] },
      { range: 'DASHBOARD!E4', values: [[alvandiFailedSyncCountToday]] },
      { range: 'DASHBOARD!E5', values: [[alvandiFailedSyncCountAllTime]] },
      { range: 'DASHBOARD!E6', values: [[alvandiSuccessSyncCountToday]] },
      { range: 'DASHBOARD!H4', values: [[ligoriFailedSyncCountToday]] },
      { range: 'DASHBOARD!H5', values: [[ligoriFailedSyncCountAllTime]] },
      { range: 'DASHBOARD!H6', values: [[ligoriSuccessSyncCountToday]] },
      { range: 'DASHBOARD!K1', values: [[currentTime]] }
    ];

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        valueInputOption: 'USER_ENTERED',
        data: dataToWrite
      }
    });

    console.log('Success! Report updated successfully.');
  } catch (error) {
    console.error('An error occurred while running the report:', error);
  }
}

async function getFailedSyncLogs(company_id, timezone, isToday = false) {
  const url = "https://workflow-prd-api.powerhouse.so/api/v1/workflow/document-sync-logs";

  const payload = {
    company_id: company_id,
    page: 1,
    limit: 500,
    status: "Failed"
  };

  if (isToday) {
    const todayStr = getTodayInSheetTimezone(timezone);
    payload.started_after = `${todayStr}T00:00:00.000-07:00`;
    payload.started_before = `${todayStr}T23:59:59.999-07:00`;
  }

  const headers = {
    "accept": "*/*",
    "content-type": "application/json",
    "x-api-key": "000647fd8e772d78e35b423895958090525a9f93084d9cd6978497cd8754748b",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const json = await response.json();
    return json.pagination?.total ?? 0;
  } catch (err) {
    console.error(`Failed to fetch Failed logs for Company ${company_id}:`, err.message);
    return 0;
  }
}

async function getSuccessSyncLogs(company_id, timezone, isToday = true) {
  const url = "https://workflow-prd-api.powerhouse.so/api/v1/workflow/document-sync-logs";

  const payload = {
    company_id: company_id,
    page: 1,
    limit: 500,
    status: "Completed"
  };

  if (isToday) {
    const todayStr = getTodayInSheetTimezone(timezone);
    payload.started_after = `${todayStr}T00:00:00.000-07:00`;
    payload.started_before = `${todayStr}T23:59:59.999-07:00`;
  }

  const headers = {
    "accept": "*/*",
    "content-type": "application/json",
    "x-api-key": "000647fd8e772d78e35b423895958090525a9f93084d9cd6978497cd8754748b",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    const json = await response.json();
    return json.pagination?.total ?? 0;
  } catch (err) {
    console.error(`Failed to fetch Success logs for Company ${company_id}:`, err.message);
    return 0;
  }
}

function getTodayInSheetTimezone(timezone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const parts = formatter.formatToParts(new Date());
  const partMap = {};
  for (const part of parts) {
    partMap[part.type] = part.value;
  }
  
  return `${partMap.year}-${partMap.month}-${partMap.day}`;
}

function getCurrentTime(timezone) {
  return new Date().toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// Kick off execution
runReport();