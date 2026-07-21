require('dotenv').config();

const bermanCookie = process.env.BERMAN_COOKIE || '';
const ligoriCookie = process.env.LIGORI_COOKIE || '';

if (!bermanCookie || !ligoriCookie) {
  console.warn('⚠️ Warning: Filevine cookies are missing from your environment variables.');
}

module.exports = { bermanCookie, ligoriCookie };