import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { insertItem } from './db-helper';

// Keep a simple in-memory rate-limiting map on Vercel container instances
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3; // MAX 3 submissions per IP per minute

function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers for API accessibility
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Phương thức không được hỗ trợ. Chỉ chấp nhận POST.',
    });
  }

  try {
    // 1. Bot Honeypot detection
    const { website } = req.body || {};
    if (website && website.trim() !== '') {
      console.warn('[SECURITY WARNING] Honeypot field filled. Silently discarding spam request.');
      // Return 200 mock success to confuse spam bots so they do not retry
      return res.status(200).json({
        success: true,
        message: 'Gửi thông tin thành công. Whale Agency sẽ liên hệ lại sớm!',
      });
    }

    // 2. IP Rate limiting
    const clientIp = (req.headers['x-forwarded-for'] as string || req.headers['x-real-ip'] as string || 'anonymous').split(',')[0].trim();
    const now = Date.now();
    const clientRequests = rateLimitMap.get(clientIp) || [];
    const recentRequests = clientRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    if (recentRequests.length >= MAX_REQUESTS) {
      console.warn(`[SECURITY WARNING] User ${clientIp} triggered rate limit.`);
      return res.status(429).json({
        success: false,
        error: 'Bạn đang gửi yêu cầu quá nhanh. Vui lòng thử lại sau ít phút.',
      });
    }

    recentRequests.push(now);
    rateLimitMap.set(clientIp, recentRequests);

    // 3. ENV check
    const resendApiKey = process.env.RESEND_API_KEY;
    const contactToEmail = process.env.CONTACT_TO_EMAIL;
    const contactFromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!resendApiKey) {
      console.error('[DATABASE/API CONFIG ERR] Missing RESEND_API_KEY environment variable.');
      return res.status(500).json({
        success: false,
        error: 'Hệ thống gửi thư đang gặp sự cố. Quý khách vui lòng gọi Hotline để được hỗ trợ tức thì.',
      });
    }

    if (!contactToEmail) {
      console.error('[DATABASE/API CONFIG ERR] Missing CONTACT_TO_EMAIL environment variable.');
      return res.status(500).json({
        success: false,
        error: 'Hệ thống đang cấu hình nhận thông tin. Quý khách vui lòng gọi Hotline để liên hệ trực tiếp.',
      });
    }

    if (!contactFromEmail) {
      console.error('[DATABASE/API CONFIG ERR] Missing CONTACT_FROM_EMAIL environment variable.');
      return res.status(500).json({
        success: false,
        error: 'Hệ thống đang cấu hình gửi thông tin. Quý khách vui lòng gọi Hotline để liên hệ trực tiếp.',
      });
    }

    const {
      name,
      fullName,
      phone,
      email,
      businessName,
      service,
      serviceOfInterest,
      requestType,
      budget,
      timeline,
      message,
      page,
      pageSource,
    } = req.body || {};

    const rawName = (name || fullName || '').trim();
    const rawPhone = (phone || '').trim();
    const rawEmail = (email || '').trim();
    const rawService = (service || serviceOfInterest || 'Chưa chọn dịch vụ').trim();
    const rawBusinessName = (businessName || '').trim();
    const rawRequestType = (requestType || 'consult').trim();
    const rawBudget = (budget || 'Chưa xác định').trim();
    const rawTimeline = (timeline || 'Chưa rõ').trim();
    const rawMessage = (message || 'Không có ghi chú thêm').trim();
    const rawPage = (page || pageSource || '/').trim();

    // 4. Strict Validation length limits
    if (!rawName) {
      return res.status(400).json({ success: false, error: 'Vui lòng cung cấp Họ tên hàng không được trống.' });
    }
    if (rawName.length > 100) {
      return res.status(400).json({ success: false, error: 'Họ tên quá dài (tối đa 100 ký tự).' });
    }

    if (!rawPhone) {
      return res.status(400).json({ success: false, error: 'Vui lòng cung cấp Số điện thoại.' });
    }
    if (rawPhone.length > 20) {
      return res.status(400).json({ success: false, error: 'Số điện thoại không hợp lệ (tối đa 20 ký tự).' });
    }

    if (rawEmail && rawEmail.length > 120) {
      return res.status(400).json({ success: false, error: 'Email quá dài (tối đa 120 ký tự).' });
    }

    if (rawMessage.length > 2000) {
      return res.status(400).json({ success: false, error: 'Nội dung chi tiết quá dài (tối đa 2000 ký tự).' });
    }

    // 5. Input HTML Sanitization to prevent XSS
    const resolvedName = sanitizeInput(rawName);
    const resolvedPhone = sanitizeInput(rawPhone);
    const resolvedEmail = sanitizeInput(rawEmail);
    const resolvedService = sanitizeInput(rawService);
    const resolvedBusinessName = sanitizeInput(rawBusinessName);
    const resolvedRequestType = sanitizeInput(rawRequestType);
    const resolvedBudget = sanitizeInput(rawBudget);
    const resolvedTimeline = sanitizeInput(rawTimeline);
    const resolvedMessage = sanitizeInput(rawMessage);
    const resolvedPage = sanitizeInput(rawPage);

    const requestTypeLabel =
      resolvedRequestType === 'quote'
        ? 'Nhận báo giá dịch vụ đang triển khai'
        : resolvedRequestType === 'interest'
          ? 'Đăng ký quan tâm dịch vụ sắp ra mắt'
          : 'Cần tư vấn chưa rõ dịch vụ';

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a; max-width: 640px; margin: 0 auto; padding: 20px;">
        <div style="background: #020617; color: #ffffff; padding: 18px; border-radius: 12px 12px 0 0;">
          <h2 style="margin: 0; font-size: 20px;">Whale Agency - Form mới từ website</h2>
          <p style="margin: 6px 0 0; color: #cbd5e1; font-size: 14px;">Có khách hàng vừa gửi yêu cầu tư vấn/báo giá.</p>
        </div>

        <div style="border: 1px solid #e2e8f0; border-top: 0; padding: 20px; border-radius: 0 0 12px 12px; background: #ffffff;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569; width: 35%;">Họ và tên:</td>
              <td style="padding: 10px 0; color: #0f172a;">${resolvedName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Số điện thoại:</td>
              <td style="padding: 10px 0; color: #020617;"><a href="tel:${resolvedPhone}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${resolvedPhone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Email:</td>
              <td style="padding: 10px 0; color: #0f172a;">${resolvedEmail ? `<a href="mailto:${resolvedEmail}" style="color: #2563eb; text-decoration: none;">${resolvedEmail}</a>` : 'Không để lại email'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Tên doanh nghiệp:</td>
              <td style="padding: 10px 0; color: #0f172a;">${resolvedBusinessName || 'Chưa cung cấp'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Loại yêu cầu:</td>
              <td style="padding: 10px 0; color: #0f172a;">${requestTypeLabel}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Dịch vụ quan tâm:</td>
              <td style="padding: 10px 0; color: #0f172a;">${resolvedService}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Ngân sách dự kiến:</td>
              <td style="padding: 10px 0; color: #0f172a;">${resolvedBudget}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Thời gian triển khai:</td>
              <td style="padding: 10px 0; color: #0f172a;">${resolvedTimeline}</td>
            </tr>
          </table>

          <p style="margin: 20px 0 10px; font-weight: bold; color: #475569;">Nội dung cần tư vấn:</p>
          <div style="white-space: pre-wrap; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; color: #0f172a; font-size: 14px;">
            ${resolvedMessage}
          </div>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;" />

          <p style="font-size: 13px; color: #64748b; margin: 5px 0;"><b>Trang gửi form:</b> <a href="${resolvedPage}" style="color: #64748b;">${resolvedPage}</a></p>
          <p style="font-size: 13px; color: #64748b; margin: 5px 0;"><b>Thời gian:</b> ${new Date().toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
          })} (Giờ Việt Nam)</p>
        </div>
      </div>
    `;

    // Save lead to Supabase database
    let dbErrorOccurred: any = null;
    try {
      const newSubmission = {
        fullName: resolvedName,
        phone: resolvedPhone,
        email: resolvedEmail,
        businessName: resolvedBusinessName || 'Cá nhân / Chưa xác định',
        requestType: resolvedRequestType,
        serviceOfInterest: resolvedService,
        budget: resolvedBudget,
        timeline: resolvedTimeline,
        message: resolvedMessage,
        pageSource: resolvedPage,
        status: 'pending',
        internal_note: '',
        submittedAt: new Date().toISOString(),
      };
      await insertItem('leads', newSubmission as any);
    } catch (dbErr: any) {
      console.error('[DATABASE] Failed to save lead submission:', dbErr);
      dbErrorOccurred = dbErr;
    }

    // Send email using Resend
    let emailErrorOccurred: any = null;
    try {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: contactFromEmail,
        to: [contactToEmail],
        subject: `[Whale Agency] Form mới từ website - ${resolvedName}`,
        html: emailHtml,
      });
    } catch (emailErr: any) {
      console.error('[EMAIL] Failed to send email via Resend:', emailErr);
      emailErrorOccurred = emailErr;
    }

    if (process.env.NODE_ENV === 'production' && (dbErrorOccurred || emailErrorOccurred)) {
      const parts: string[] = [];
      if (dbErrorOccurred) {
        parts.push(`Lỗi kết nối / lưu Supabase: ${dbErrorOccurred?.message || JSON.stringify(dbErrorOccurred)}`);
      }
      if (emailErrorOccurred) {
        parts.push(`Lỗi gửi mail qua Resend: ${emailErrorOccurred?.message || JSON.stringify(emailErrorOccurred)}`);
      }
      return res.status(500).json({
        success: false,
        error: `Có lỗi xảy ra trên môi trường Production: ${parts.join(' | ')}`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Gửi thông tin thành công. Whale Agency sẽ liên hệ lại sớm!',
    });
  } catch (error: any) {
    console.error('Contact API error:', error);
    // Secure safe error message (no stack traces or engine technical leakage)
    return res.status(500).json({
      success: false,
      error: 'Không thể hoàn tất gửi thông tin lúc này. Vui lòng thử lại sau.'
    });
  }
}
