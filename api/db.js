// Retired: the former unauthenticated KV API cannot be used for relational data.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(410).json({ error: 'Legacy database API retired; use Supabase Auth and the relational client.' });
}
