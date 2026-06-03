import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCollection, saveCollection, getInitialSeedData } from '../db-helper';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) return res.status(500).json({ success: false, error: 'Hệ thống chưa cấu hình mật mã ADMIN_PASSWORD.' });
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ success: false, error: 'Token rỗng hoặc sai định dạng.' });

  const token = authHeader.substring(7);
  if (token !== adminPassword) return res.status(401).json({ success: false, error: 'Mật khẩu quản trị không mật khớp.' });

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Chỉ hỗ trợ phương thức POST để gieo hạt dữ liệu.' });
  }

  const allowedTables = ['posts', 'products', 'services', 'pricing_plans', 'projects', 'solutions', 'courses', 'site_settings'];

  try {
    const results: Record<string, number> = {};

    for (const table of allowedTables) {
      const seedData = getInitialSeedData(table);
      if (seedData && seedData.length > 0) {
        await saveCollection(table, seedData);
        results[table] = seedData.length;
      } else {
        results[table] = 0;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Đã gieo hạt dữ liệu ban đầu cho toàn bộ hệ thống CMS thành công!',
      seeded_records: results
    });
  } catch (error: any) {
    console.error('Seeding Error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Có lỗi xảy ra khi gieo dữ liệu.' });
  }
}
