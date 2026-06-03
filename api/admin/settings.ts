import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCollection, saveCollection } from '../db-helper';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) return res.status(500).json({ success: false, error: 'Hệ thống chưa cấu hình mật mã ADMIN_PASSWORD.' });
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ success: false, error: 'Token rỗng hoặc sai định dạng.' });

  const token = authHeader.substring(7);
  if (token !== adminPassword) return res.status(401).json({ success: false, error: 'Mật khẩu quản trị không mật khớp.' });

  const table = 'site_settings';

  try {
    if (req.method === 'GET') {
      const list = await getCollection<any>(table);
      
      // Let's also include server setup indicators gracefully!
      const statusObj = {
        resend_configured: !!process.env.RESEND_API_KEY,
        supabase_configured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL),
        analytics_configured: !!(process.env.VITE_GA_ID || process.env.NEXT_PUBLIC_GA_ID),
        clarity_configured: !!(process.env.VITE_CLARITY_ID || process.env.NEXT_PUBLIC_CLARITY_ID)
      };

      return res.status(200).json({ success: true, data: list, status: statusObj });
    }

    if (req.method === 'POST' || req.method === 'PATCH') {
      const payload = req.body; // Expect array of settings or single updating dict {key, value}
      let currentList = await getCollection<any>(table);
      
      if (Array.isArray(payload)) {
        // overwrite/merge whole array
        for (const item of payload) {
          const idx = currentList.findIndex(x => x.key === item.key);
          if (idx !== -1) {
            currentList[idx].value = item.value;
          } else {
            currentList.push({ id: `set-${Date.now()}`, key: item.key, value: item.value });
          }
        }
      } else {
        const { key, value } = payload;
        if (!key) return res.status(400).json({ success: false, error: 'Khóa cấu hình "key" là bắt buộc.' });
        const idx = currentList.findIndex(x => x.key === key);
        if (idx !== -1) {
          currentList[idx].value = value;
        } else {
          currentList.push({ id: `set-${Date.now()}`, key, value });
        }
      }

      await saveCollection(table, currentList);
      return res.status(200).json({ success: true, message: 'Đã cập nhật cấu hình hệ thống thành công!', data: currentList });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Có lỗi xảy ra.' });
  }
}
