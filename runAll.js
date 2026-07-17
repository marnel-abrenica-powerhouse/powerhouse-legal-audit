const { getAllSyncLogs } = require('./getAllSyncLogs');
const { syncUniqueFiletypesToPHSheet } = require('./syncUniqueFileTypesToPhSheet');
const { syncUniqueLigoriFiletypesToPHSheet, syncUniqueBermanFiletypesToPHSheet } = require('./syncUniqueLigoriFileTypesToPhSheet');
const { syncUniqueBermanLawFiletypesToPHSheet } = require('./syncUniqueBermanLawFileTypesToPhSheet');
const { populateAlvandiWorkflowIdsLive } = require('./populateAlvandiWorkflowId');
const { populateLigoriWorkflowIdsLive } = require('./populateLigoriWorkflowIds');
const { updateRolesColumn } = require('./updateRolescolumn');
const { updateAlvandiWorkflowMapping } = require('./updateAlvandiWorkflowMappings');
const { updateLigoriWorkflowMapping } = require('./updateLigoriWorkflowMapping');

async function main() {
  console.log('=== 🚀 STARTING MASTER REPORT RUNNER ===');
  const startTime = Date.now();

  try {
    // STEP 1: Fetch documents sync logs and update base folder storage paths
    console.log('\n--- Step 1: Fetching Sync Logs & Core Folder Placements ---');
    await getAllSyncLogs();

    // STEP 2: Find any newly encountered unique filetypes and parse their storage definitions
    console.log('\n--- Step 2: Extracting and Syncing New Unique File Types ---');
    await Promise.all([
      syncUniqueFiletypesToPHSheet(),       // Alvandi
      syncUniqueLigoriFiletypesToPHSheet(), // Ligori
      syncUniqueBermanFiletypesToPHSheet(), // Berman Variant 1
      syncUniqueBermanLawFiletypesToPHSheet() // Berman Variant 2
    ]);

    // STEP 3: Lookup missing Powerhouse API Workflow IDs based on matching names
    console.log('\n--- Step 3: Resolving Powerhouse Workflow IDs ---');
    await Promise.all([
      populateAlvandiWorkflowIdsLive(),
      populateLigoriWorkflowIdsLive()
    ]);

    // STEP 4: Query GraphQL endpoint for Chatter tracking assignments
    console.log('\n--- Step 4: Scraping Chatter Role Permissions ---');
    await updateRolesColumn();

    // STEP 5: Re-map processed workflow meta back onto customer logging histories
    console.log('\n--- Step 5: Applying Relational Mapping Data Back to Logs ---');
    await Promise.all([
      updateAlvandiWorkflowMapping(),
      updateLigoriWorkflowMapping()
    ]);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n=== ✅ ALL REPORTS EXECUTED SUCCESSFULLY IN ${duration}s ===`);

  } catch (error) {
    console.error('\n❌ CRITICAL CRASH OCCURRED IN ORCHESTRATOR:', error);
  }
}

// Fire execution chain
main();