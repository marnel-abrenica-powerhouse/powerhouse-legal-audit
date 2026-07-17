const { sheets, SPREADSHEET_ID } = require('./googleClient');

const cookie =  '.AspNet.ApplicationCookie=dgYM37_6I9n6opo4kuXWaszDsfxBXG1BBiUmhNk1WZFbqevbXvTos_1htqH3maA3DShafEjd0jH61pWt3hdhN-Ki0fvj_XYLYCNT-xMIFs0brLjd1OYFVji7DiKctos2XoUAMnfva2CU6_QLQRUtTDAPQXbkKJaB9dprmj8rYTWXqh9Zfb4dMBDE3toSIwxAq8xROCbFZG3ZsWjOO3lLBm9R16yuQ9zRBdHJx8PnxbvKNyNZCbKqeJLqOktuKupv1cOrtKjZRU0ZEEhl2yRl4PxGGZRRqIL8TN6xLK4tTbRDL0DgSm_eTFNKAUSDqOB9oFCXLiFfwF0AM4kAvn4uJ2_STDcAuIaTCGV9iF2BZud6ueJs0EAXjJhFGdgd_vRdxpRySWRbxr1eW01Jf6GwV-9-gNHulkwOlPRNKIVINhDlPmdohoW8_xQg0ZOQPxXT3x6bb4lqj-0Dsw5KUzlJrwszPaNSJBfDX-s7FndVAdjbRX892fkDjHl7OAG91o8ZsLnGqr5sxeDPn7RsO3nCoU-X7tJPCnvuG_9fCYzjPVuHdqn7dmcOgpyDWVfxV9-E1DSVhzDkLlxuCFx9E3bRoOlz3NFC8uDhZzkjEDfZTsQJotZymUOLGHMDvuqKmSMLxb4AgU9JPU4GN0WNtDQoLjMMBMofm_hbjkyPnpfY2yUc7FfIttigWtJIb6fuiAOl1E68i014sxku2Eibgl65V7fqqoQlD4pRQ6nBF8L09Q3Q6UXD7LWrL30ONw8PkvgDISGtKOOhJbgPysvvEq3U0AHVqV1HeUEj-IRzEvyqsxTXXqcnOik4T4VzqD8ygK9MTAZ2agXM826Qt7qPk6euDNl-kUlq1n2ueFpyYpgeS4xgwnAhEjuI1RvhuvNeI5TRmi1c154tBl7kohWvLvZP8AWcUZsyu6MNCUrWeeLJ_1eBHz_Bl4vox8qi69UYyBUFsi1DDd3_p6KLG-AnexVpEQCg0YMjbLJ89QYz85WoGMhkdrzLZ6vMz51EMXNmwty40dzd4n1DjBfyMCcnVBWqjJsukFEqWGzOPaTeC4lDGbCLrojZPF2EHKbzt4NDboXOUZtxMzuZtwlpiRXsqPhwA98eyLO-1rSQBNTAE8kxHI0O9ALlMsoS4ipv0qMI5LUL1rwCJlSbd6HhGxisb4amjKefl72spGx_cvydMJ2nZH3QW1WqNHuax2q3ZlEuNQbs5gn8at8X_bGX-ZKzCAveiu3USGUA808Q8H7rrp3-KsgLHjWi5Li65YuTUH6o7jvfgN-gVPHP3VvarZOYQaKkvMd8sv1eJYFKZrDDe2ORDAz5B2fq9KSmIf3pal2-_y8c12TfZ3bpgSmNtdpLIHFJyTGMOQ0Sq05ETtnsc9PZI2zJ1A_jEZbSpGQUchWPfe4VKkURqNxctILjzkwbvRcnu5rw9FW4XLW020NvVPYqXQyzVJnCEyKfRYatsdF6WXdlz_471c-8Bhawc46PqwIMDs0tUHYk2t0AYzVtIgS7kMWMI4OEbfLuCK-KpqITMkXKWqtwma6M2NKwIA69V0fP3FwGwJQPf5cbZtwGOIdB6JaXut9IkHFQzETmAREhrdNltZAbG_mqOVBbvk6_Nir074f9eG9oVzuJNCWwkQt9-FX1ElTe2H9YKrsI8tGr_CdPqdgm679kFpysez7lUKec2ghBIUAAdcuSPZYwO_XMvc260X_JSuLTBF-bAFNV3-Kd7EjdDr0prPuVaYOw187Rl7BWBFBWK7fm0tREL11On8VmrE5aeVD9QfUtuAzN4ALvjokxy567IGS__sJgPKjpjeqobAhdXgg_p7o17mrUMhjRiRv_xZdbT806FVc8RG3WhChrXizDtpD4OB-ww3Rz0wKndta9nBLhfsHyG-PmhtCMqQ5Oq7xhr84NBHwkI1ys1kpC-aBdezVV71dqCryym1MtkM4H3D2errULtmCv6UTGV3_u2F0riIqYSFWfLDtpUbyT1A4bPIJZE9eoSdFx2ep1VEQAUKjMB0L2I3OjUDENYEmET_MqXSdyLUN4DaAgLugOpTmiiGsYDFJiePvrSZll0_0Nljynd6uD-CZ5RXApXwvlFhe7CkZfio2xV9s7yhr376aFpWtBktzDxT7U4kXZ1Qt3zOhUpAkuSC6bxAlj4IcEGjnbvilzyXUafZGePQUShvZnKWX6nIQphI4-a8258h6sSkEwq-DyT9NNLeUpZ_NkZ7yd85jr4ACmTa3ePxwtPQxcPAjhbPWxNa1yYGukmFrczrx9nEuEOeaMRfWtOqbeyhcJNjy9vmpGs--xRm0swDk9zeuP-OXX-bcP6Ju9W4cioKmsOewmZek01csRT1Vze9UM2nutj4FfrMPqgIazyIx_LKyANXF7CwNhXBFuksJBN-ftqcB8Ng3jdVyseZmkzEU-USVVc8nHyvW47mwobzCFnmn2tiCf0maWAn3dZjnnU61MYbqtot8yopabt2omrk4_fAbClPd29mt0lIReU4qMI-6wuKaj1dLIkvvkZecVtMo3rQxzaxo0FMsNx4-iYa4dVgkhyv53_fpl7mW2j9YWFHnbeOICduNNfGOH5ieJjrHIwTBtRcK9jUkVQ_3eknvEFocN7fukFpY1KLQqd_UqV3lASfBe-3AMBOU42l70IfPIpHbHnQTajwG9P2_RShBEoPYbyeGV3qaRJiGXjIrcVIryrBYeSumwh365RWr3ZSxOrrcmPdxogzYS5RNG4SWXqkQ1dpfrAp0j88iSP9cU9DdOjzQuCzGYTjgV_XrUY0TZO5KrNqO0lP3ptSdDGelxE-ZwwUO__X60GSiys8Q9ZoE_gwHBdn0d837n0mvStThwYBP9cCyqhaH4OOB-z51xYt1DXRqxyHGuavD9xSUV2oaG6uJe0uKI4b-hkckZJaYKzmAwMAOvM3J5ov0_joxWYvSiIrZ7OwAlJBwgTdN2HF4n81-ZLEjz7XzeNokIn_oQf32Qgh80nkulo0Ud6wHlX0gLfQPp9DZ43mEQuuyTxy1lXCBNgd75d9IKBdhalVe4IkM6pkOaQ-5Y3SYRib9Q09efJ-_xU0w2L1TAggQu9RNd8aFZ8fPnSPMlLPul2FgV2hY7qmgWUpdGDjaGOWvHXyIa1aH1XBZ-B7AVeZ0Lv8L8SxRMnnRrd2OmEIhNyJWM1jruR8EEmp_CoS7-pX2aq4lX7iKOD-HLDNmlJdH-vF_C1YR2MBYIZJcK8KxisF4-LI0Y6HgmfKmZBmHBpWNzwwI_9Z_tZCDvAokzphbBBfgKmT4woojnilza_pmAIhfq-_V04mPZ53aq_XFJb9xWKvFaQLl96-1A2akZIzaJ6EsHs5yhYhwEDksHQTMOeTfiUVcly1BBoX4aQZWuv97e2qEdvLyiFoD89msZcS4mrm1zoVtHD-3D7M1hprrlXa4QjeEVWd61AQiB0s3IaszAX_BUOMzKDowt5MlO4qKB3XkCA66yVvOAMkmA70RTDbW06eGby_xkw5tYxDVhQidgNuDlQ3Ze80Fds6RGWs50Un_Zwg479H4Ofd_xyjrTn54-g9_gNaeV8JySKrUz6MQq1dTwlA6pBNl-YIkXMqFFnxILxOzSkj_MTnsUue-RwQC8CCDrn4q5UgLtHFLMbQETpYz-ZlvJu7dT2y57RbughKbGnusU7oKHxMrY45eFV7hnXqDKT81xq6P2w6k6_HfhQH_oGk8I919YqAaf-O4ogSnedmSsKb66GvImhSOooq3Cb9NZ2mk_8rdRVzoutvQxqyTdEQLG31PEuzn7BtgisAU86xi6Lnu2PpSwtJ4-KhQReU2TZm0KOUTX8njgY4G6uGk9rsCYkLQf_a5K8ocyld13_tam0ykAzp18HidH_9hizDCy8Ov4iJEpwFn12bMIURX_zcNzXvqxX6MlQftHiElry-ukc_yGqjx6NTHki6eKD_Bz5yE5SV_2qrSgUi5R9zn7R1ELjCUxcRkhhjChI45fTY0LXCAJ1OqYYi5pZ4-5mVDTIy_-YIXjBALi; .AspNet.ApplicationCookieC1=Yresfmeba_qgQdMYMLzEzgoYWIXBrjwWuuNJBO8Pesj0SUp7Hm5AXAQpKmEWVdBNln2sfo9wvskgNxPpOo842f6yluzJeRpOWNxJuOhS9oNvwxMCgnm7ZJzhZZ4T_1knSOi4Q2eyUE1KQOQSDbuXoH9Ta2ybm-PoA-6Wz_X1lsEaqHsnm7TQizKFOG8e3XRZv6RWPkcJGOVtvCXQdUHxQYJDxUNYOglKEQTJuD-7mq56UDuwQcIfRDChN5hWB4z08CX3fc-g7rTDd5g0bSfot_st0cCdvtzbA2CDs6q-0QtYBiQi1Q3p31gH-oRbY6lWvzShhoxOhoA0OAGtxMYP7-DVDl-A_mvrS-piQqeHJqVyirQKPGLpSzdxzSgp4Atp0TNzVyx-Sc2V63PNTPqTcNYz3hSkb301EudCohpryoUeQRdwz24PJVPu2xd9-ShjxTSkXuT2Q3l7OoTXkDn45S8B7MulTJehwB6hiunPSEuCw2j-KAD3EHrWhbI_U-Y_ni4Rjxm4CiAFq3oEjZTIQYqPKcdTjo2QChqKOw3K5jvu_KpOMlfKAVXDu_gqH0IDlMFE01YFzH7dVB-ztTQIBUfRDCZA_JBL9PU6NZgc1GNdGs9zzzyxCJADr3-JRw-t0kzQC4ezRkS6T8RhF1Qv5pvrBx73n_fqNcoo4PmoknRZdw6vXr_oE6NFk93z_VF-8Asb7Ywyos2st83EUo5UoL1yUsIOZkcywd6ltO1bHpVveQPC0s64p43v5BcW-pc8f-SSiYYoYaZOtLQ9wLfYiFoBXl0OzDiNYgtzCo0uD3CFdNw1BDCFMSK8bkEgqg6PiEwfLj10BgDHcG-pHpq4eSrBih4JbTDIdDFjS3B0ZfKNjsyWZoGbty9I7_JqayrurORiD6pIDGaMezzrLI182Yy7-DFQ4Ur7HDlP4qY8MZ85biBvVCbmgur57nhZR2MU_w5QhmPwDrSQFUwguNhaLspWFdxpU1yfq3oIcgwLNcqMLUl_PhW_Gugye9EOlC5xV5ZrpjXNr758kNiues5sWubzXhcbgprJC1H8N_9Mlm-adQkZ0P1L1jBNgrSwlfSXt5OuTm8922L5ExnMJbmZ9PJhjRtDtL819E-7nIoSy8fpTHWVdKDYUgEZ1gfw13OdCaFITmfzyzJenc5svhsw2BFQslndHIpIFAjpYc99WDlUGwdjH8pqjr8HodwYvAlMG0Ag4JHFYQTAoolyKUB6P8hyCwhuS01-79wHqVaF33rlRF-4x1HRT_Et_BYVfBdD1U7Vuh34DkSzU-wIEAMImbgQPOtBXAjDYU6v-21SCplM_rmt5rwoILadU89olxJzZ1yDgf8AdgW5V7fkde9wN74kivXcJyVqDKS5OX6Y0M1NYOVOMCcVQPnpr9TM_Ly_48UnlpyjEUHhdQwtgXIC5gQ9A6XlZakO8vwYQZvfsuIiGOJScMlpMJWaQWfZy3WJ2olKzwv9zanihtAgq3aUSE6fdSHILo1VxwcMArGqO2RUb6N6pHZdlDZp_pAGPd3Ubj86cktmr7dTCs6yo3xM0whR77qdn8RQ0wXZsSU-XivqkWP1SDo9heVr02E0cldCiSI5WDWyAifweMBZyvj5A8DPzevcz75Pme3JQnEg6tJ1aRgcpIQ4M6uBu0uA0nOj2uiR9CigAn6g4wUGkmPZDPxYXxCVN8ugBHHnJz_OWQnykWfS_-WyylyQgotMKKRCgs44zEefEQUqSLtphsMTOUM5vfWvEVjjMrwC4fMN-ZwWUN5C99r9yPqphM_pKvxrOF5SLCCEypwKNcamhEMpkb8V1A3NCN2f86gXJfGCPI4Lti4V5t-oRRKhA65vhvjcPrvZrmsUPGF_ifIwkY2nlPOB3dmcfIrXoYVOFbX0cq6Wqlda04da0RrejbOMfEpmfTUQASWz85engDcKZ8-7dQYzl13_0FGgsG3QCWRrRj0S0xzbN9USXeXVQPyerQKVSjSzqo8PmmA_r-1AWKNq_0W3EmEg-mi_O4ETIa4qCfxyGCKPCW6A812X3maxl3QBQIv_s6GwBv91wjJMbqST-WxYqYOeWwgW_Ko9W8ojKE_5lZ0fOdhC7B2xl5oByr_jTdfFXiVx7RV2kFLwK7kgBBzAkANsRXkSkpzNzTcIuxLtM3FQbuSrJDZCC0giweJTKDcfE4UyZVbGIGDbzCoAkzIGLe_BUeag56tr-8UU2A7pSWTllVQYPZ1aRM5Y-ZNraGkHaQlG2CY4vU7lF0w4kbp7mQS4OFjqZHbVWaP3OjdHT7niIVJdQPsZsUpaxhh5u3OGmqo4BOZl7FTMwqKGO7dXaiUQFvLJuEfNmzWrw_Iv4ohH9ui6lf92a9CwmkCVkGTHw1PaAxsthV2hAbZ7N0ztCQ4cx7ushAUFYk32oyVDL3G-ZQjgv9KuBX4JC2p1HbL7e2c7aKQSgqChm8GWFJNuGd1DYLlQ_qwjeNC3MMc0XB8q4Aswsnc8nrojKopWV_Ovn1zOcyFi0r3viLGeGlFqA0nJ6iboDkI0_08YX8tiXlh8OSrHKjtj5qeszaZjwmdXcYFeRV3_AuYJrsYc2nToRMoFlo2GRk8aSimOeh4p5AreM0NT2U0TozDRXokBXoTxO29N0lKZeb2kD8V-JPCHgYQkCblYfXF-sQ_CUoim8Obr5CIPOHLHXVZWYBfIJ44f4oemFrnotwgHKg78mmKbijxyBUl4lFZ8fvYOtgUgUwa0jENVAZE_D5qCYjkhWrkHPwA2i5yhNVU_B4Z0sVl3E9cYRcLYYi2r9pz46rVfjt1bDjOok6SjOYqImuFI5qfUHr8YWHoghGvxQOw30zo1yNdFKtx3j1mJcsXOnmoBn4VKUA7PrMMsviPboma19yuFInD3w0Ov-Q1jiAE_LTu2BqRK2lFw2aIVKE7MsMq-x6jmYeerftRf4rkSPbuRfRDdgOK2OOsOxCVkKEMYaKYPoGLdmJIbNbMG73IPkD_DC7u4uokcWtjzCWpDQEwfKlf-_SLr8kyLvdoLtgYnuZpqhH8s81p9jtSQtZupl_jEj3fMZEnhn0JDiTYf41Ji95gjBjbYXih7eFC3mY373Y8_QncuOFANtvr20ZJvnkMVPEizmmAO4H04JwxO_-hXKwd30y0uonyrASre17SrouGv03GGdUjffzJAsZIA3Ufo0yJikhFHQR_f-eZjDM-zLcmX_Puh17HYtW5wPieuAaKLYBeKNMY1Z1_asU8kWnteRjabEf2nuNmoe0n-TQLQOCRlcv4GpWuNYIYhMm0XIDmp736WS5vIYOjdyRqFciKevcb_iLFSgTCcG8tSI5jZqjVGpMRF3cApK0Y26cs-suAtUdtYovLjHgZy3vBek67FxxmC97xGY0NZUVN4mZAYQjkMlmd3QHqBuDC5zY8VwU_3hF3DzPHCNBtUGFi36HCYQFX_Mwx8GCjIlI8M2XANVpNO2tQtE-HiHp0RY52EYsMX4pr_u1LoEq7LdoN8TGLz2xC35VmM3QHskgPIZCgLr3PHgjGnyf6o5YOzltEzismolQ9JGlYEFdrNA6Eu7N5NrbgZMlPYDTSyv3EGSDemxQJrT_T8ZX0Fk4xhpsfA02T57QcYZtl7l9HTX3zioSBaK-HnoEV5Qvgp-fGS5izGVNoHtwIIoEh3_g7vkYKdi3Dkgpv8x4MB7v3dte_OwhclrJnRKzxKJ_1V_DVgFFqLC1Vs7M5RbQGbAWj9VwOKID4Z0zyJk28iOBZDqagHunpah8VET6HzqGkTzDZAlN5k02ivDNyXBQc7QShfpUpPqB3KHIDxZpxvfhxwjagiV_ozdqHmVQQWLn6PCzwqxSvDnBsmi67dekbcCpDDSjMlGveh-lpLmPh2r0mrt_5bdZAP48Ou3cCWOtIr0YGXWdEnvCxM3fz6RXDo4YwqIS2fKFnerwj9yFc8FIiaXbdq7EXUn4P3iQvDG8YDTe5YWiHLp3xj9uMwldVieatsIEevGq-1rUnD_T9ewZK2RMlZNZKp1lExlAWwC';
const delay = 2000;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function executeBermanLawVerification() {
  try {
    await verifyFolderPath();
  } catch (error) {
    console.error('Error in auditing Berman Law files:', error);
  }
}

async function verifyFolderPath() {
  console.log('Fetching Berman Law Logs sheet timezone info...');
  const spreadsheetMeta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const timezone = spreadsheetMeta.data.properties.timeZone || 'America/Los_Angeles';

  const sheetName = 'Berman Law Logs';
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:L`
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
    // Col J is result status (index 9)
    if (x[9] === 'pass') {
      totalVerified++;
      continue;
    }
    // Col G is Case Name (index 6)
    if (!x[6]) {
      console.log(`File ${x[3]} skipped: Remaining files: ${totalVerified}/${totalCount}`);
      totalVerified++;
      continue;
    }

    console.log(`Verifying ${totalVerified}/${totalCount - 1} fileId: ${x[3]}: ${x[4]} with caseId: ${x[7]}`);
    const caseId = x[7].toString();
    const docName = x[4];

    const rootFolderId = await getProjectRootFolderID(caseId);
    if (!rootFolderId) {
      totalVerified++;
      continue;
    }

    const fileDetails = await lookUpFileViaRootFolderID(caseId, rootFolderId, docName);
    
    const todayStr = getTodayInSheetTimezone(timezone);

    if (fileDetails.docUploaded === false) {
      batchUpdates.push({ range: `${sheetName}!J${rowNum}`, values: [['Missing Upload']] });
      batchUpdates.push({ range: `${sheetName}!K${rowNum}`, values: [['File not found in Filevine']] });
      batchUpdates.push({ range: `${sheetName}!U${rowNum}`, values: [[todayStr]] });
      totalVerified++;
      continue;
    }

    if (fileDetails.foundInRoot === false) {
      batchUpdates.push({ range: `${sheetName}!J${rowNum}`, values: [['Missing Upload']] });
      batchUpdates.push({ range: `${sheetName}!K${rowNum}`, values: [['File not found in root folder']] });
      batchUpdates.push({ range: `${sheetName}!A${rowNum}`, values: [[true]] });
      totalVerified++;
      continue;
    }

    const folderIds = fileDetails.foundFolderIds;
    const folderPath = await getPathViaFolderId(caseId, folderIds[0]);

    if (folderPath === x[8]) { // Col I (index 8)
      batchUpdates.push({ range: `${sheetName}!J${rowNum}`, values: [['Pass']] });
      batchUpdates.push({ range: `${sheetName}!A${rowNum}`, values: [[true]] });
    } else {
      batchUpdates.push({ range: `${sheetName}!J${rowNum}`, values: [['Incorrect folder']] });
      batchUpdates.push({ range: `${sheetName}!K${rowNum}`, values: [['Saved to ' + folderPath]] });
      batchUpdates.push({ range: `${sheetName}!A${rowNum}`, values: [[true]] });
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

  console.log('Execution of Berman Law Verification complete.');
}

async function getProjectRootFolderID(caseId) {
  const url = `https://bermanlawgroup.filevineapp.com/api/projects/${caseId}/limitedProjectFolderTree`;
  const payload = {
    descendantFolderIDs: [],
    maxChildrenPerFolder: 500
  };

  const options = {
    method: "POST",
    headers: {
      'Cookie': cookie,
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
    await sleep(delay);
  }
}

async function lookUpFileViaRootFolderID(caseId, rootFolderID, docName) {
  let returnData = {
    'docUploaded': false,
    'foundInRoot': false,
    'foundFolderIds': []
  };
  const url = `https://bermanlawgroup.filevineapp.com/api/docs/project/${caseId}`;

  let docNameCleaned = docName.replace(/:/g, '_').replace(/'/g, '_').replace(/\//g, ' ');

  console.log("Searching for document:", docNameCleaned);
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
      'Cookie': cookie,
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
    await sleep(delay);
  }
}

async function getPathViaFolderId(caseId, folderId) {
  if (!folderId) return "";
  const url = `https://bermanlawgroup.filevineapp.com/api/projects/${caseId}/folders/${folderId}/partialTree`;

  const payload = {
    "descendantFolderIDs": [folderId],
    "maxChildrenPerFolder": 500
  };

  const options = {
    method: "POST",
    headers: {
      'Cookie': cookie,
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
    await sleep(delay);
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

module.exports = { executeBermanLawVerification };

if (require.main === module) {
  executeBermanLawVerification();
}