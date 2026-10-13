export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed' }); }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const safe = typeof anonKey === 'string' && (anonKey.startsWith('sb_publishable_') || /^eyJ/.test(anonKey));
  try { if (!url || new URL(url).protocol !== 'https:' || !safe) throw new Error(); }
  catch (_) { return res.status(503).json({ error: 'Public Supabase configuration is unavailable' }); }
  return res.status(200).json({ url, anonKey });
}
