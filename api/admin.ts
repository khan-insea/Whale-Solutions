import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCollection, insertItem, updateItem, removeItem, saveCollection, getInitialSeedData } from '../src/lib/server/db-helper';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Validate admin authentication
  const authHeader = req.headers.authorization;
  const customPassHeader = req.headers['x-admin-password'];
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({ 
      success: false, 
      error: 'Hệ thống chưa cấu hình mật mã ADMIN_PASSWORD trên môi trường.' 
    });
  }

  let providedToken = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    providedToken = authHeader.substring(7);
  } else if (customPassHeader) {
    providedToken = String(customPassHeader);
  }

  if (!providedToken) {
    return res.status(401).json({ 
      success: false, 
      error: 'Yêu cầu mật khẩu quản trị để thực hiện tác vụ này (chưa cung cấp token).' 
    });
  }

  if (providedToken !== adminPassword) {
    return res.status(401).json({ 
      success: false, 
      error: 'Mật khẩu quản trị không khớp.' 
    });
  }

  const resource = (req.query.resource as string || '').toLowerCase();
  if (!resource) {
    return res.status(400).json({ success: false, error: 'Tham số "resource" là bắt buộc.' });
  }

  // Check for database seeding
  if (resource === 'seed') {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Chỉ hỗ trợ phương thức POST để chạy seeding.' });
    }
    try {
      const seedTables = ['posts', 'products', 'services', 'pricing_plans', 'projects', 'solutions', 'courses', 'site_settings'];
      const results: Record<string, number> = {};
      for (const table of seedTables) {
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
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err?.message || err });
    }
  }

  // Map resources to database table names
  const resourceToTable: Record<string, string> = {
    leads: 'leads',
    posts: 'posts',
    products: 'products',
    services: 'services',
    pricing: 'pricing_plans',
    projects: 'projects',
    solutions: 'solutions',
    courses: 'courses',
    settings: 'site_settings'
  };

  const table = resourceToTable[resource];
  if (!table) {
    return res.status(404).json({ success: false, error: `Tài nguyên "${resource}" không tồn tại.` });
  }

  const method = req.method;

  try {
    // --- GET (List All) ---
    if (method === 'GET') {
      let list = await getCollection<any>(table);
      
      // Seed fallback submissions in local dev if leads table is empty
      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev && table === 'leads' && list.length === 0) {
        const path = require('path');
        const fs = require('fs');
        const submissionsPath = path.join(process.cwd(), 'data', 'submissions.json');
        if (fs.existsSync(submissionsPath)) {
          try {
            const raw = fs.readFileSync(submissionsPath, 'utf-8');
            const subs = JSON.parse(raw);
            if (subs && subs.length > 0) {
              list = subs;
              await saveCollection(table, list);
            }
          } catch (_) {}
        }
      }

      if (resource === 'pricing') {
        list = list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      }

      if (resource === 'settings') {
        const statusObj = {
          resend_configured: !!process.env.RESEND_API_KEY,
          supabase_configured: !!(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL),
          analytics_configured: !!(process.env.VITE_GA_ID || process.env.NEXT_PUBLIC_GA_ID),
          clarity_configured: !!(process.env.VITE_CLARITY_ID || process.env.NEXT_PUBLIC_CLARITY_ID)
        };
        return res.status(200).json({ success: true, data: list, status: statusObj });
      }

      return res.status(200).json({ success: true, data: list });
    }

    // --- POST (Create) ---
    if (method === 'POST') {
      if (resource === 'settings') {
        const payload = req.body;
        let currentList = await getCollection<any>(table);
        if (Array.isArray(payload)) {
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
        return res.status(200).json({ success: true, message: 'Đã lưu cấu hình cài đặt!', data: currentList });
      }

      const payload = req.body;
      const created = await insertItem(table, payload);
      return res.status(201).json({ success: true, data: created });
    }

    // --- PATCH (Update) ---
    if (method === 'PATCH') {
      if (resource === 'settings') {
        const payload = req.body;
        let currentList = await getCollection<any>(table);
        if (Array.isArray(payload)) {
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
        return res.status(200).json({ success: true, message: 'Đã cập nhật cấu hình cài đặt!', data: currentList });
      }

      const { id, ...payload } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Tham số "id" là bắt buộc để cập nhật.' });
      }
      const updated = await updateItem(table, id, payload);
      return res.status(200).json({ success: true, data: updated });
    }

    // --- DELETE (Remove) ---
    if (method === 'DELETE') {
      const id = req.query.id as string || req.body.id;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Tham số "id" là bắt buộc để xóa.' });
      }
      await removeItem(table, id);
      return res.status(200).json({ success: true, message: 'Xóa mục thành công.' });
    }

    return res.status(405).json({ success: false, error: 'Phương thức HTTP không được hỗ trợ.' });
  } catch (error: any) {
    console.error(`Admin API [resource=${resource}] Error:`, error);
    return res.status(500).json({ success: false, error: error?.message || 'Có lỗi xảy ra trên máy chủ.' });
  }
}
