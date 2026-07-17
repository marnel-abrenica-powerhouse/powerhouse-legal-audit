const { sheets, SPREADSHEET_ID } = require('./googleClient');

const ligoriCookie = '.AspNet.ApplicationCookie=tS9_j4Y8qTbUPZq1fwsSrpOaGHzhLvkdPG4MkdVkgDVfc2_4H0ZnIiJYMy5DG9w7aryJ6BuwiuYQLYmdfynNDNyqlMDEPfh9XVyBFixhMi7GbxLWBvq-im-HBhFDhZLgV1SnfWxIuxWTO_ly2GpUikUuXTHobfMsI-14KFpJSRrF5vs5HUFzCreV9jyNPFG4fipSc8K775_BWSJCHJONFSK8Ad9r5LBdiaFN2XxooArreETrkDEZA9N4kS0KfIehVv_Owa8rePFsaJbCoKibV8eM5iiOiBUl16uiNffkJICwumkixVXNywlrLYuwCAdLSE9X__sADtDzjNRIBLUKSMA3EtWqM1C7xl97YXH3jaZ6-FhZtNy_IF8UvofUkS3ROzcfS_-KDnperg5DaPj_7eR8EqiUYxpsUCtOY0UJSmNFw9RGdg6ktRVDEA4iNtBfP-xZoXYutCH9Poab_GuNrKRKR_9eAnwgA2rRk8L7xTarQiN6d19LFA_qGKYOTtN2wI7sJPh6RPFht5BAkzyaESrBJWyLHCQcaHC2jsmIbJnB179X1ZS81VpkCEBqLaDmgCYMsZkhYkcd2OA0VKA-nbIwT7LBgCH5GReVOZ3WaupG8fYTi3onGzYNcQ4hvcEpxsdwSLF4BD89RE_ZlOycz1g5zRv0CAwkyRvqvetxq_uPrM3GDGDH0AicmBIqxyv9LpuaYSJMO18ggvF1p5QEKGEhglxsGGF3ZcXQDaAXtqSnmIbXzdJ9D9OoJUdRu1loELY6Iwoh0zJbqjyJFsDSeiu4BlQafgs5nPrxgdbEOIYPPH-XAMFsZcQ75pNlRDxoaVdPEFVHar42Yj5LXbaNHpBLHcLoiXOEpYCAZ1F5wzZSDqt9TOUMvuisLMuSOgquqWweKhNIwMhGDVDCPbZLfOJc_uw7x0qqQAvzFl5JjBJvmp1rVG6C7T7rx06AQG3U_xRCat77EJhABw_NgoEfQfCkvbc2I08YsAh8tJ3hVqxGDAuKSvTF1yeBbi2xQYdxnId3_BwBO3Tu851bWvk-8cAbXlAcPLwibuucOaK6nfT0WHaA3SAnmSduLZLQeAog56HmjJW7WXMC5oJVsck7dD_P1j0qxFUGFRc2XHNlFxe-Yl7-tCbtHk59Db-T6OuSzkYTIa1TrpmiQsUHnMlXk8HHHZajXuB5Tk3ZF7mqZEkeZKdRSDDQu5tUtqs9EBxa68RmGqXQxi6dqUB_qmmDB4TcgmRRvV8B9EmipPtBty1VX2i9R2qkRwzKl7l6IiDtGnTRtcLFkDRe7xazzR5tjKaQM8R6kfPEUVwsPSsvEBXA7Dvp1PHNOOt86JUGX4sFCrdiMxwKRwvA9FWY9mxIWfz2tj-jBVwAgcGKVlepOM1Eg7BlMKcK_p2skf6K1jF7xq546nac9ydXCtqnUBDh72wq6lIKtIkZttsLTK20qpMNrWzcCJyj-bHf_MRVNPTQZRjamW49khaif_79eiX-3IWophZJbPX8K-E_KuJ9etzGsT1_xsf7Vpr3VzBURWjPOGt77FslwvMv_roYggyy1eypC-i2TzRBseE20v-HANRyJ4a51V05bY0-WzcKQUV_9eLPHu58j5A2dlWeAhJ3xXoFali9oI9lqellTU-zis_cMnzGsc8P4ED-6Tus03YMxHZIK97eh-4rOAYTeA_zNvRU0JCVRbReh1rbaDpPm9GYtcxhy96ragmXoOQj5ncbk64fQLQI883cI9rERoh9zU8ercz5J7GMshbqCc8pH6UMFevi_RGo470K-DPPSp5Gme-gjZbtJ12emlcavuNQY-FMV6kJc-_dzPNveHir3sjNdWNImgLcq5Xlo-fq7U98tVKfOrMrNQMcyNgHd-b8SWHph_Kv9vQCe3ihPp6aYZhvbSdapxIqpGH7fvbXyCz2jOdW_fAvB5KtQSHq89JZ_SnJjcAlJEsFi-mMdlBEW5-8LIdYwK1J-qCKeNp8I_MSq6qd1TqbO1Hbks98a2HeMw2Rba-5o_OgFfFrffwTGUUaVB6WhideI-LLGHRBEGn9pVLE2SiQVv3gJDsTRFGtweqItXR7wRiQHm1g15S7d-sMFXutGqkPajQ3VbVWBWkKdlhFpj4i4Awak1HBh5QivX4roSt8DPjd2GlzTkhyjcBERorYPC8olrOJWf_9_iTJSRegTySErq9vVt02QiyXQ8kU36VYPAZd5DbQ-I_Qbo_tGEWog-YQAng_85pVL9QCoaznKFJ35lICVNVN-s0e8xFSaDyjPyMN18QoncEfTlaAgUJ1FBNb1jrifkxRy0tB6aDlAIvPGZ7Tk7bv--DIY5KC6pOiHJ4_Rhjrh7AW7NBrlxSt4CZoCtaNNV2xcHDxXN5TJqDobtBZwaM3732ScJOOp45ihy1ZVCww_7AJua_iRLB1dl6N4Ro9_zu5jYNRbFZuHl63q9Qkv3UIG7ijaLv-DiA6r_VE1nsrebawo-B4sSYo4ocYaLzrMe2_S6InmjCvbodFaru9idma8Npb1U7vA4BVB4WU0-r6hFdIE3QSQC-1p2kPMEfm5pBuW0PVy64wgoRke2JvirLahF2782oTHPTIN7ZfigDziqQ7tIutLcKKt4qVwpVHkYlz5epJlGTsENTzinAQ8v3cRJ-fomizDFbLRQ8SFGs7vvKQnzwvXxI9JvAVQ3mEJZD5L_hR0658IyVycgAcTyKYew2q82UUToPWhdCMBAgB8uUrTFkGjMnmkZBPEUtFqejEsw6UazbEeEN0wPb6dkCvZz0nSaKtwUKU0-Z4jNMxqQU8bbq2qqRTBZY0bwvKQLPzIyACEqtM3loZLlwqimeGtVJqJfLYzqAiM8YrzuUZNjAFCf1eLQZW4J4xGnMhODlv9ZTUjz2p-XTDnHpl29qAXaemd7kFlFviM70J_wzYgofnVKPCIq9dTsJZ9zcnOmqVaxemPoK2nXn70WL2eirJ1pYCMsX6IxDDnEyUlqRsEjAXi0oRlQ3acXLN23fJR16e2deQSrcFBX3GyvIOuaGQXfb81zMFnKlxj-IHG7XOZrkzDY94iVwz4bBOwz_AV-ER-4T-WIzNgNKP5iQJFB8kE3GouSUtjU8qyaXGqI12r3gFvMGXXOZPXEOr0UmOaALaH5gZrMVHJUOeLnuF-fi93ha-ASD9qaBjoxZVMsq2A-aF0vIvWb2o4bi5EKS27sDkCEwbyWcDSvBPw77rv85K1OiTrxzOr1Po8jEtXMOuZs7usCYIpsIGqFnjr-zw64EqJ5KBiAR6htDw6DHvtEUuMiF6HL-VodkYvTWOjT2ljy66Rwqan3lzH0q5ozxwnjsMddnGOiawx8eL8SRF-18gQzV9yrBMOfWEirQ302HN8D5dM8dl87JqZ3FmQj1ULd06YemY95t_cc8Fs1eqyjLLuOi3HId0cM0v7IXGZZshkFZLcFkdy4oWYtCwPnGOME7zNxruXukwHygZlSN503-Bj8sua9pILwPNBB2vyk5DTBuzzHs0PGYUKW9Zc4RswkR1MGcTKdOPzhGyjHI75dRjvWIbVTfb8YViam7zn3hbU4CsLI_0-kRFQKjSs4cr0wGUk1XGeCNOiMs3XmuwUjsqu2DXaAlzAcVWNESpiipPOrspiVRZUFK8ZoLcy5ONgtdNPUhLzIijOOKb95Krp6lg4Urro9UGH4O1GB2xFeVMcbdTTUmUtLw9jUhaRBgqxBA_g4KJ1rMvf2cnAUZa_R8FvrEoCAS5-9jEz5Wjn9PrNm-mZ6hf04WtFiyCOAZeExWRKTbmQymE8MxAwnmT0BiV_OCG4GpTS-JFKRhV0CZ9BqR7sqa1fQfvI526v8rgoMuvmdQ4CdQD9MJxY2JDps6AqMIj0nhLbyY3Tcb6gounKkYfEhJPLN5cIm2y7Z-R-SmUP6WSCiUaslmeRG-jZIrRQpWvSnQ-b6-XTi-QziPvTyKy53C_Y63ear78Ny9Rm1wcNXH3KtiC2T3g-1dpLNFTBo1PsBO_aPA';
const ligoriDelay = 2000;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function executeLigoriLawVerification() {
  try {
    await verifyFolderPathLigori();
  } catch (error) {
    console.error('Error in auditing Ligori Law files:', error);
  }
}

async function verifyFolderPathLigori() {
  console.log('Fetching sheet timezone data...');
  const spreadsheetMeta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const timezone = spreadsheetMeta.data.properties.timeZone || 'America/Los_Angeles';

  const sheetName = 'Ligori Logs';
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:T`
  });
  const sheetData = response.data.values || [];
  if (sheetData.length === 0) return;

  const totalCount = sheetData.filter((item, idx) => idx > 0 && item[0] === 'false').length;
  let totalVerified = 0;

  const batchUpdates = [];

  for (let index = 1; index < sheetData.length; index++) {
    const x = sheetData[index];
    const rowNum = index + 1;

    // Col A is Audited (index 0)
    if (x[0] === 'TRUE' || x[0] === 'true' || x[0] === true) {
      continue;
    }
    // Col N is result status (index 13)
    if (x[13] === 'pass') {
      totalVerified++;
      continue;
    }

    console.log(`Verifying ${totalVerified}/${totalCount - 1} fileId: ${x[3]}: ${x[4]} with caseId: ${x[7]}`);
    const caseId = x[7].toString();
    const docName = x[4];

    const rootFolderId = await getProjectRootFolderIDLigori(caseId);
    if (!rootFolderId) {
      totalVerified++;
      continue;
    }

    const fileDetails = await lookUpFileViaRootFolderIDLigori(caseId, rootFolderId, docName);
    
    const todayStr = getTodayInSheetTimezone(timezone);

    if (fileDetails.docUploaded === false) {
      batchUpdates.push({ range: `${sheetName}!N${rowNum}`, values: [['Missing Upload']] });
      batchUpdates.push({ range: `${sheetName}!A${rowNum}`, values: [[true]] });
      batchUpdates.push({ range: `${sheetName}!S${rowNum}`, values: [['File not found in Filevine']] });
      batchUpdates.push({ range: `${sheetName}!U${rowNum}`, values: [[todayStr]] });
      totalVerified++;
      continue;
    }

    const folderIds = fileDetails.foundFolderIds;
    const folderPath = await getPathViaFolderIdLigori(caseId, folderIds[0]);

    if (folderPath === x[8]) { // Col I (index 8)
      batchUpdates.push({ range: `${sheetName}!N${rowNum}`, values: [['Pass']] });
      batchUpdates.push({ range: `${sheetName}!A${rowNum}`, values: [[true]] });
    } else {
      batchUpdates.push({ range: `${sheetName}!N${rowNum}`, values: [['Incorrect folder']] });
      batchUpdates.push({ range: `${sheetName}!S${rowNum}`, values: [['Saved to ' + folderPath]] });
    }
    batchUpdates.push({ range: `${sheetName}!U${rowNum}`, values: [[todayStr]] });
    totalVerified++;
  }

  if (batchUpdates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: batchUpdates
      }
    });
  }

  console.log('Execution of Ligori Law Verification complete.');
}

async function getProjectRootFolderIDLigori(caseId) {
  const url = `https://ligorilaw.filevineapp.com/api/projects/${caseId}/limitedProjectFolderTree`;
  const payload = {
    descendantFolderIDs: [],
    maxChildrenPerFolder: 500
  };

  const options = {
    method: "POST",
    headers: {
      'Cookie': ligoriCookie,
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) return null;
    const json = await response.json();
    return (json.data.index.projectRootFolderID).toString();
  } catch (e) {
    console.error(e.message);
    return null;
  } finally {
    await sleep(ligoriDelay);
  }
}

async function lookUpFileViaRootFolderIDLigori(caseId, rootFolderID, docName) {
  let returnData = {
    'docUploaded': false,
    'foundInRoot': false,
    'foundFolderIds': []
  };
  const url = `https://ligorilaw.filevineapp.com/api/docs/project/${caseId}`;

  let docNameCleaned = docName.replace(/:/g, '_').replace(/'/g, '_').replace(/\//g, ' ');

  console.log("Searching for Ligori document:", docNameCleaned);
  const payload = {
    "offset": 0,
    "filter": docNameCleaned,
    "sort": "uploaddate",
    "filterSingleDocID": null,
    "folderID": rootFolderID,
    "skipDocIDs": [],
    "isAscending": false
  };

  const options = {
    method: "POST",
    headers: {
      'Cookie': ligoriCookie,
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) return returnData;
    const json = await response.json();
    if (json.data.length > 0) {
      returnData.docUploaded = true;
      json.data.forEach(x => {
        if ((x.folderID.toString()) === rootFolderID) {
          returnData.foundInRoot = true;
        } else {
          returnData.foundFolderIds.push(x.folderID.toString());
        }
      });
    }
    return returnData;
  } catch (e) {
    console.error(e.message);
    return returnData;
  } finally {
    await sleep(ligoriDelay);
  }
}

async function getPathViaFolderIdLigori(caseId, folderId) {
  if (!folderId) return "";
  const url = `https://ligorilaw.filevineapp.com/api/projects/${caseId}/folders/${folderId}/partialTree`;

  const payload = {
    "descendantFolderIDs": [folderId],
    "maxChildrenPerFolder": 500
  };

  const options = {
    method: "POST",
    headers: {
      'Cookie': ligoriCookie,
      'content-type': 'application/json'
    },
    body: JSON.stringify(payload)
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) return "";
    const json = await response.json();
    const folderName = json.data.name;
    const prntCount = (json.data.parents).length;
    let parentFolderName = '';
    if (prntCount > 2) {
      parentFolderName = json.data.parents[prntCount - 1].name + '/';
    }
    return parentFolderName + folderName;
  } catch (e) {
    console.error(e.message);
    return "";
  } finally {
    await sleep(ligoriDelay);
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

module.exports = { executeLigoriLawVerification };

if (require.main === module) {
  executeLigoriLawVerification();
}