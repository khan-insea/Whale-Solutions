import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { Resend } from 'resend';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to store local submissions for high reliability and local verification
const DATA_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data folder and file exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(SUBMISSIONS_FILE)) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Authentication middleware for submissions
const checkAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const adminPassword = process.env.ADMIN_PASSWORD || 'whale-solutions-admin';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Xác thực không hợp lệ. Vui lòng đăng nhập lại.' });
  }

  const token = authHeader.substring(7);
  if (token !== adminPassword) {
    return res.status(401).json({ success: false, error: 'Mật khẩu quản trị không khớp.' });
  }

  next();
};

// Retrieve submissions (useful for client demonstration or verification)
app.get('/api/submissions', checkAdminAuth, (req, res) => {
  try {
    const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    const submissions = JSON.parse(data);
    res.json({ success: true, submissions });
  } catch (error) {
    console.error('Error reading submissions:', error);
    res.status(500).json({ success: false, error: 'Cannot read submissions data' });
  }
});

// Clear submissions (for clean testing)
app.post('/api/submissions/clear', checkAdminAuth, (req, res) => {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
    res.json({ success: true, message: 'Submissions cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Cannot clear submissions' });
  }
});

// Handler for contact submission
const handleContactSubmission = async (req: express.Request, res: express.Response) => {
  try {
    const {
      name,
      fullName,
      phone,
      email,
      service,
      serviceOfInterest,
      message,
      page,
      pageSource,
      submittedAt,
      businessName,
      requestType,
      budget,
      timeline
    } = req.body;

    // Direct simple validation: name and phone are mandatory
    const resolvedName = (name || fullName || '').trim();
    const resolvedPhone = (phone || '').trim();
    const resolvedEmail = (email || '').trim();
    const resolvedService = (service || serviceOfInterest || 'Website / Landing Page').trim();
    const resolvedMessage = (message || 'Không có ghi chú thêm').trim();
    const resolvedPage = (page || pageSource || '/').trim();

    if (!resolvedName) {
      res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp Họ tên.'
      });
      return;
    }

    if (!resolvedPhone) {
      res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp Số điện thoại.'
      });
      return;
    }

    const newSubmission = {
      id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: resolvedName,
      fullName: resolvedName, // backward compatibility
      phone: resolvedPhone,
      email: resolvedEmail,
      service: resolvedService,
      serviceOfInterest: resolvedService, // backward compatibility
      businessName: businessName || 'Cá nhân / Chưa có doanh nghiệp',
      requestType: requestType || 'consult', // 'quote' | 'interest' | 'consult'
      budget: budget || 'Chưa xác định',
      timeline: timeline || 'Chưa rõ',
      message: resolvedMessage,
      submittedAt: submittedAt || new Date().toISOString(),
      page: resolvedPage,
      pageSource: resolvedPage // backward compatibility
    };

    // Save locally
    const fileContent = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    const currentSubmissions = JSON.parse(fileContent);
    currentSubmissions.unshift(newSubmission);
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(currentSubmissions, null, 2), 'utf-8');

    // Attempt to send email via Resend if environment variables are configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const contactToEmail = process.env.CONTACT_TO_EMAIL || 'insightads.vn@gmail.com';
    const contactFromEmail = process.env.CONTACT_FROM_EMAIL || 'Whale Solutions <onboarding@resend.dev>';

    let emailSent = false;
    let emailFeedback = '';

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const emailSubject = `Khách hàng mới từ website - ${resolvedName}`;
        const emailHtml = `
          <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="background-color: #020617; color: #ffffff; padding: 15px; border-radius: 6px 6px 0 0; text-align: center;">
              <h2 style="margin: 0; font-size: 20px;">whale sea - Thông báo yêu cầu mới</h2>
              <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.8;">Hệ thống nhận diện yêu cầu tự động</p>
            </div>
            
            <div style="padding: 20px;">
              <h3 style="border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin-top: 0;">Thông tin chi tiết yêu cầu</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; width: 40%;">Họ và tên:</td>
                  <td style="padding: 6px 0;">${resolvedName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Số điện thoại:</td>
                  <td style="padding: 6px 0;"><a href="tel:${resolvedPhone}">${resolvedPhone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 6px 0;">${resolvedEmail ? `<a href="mailto:${resolvedEmail}">${resolvedEmail}</a>` : 'Không để lại email'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Tên doanh nghiệp:</td>
                  <td style="padding: 6px 0;">${businessName || 'Cá nhân / Chưa xác định'}</td>
                </tr>
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 8px; font-weight: bold;">Loại yêu cầu:</td>
                  <td style="padding: 8px; font-weight: ${requestType === 'interest' ? 'bold' : 'normal'}; color: ${requestType === 'interest' ? '#ef4444' : '#1e293b'}">
                    ${requestType === 'quote' ? 'Nhận báo giá dịch vụ đang triển khai' : requestType === 'interest' ? 'Đăng ký quan tâm dịch vụ sắp ra mắt' : 'Cần tư vấn chưa rõ dịch vụ'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Dịch vụ quan tâm:</td>
                  <td style="padding: 6px 0;">${resolvedService}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Ngân sách dự kiến:</td>
                  <td style="padding: 6px 0;">${budget || 'Chưa xác định'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold;">Thời gian triển khai:</td>
                  <td style="padding: 6px 0;">${timeline || 'Chưa rõ'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Nội dung cần tư vấn:</td>
                  <td style="padding: 6px 0; white-space: pre-wrap;">${resolvedMessage}</td>
                </tr>
              </table>
              
              <div style="margin-top: 20px; padding: 12px; background-color: #f1f5f9; border-radius: 4px; font-size: 12px; color: #64748b;">
                <p style="margin: 0;"><b>Trang gửi form:</b> ${resolvedPage}</p>
                <p style="margin: 4px 0 0 0;"><b>Thời gian gửi:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} (Giờ Việt Nam)</p>
              </div>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; text-align: center; color: #94a3b8;">
              <p>Email này được tạo tự động từ Website của whale sea Freelance Studio.</p>
            </div>
          </div>
        `;

        await resend.emails.send({
          from: contactFromEmail,
          to: [contactToEmail],
          subject: emailSubject,
          html: emailHtml
        });

        emailSent = true;
        emailFeedback = 'Gửi email thông báo thành công qua Resend!';
      } catch (err: any) {
        emailFeedback = `Không thể gửi email vì lỗi Resend: ${err?.message || err}`;
        console.error(emailFeedback);
      }
    } else {
      emailFeedback = 'Chưa cấu hình API Key Resend. Biểu mẫu đã được lưu vào hệ thống dữ liệu nội bộ của studio.';
    }

    res.json({
      success: true,
      message: 'Gửi thông tin thành công. Chúng tôi sẽ liên hệ lại sớm!',
      data: newSubmission,
      emailSent,
      emailFeedback
    });
  } catch (error: any) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể gửi thông tin. Vui lòng thử lại.'
    });
  }
};

app.post('/api/submit-contact', handleContactSubmission);
app.post('/api/contact', handleContactSubmission);

// ----------------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in Development mode.');
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    console.log('Serving static files from:', distPath);
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[whale sea Server] Running at http://localhost:${PORT}`);
  });
}

startServer();
