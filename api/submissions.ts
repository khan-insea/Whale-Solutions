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
    // Look in workspaces folder or Vercel temporary storage
    const localFilePath = path.join(process.cwd(), 'data', 'submissions.json');
    const tmpFilePath = path.join('/tmp', 'data', 'submissions.json');
    
    let submissions: any[] = [];
    
    if (fs.existsSync(localFilePath)) {
      try {
        const fileContent = fs.readFileSync(localFilePath, 'utf8');
        submissions = JSON.parse(fileContent);
      } catch (_) {}
    } else if (fs.existsSync(tmpFilePath)) {
      try {
        const fileContent = fs.readFileSync(tmpFilePath, 'utf8');
        submissions = JSON.parse(fileContent);
      } catch (_) {}
    }

    return res.status(200).json({ success: true, submissions });
  } catch (error) {
    console.error('Error serving secure submissions:', error);
    return res.status(500).json({ success: false, error: 'Không thể truy cập dữ liệu máy chủ.' });
  }
}
