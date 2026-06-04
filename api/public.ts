import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCollection } from '../lib/server/db-helper.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Chỉ hỗ trợ phương thức GET.' });
  }

  const resource = (req.query.resource as string || '').toLowerCase();
  if (!resource) {
    return res.status(400).json({ success: false, error: 'Tham số "resource" là bắt buộc.' });
  }

  // Map public resources to table names
  const resourceToTable: Record<string, string> = {
    posts: 'posts',
    pricing: 'pricing_plans',
    services: 'services',
    products: 'products',
    projects: 'projects',
    solutions: 'solutions',
    courses: 'courses',
    settings: 'site_settings'
  };

  const table = resourceToTable[resource];
  if (!table) {
    return res.status(404).json({ success: false, error: `Tài nguyên public "${resource}" không tồn tại.` });
  }

  try {
    const list = await getCollection(table);
    let filteredData = list;

    // Apply exact user-defined filtering rules for public consumption
    if (table === 'posts') {
      filteredData = list.filter(item => item.status === 'published');
    } else if (table === 'pricing_plans') {
      filteredData = list
        .filter(item => item.status === 'active')
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    } else if (table === 'projects') {
      filteredData = list.filter(item => item.status === 'published');
    } else if (table === 'services' || table === 'products' || table === 'solutions' || table === 'courses') {
      filteredData = list.filter(item => item.status !== 'hidden');
    }

    return res.status(200).json({ success: true, data: filteredData });
  } catch (err: any) {
    console.error(`Public API [resource=${resource}] Error:`, err);
    return res.status(500).json({ success: false, error: err?.message || 'Có lỗi xảy ra trên máy chủ.' });
  }
}
