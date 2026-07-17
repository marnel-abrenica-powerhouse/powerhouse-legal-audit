// Loads local variables from .env file if it exists
require('dotenv').config();

const { google } = require('googleapis');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

function cleanPrivateKey(key) {
  if (!key) return '';
  let cleaned = key.trim().replace(/^['"]|['"]$/g, '').trim();
  cleaned = cleaned.replace(/\\n/g, '\n');

  const header = '-----BEGIN PRIVATE KEY-----';
  const footer = '-----END PRIVATE KEY-----';

  if (cleaned.includes(header) && cleaned.includes(footer)) {
    let body = cleaned.split(header)[1].split(footer)[0];
    body = body.replace(/[\s\r\n\\'"]/g, '');
    const chunks = [];
    for (let i = 0; i < body.length; i += 64) {
      chunks.push(body.slice(i, i + 64));
    }
    return `${header}\n${chunks.join('\n')}\n${footer}\n`;
  }
  return cleaned;
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: "powerhouse-quality-assurance@powerhouseauth0.iam.gserviceaccount.com",
    private_key: cleanPrivateKey(rawPrivateKey),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

module.exports = { sheets, SPREADSHEET_ID };