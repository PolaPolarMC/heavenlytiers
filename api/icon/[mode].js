const { getDb, setCors } = require('../_lib/firebaseAdmin');

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Accept both "/api/icon/overall" and "/api/icon/overall.png" — strip any extension.
  let { mode } = req.query;
  if (!mode) return res.status(400).send('Mode required');
  mode = String(mode).replace(/\.[a-zA-Z0-9]+$/, '');

  try {
    const snap = await getDb().collection('mode_icons').doc(mode.toLowerCase()).get();
    if (!snap.exists) return res.status(404).send('Icon not found');

    const { base64, contentType } = snap.data();
    if (!base64) return res.status(404).send('Icon not found');

    const buffer = Buffer.from(base64, 'base64');
    res.setHeader('Content-Type', contentType || 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('GET /api/icon/[mode] failed:', err);
    return res.status(500).send('Internal error');
  }
};
