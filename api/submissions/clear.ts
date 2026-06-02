import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Phương thức không hợp lệ. Chỉ chấp nhận POST.' });
  }

  // Enforce server-side authorization check
  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('[DATABASE/API CONFIG ERR] Missing ADMIN_PASSWORD environment variable.');
    return res.status(500).json({ success: false, error: 'Hệ thống chưa được cấu hình mật mã quản trị trên môi trường Vercel.' });
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Xác thực không hợp lệ. Vui lòng đăng nhập lại.' });
  }

  const token = authHeader.substring(7);
  if (token !== adminPassword) {
    return res.status(401).json({ success: false, error: 'Mật khẩu quản trị không khớp.' });
  }

  try {
    const localFilePath = path.join(process.cwd(), 'data', 'submissions.json');
    const tmpFilePath = path.join('/tmp', 'data', 'submissions.json');
    
    // Clear both files
    if (fs.existsSync(localFilePath)) {
      try {
        fs.writeFileSync(localFilePath, JSON.stringify([], null, 2), 'utf8');
      } catch (_) {}
    }
    
    // Clear temporary Vercel storage file
    const tmpDir = path.join('/tmp', 'data');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    fs.writeFileSync(tmpFilePath, JSON.stringify([], null, 2), 'utf8');

    return res.status(200).json({ success: true, message: 'Đã xóa toàn bộ hàng chờ khách hàng thành công.' });
  } catch (error) {
    console.error('Error clearing secures:', error);
    return res.status(500).json({ success: false, error: 'Không thể xóa dữ liệu hệ thống.' });
  }
}
