import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCollection, insertItem, updateItem, removeItem } from '../db-helper';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) return res.status(500).json({ success: false, error: 'Hệ thống chưa cấu hình mật mã ADMIN_PASSWORD.' });
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ success: false, error: 'Token rỗng hoặc sai định dạng.' });

  const token = authHeader.substring(7);
  if (token !== adminPassword) return res.status(401).json({ success: false, error: 'Mật khẩu quản trị không mật khớp.' });

  const table = 'solutions';

  try {
    if (req.method === 'GET') {
      const list = await getCollection(table);
      return res.status(200).json({ success: true, data: list });
    }

    if (req.method === 'POST') {
      const payload = req.body;
      if (!payload.title) return res.status(400).json({ success: false, error: 'Tiêu đề giải pháp là bắt buộc.' });
      const created = await insertItem(table, payload);
      return res.status(201).json({ success: true, data: created });
    }

    if (req.method === 'PATCH') {
      const { id, ...payload } = req.body;
      if (!id) return res.status(400).json({ success: false, error: 'Id cập nhật là bắt buộc.' });
      const updated = await updateItem(table, id, payload);
      return res.status(200).json({ success: true, data: updated });
    }

    if (req.method === 'DELETE') {
      const id = req.query.id as string || req.body.id;
      if (!id) return res.status(400).json({ success: false, error: 'Id để xóa là bắt buộc.' });
      await removeItem(table, id);
      return res.status(200).json({ success: true, message: 'Đã xóa giải pháp thành công.' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Có lỗi xảy ra.' });
  }
}
