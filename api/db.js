// ఫైల్ పేరు: api/db.js
import { kv } from '@vercel/kv';

function getNested(obj, pathArr) {
  return pathArr.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : null, obj);
}

function setNested(obj, pathArr, value) {
  if (pathArr.length === 0) return value;
  let current = obj || {};
  let root = current;
  for (let i = 0; i < pathArr.length - 1; i++) {
    if (!current[pathArr[i]]) current[pathArr[i]] = {};
    current = current[pathArr[i]];
  }
  current[pathArr[pathArr.length - 1]] = value;
  return root;
}

function removeNested(obj, pathArr) {
  if (pathArr.length === 0) return null;
  let current = obj;
  for (let i = 0; i < pathArr.length - 1; i++) {
    if (!current || !current[pathArr[i]]) return obj;
    current = current[pathArr[i]];
  }
  if (current) delete current[pathArr[pathArr.length - 1]];
  return obj;
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const path = req.query.path || '';
      const parts = path.split('/').filter(Boolean);
      const rootKey = parts[0] || 'default';
      
      let data = await kv.get(rootKey);
      if (parts.length > 1) {
        data = getNested(data, parts.slice(1));
      }
      return res.status(200).json({ result: data });
    }
    
    if (req.method === 'POST') {
      const { action, path, data } = req.body;
      const parts = path.split('/').filter(Boolean);
      const rootKey = parts[0] || 'default';
      
      let rootData = await kv.get(rootKey) || {};
      
      if (action === 'set') {
        rootData = setNested(rootData, parts.slice(1), data);
      } else if (action === 'update') {
        let existing = parts.length > 1 ? getNested(rootData, parts.slice(1)) : rootData;
        existing = { ...(existing || {}), ...data };
        rootData = setNested(rootData, parts.slice(1), existing);
      } else if (action === 'remove') {
        if (parts.length === 1) {
          await kv.del(rootKey);
          return res.status(200).json({ success: true });
        } else {
          rootData = removeNested(rootData, parts.slice(1));
        }
      }
      
      await kv.set(rootKey, rootData);
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
