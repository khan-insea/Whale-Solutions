import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCollection, insertItem, updateItem, removeItem, getInitialSeedData } from '../db-helper';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Validate admin token
  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ success: false, error: 'Hệ thống chưa cấu hình mật mã ADMIN_PASSWORD trên môi trường.' });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Chưa cung cấp token hoặc định dạng không hợp lệ.' });
  }

  const token = authHeader.substring(7);
  if (token !== adminPassword) {
    return res.status(401).json({ success: false, error: 'Mật khẩu quản trị không mật khớp.' });
  }

  const table = 'leads';

  try {
    if (req.method === 'GET') {
      let list = await getCollection<any>(table);
      
      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev && list.length === 0) {
        // Compatibility fallback: load the main submissions from the data folder too (development only)
        const submissionsPath = require('path').join(process.cwd(), 'data', 'submissions.json');
        if (require('fs').existsSync(submissionsPath)) {
          try {
            const raw = require('fs').readFileSync(submissionsPath, 'utf-8');
            const subs = JSON.parse(raw);
            if (subs && subs.length > 0) {
              list = subs;
              const saveCollection = require('../db-helper').saveCollection;
              await saveCollection(table, list);
            }
          } catch (_) {}
        }
      }
      return res.status(200).json({ success: true, data: list });
    }

    if (req.method === 'POST') {
      const payload = req.body;
      const created = await insertItem(table, payload);
      return res.status(201).json({ success: true, data: created });
    }

    if (req.method === 'PATCH') {
      const { id, ...payload } = req.body;
      if (!id) return res.status(400).json({ success: false, error: 'Yêu cầu cung cấp id để cập nhật.' });
      const updated = await updateItem(table, id, payload);
      return res.status(200).json({ success: true, data: updated });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string || req.body.id;
      if (!id) return res.status(400).json({ success: false, error: 'Yêu cầu cung cấp id để xóa.' });
      await removeItem(table, id);
      return res.status(200).json({ success: true, message: 'Đã xóa dữ liệu thành công.' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error: any) {
    console.error(`Leads API Error:`, error);
    return res.status(500).json({ success: false, error: error?.message || 'Có lỗi xảy ra trên server.' });
  }
}
