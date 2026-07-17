const { google } = require('googleapis');

// Checks for GitHub Environment Secret first; falls back to local hardcoded string
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || 'YOUR_LOCAL_SPREADSHEET_ID_HERE';

const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDZQDLPQXl0TlG0\nBlTcRvx0Dq/rPAmKljDjM/6rdKp82G2nAUzk4D2+/tI1BozYLBeNBrOIgk8ObbXU\nTXHCJsUv0Q8F6iPmP7524qQVRGTq8WMk7yi7uhLAsIQdhZ6RH0zP+pehfWtqwWor\nJc3Doiu2DpM1GTJSPaWmaGKw8WWu81PZ0fl/R8XRwtbuE8Jt/HrTzXcM5OA3DSMY\nlnhFVKy4Fb7MnIw2bsfNdMsdqDxCWkF6mV/RH4GADZ6Vw1nmhzzCiM2SR0ZS0k2X\n2r2ECNXc2DjOV/1nx9em/VJesAeDUAI/sgaXvtwGsoI4X15mF0qhGhPi8Wv0o8pH\nVKCjXhoBAgMBAAECggEABP2+Qm1iU/NkryUiF/l4Mqu6YPDSgKDuDe+Tie7hPS21\nFIwpbxdec8qORnJDFB2si4Hm6AZOY1TOmPUP3a0Jr2KMh3nsnzfsW/YzB4YNvNQU\n5LQAlJI0J2x8Fzg1qhHfsDuKoPGCYUPWTkLNFRHfEoyygcV1bCxHElP9ncu9+/ny\nS6xVCJg70wzZBhaeMo8Xgvq6Vm8YUTjvkhkoiK6giAtfqaE7tkw4AleFk10x7Twb\n5mgLJ8GNfgtvQtDguZsOHEf8Xc/RIXnmz47csEKk8YMPKjLLSaq/X+fH0uI82iPS\nHXOTSPVkaR0uxgTytIIpH8hBN2gDOQTUeEqtLaH/3QKBgQD8fhmXjXb68Y2J8g3e\nvXQ52kaP1g8BE4wzDtTRVWPWo5CYumzHXv67v1Pf7A19YUhdysQhZ8QFLaIWj9nT\numlZYGg7DWztYfHPn7vYuooJgLKZzXgMPUmrOVOYZ55eJiL9Fr2LKYeFGSHCSEEz\nqpIvinR/3+j4dxkbvlPJWcKX7wKBgQDcRMYIzr7BXORMxMTyvCh2H6Dc7bVE7eco\nT3SxkAUIaBMrOlR+Im4f6M2Qa5CqLS2UmDWNVkA9T7ZKQvvoekCCEnuYZBBPxDYx\nNcgjrN/newjFnJ/CnUDYJ8GwcbPo44z8C7UbnbU1SlrCACXAY8DnTCPZjYHa3B97\nu99SrDD9DwKBgQCH7w+yIuwib/dmg9VpzI+NMfF5MKJFTxPUzTBQPuuQO+D2CK/V\qlP0Gi56yGf+z2gZbrem0Gmc7BNumCWKsrpS7u9Ok4zIREneIL4OEWeNdCczXIY7\n+Kb3stZJn8eIInoFzb9f84zNYFlncmT//t3TEHRl/9M6KUxwPkh3h4aXKwKBgCv1\nUaw6Tllah3lGn6Ntp4mDYGAW1GEwNTyXNsuk2UxHMOQknO4bQuz9UeDrhpBfucP4\n6F8Pgnx55wBFA+7uTudmduH/vj2dA8+oUwvDmV+h7ys4ya1WIrXAoWfsGSJ2HxHB\n6F/dhmdfMmObEe2mOr4uNM1a7zpVSbcw1C20jYZDAoGBAIU9pStDrAJrAw3BVLCC\nfg1mHwnY6IOxYQYkquD5jik86L75Lw2cnV+Hdc4T0c7CdcOLjziAw7174xqojO38\nGyHp42JBFZseWCHpbnO188Wi/RaVGRUTV4xn5D2ObbqzD5ne2Yp/7bqqLnYQQBPb\n9Bmh8xvKoxbEqddD8wgYNmQ7\n-----END PRIVATE KEY-----\n";

/**
 * Normalizes a private key string to ensure it is compliant with OpenSSL 3.0 parsing rules.
 */
function cleanPrivateKey(key) {
  if (!key) return '';
  
  let cleaned = key.trim();

  // Fix 1: Strip accidental wrapping double or single quotes added by GitHub Secret fields
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  // Fix 2: Unescape literal '\n' string tokens into actual systemic newline block elements
  cleaned = cleaned.replace(/\\n/g, '\n');

  // Fix 3: Standardize any carriage returns (\r\n) down to normal \n
  cleaned = cleaned.replace(/\r\n/g, '\n');

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