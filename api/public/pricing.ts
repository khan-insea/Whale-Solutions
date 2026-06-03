import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCollection } from '../db-helper';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const list = await getCollection('pricing_plans');
    // filter where status is active and sort
    const filtered = (list as any[])
      .filter(item => item.status === 'active')
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    return res.status(200).json({ success: true, data: filtered });
  } catch (error: any) {
    console.error('Public Pricing API Error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Internal Server Error' });
  }
}
