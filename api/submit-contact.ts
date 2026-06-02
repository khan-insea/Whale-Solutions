import { Resend } from 'resend';
import { readSubmissions, writeSubmissions } from './_storage';

const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail = process.env.CONTACT_TO_EMAIL || 'insightads.vn@gmail.com';
const contactFromEmail = process.env.CONTACT_FROM_EMAIL || 'Whale Solutions <onboarding@resend.dev>';

function parseJsonBody(body: unknown, contentType?: string) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body || {};
}

function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function buildEmailHtml(data: Record<string, string>) {
  return `
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
            <td style="padding: 6px 0;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Số điện thoại:</td>
            <td style="padding: 6px 0;"><a href="tel:${data.phone}">${data.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Email:</td>
            <td style="padding: 6px 0;">${data.email ? `<a href="mailto:${data.email}">${data.email}</a>` : 'Không để lại email'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Tên doanh nghiệp:</td>
            <td style="padding: 6px 0;">${data.businessName || 'Cá nhân / Chưa có doanh nghiệp'}</td>
          </tr>
          <tr style="background-color: #f8fafc;">
            <td style="padding: 8px; font-weight: bold;">Loại yêu cầu:</td>
            <td style="padding: 8px;">${data.requestType}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Dịch vụ quan tâm:</td>
            <td style="padding: 6px 0;">${data.serviceOfInterest}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Ngân sách dự kiến:</td>
            <td style="padding: 6px 0;">${data.budget}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold;">Thời gian triển khai:</td>
            <td style="padding: 6px 0;">${data.timeline}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; vertical-align: top;">Nội dung cần tư vấn:</td>
            <td style="padding: 6px 0; white-space: pre-wrap;">${data.message}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding: 12px; background-color: #f1f5f9; border-radius: 4px; font-size: 12px; color: #64748b;">
          <p style="margin: 0;"><b>Trang gửi form:</b> ${data.page}</p>
          <p style="margin: 4px 0 0 0;"><b>Thời gian gửi:</b> ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })} (Giờ Việt Nam)</p>
        </div>
      </div>
      <div style="border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; text-align: center; color: #94a3b8;">
        <p>Email này được tạo tự động từ Website của whale sea Freelance Studio.</p>
      </div>
    </div>
  `;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const body = parseJsonBody(req.body, req.headers?.['content-type']);
  const fullName = (body.fullName || body.name || '').trim();
  const phone = (body.phone || '').trim();
  const email = (body.email || '').trim();
  const serviceOfInterest = (body.serviceOfInterest || body.service || 'Website / Landing Page').trim();
  const businessName = (body.businessName || '').trim();
  const requestType = body.requestType || 'consult';
  const budget = body.budget || 'Chưa xác định ngân sách';
  const timeline = body.timeline || 'Chưa rõ';
  const message = (body.message || 'Không có ghi chú thêm').trim();
  const page = (body.page || body.pageSource || '/').trim();
  const submittedAt = body.submittedAt || new Date().toISOString();

  if (!fullName) {
    res.status(400).json({ success: false, error: 'Vui lòng nhập Họ và tên.' });
    return;
  }

  if (!phone) {
    res.status(400).json({ success: false, error: 'Vui lòng nhập Số điện thoại.' });
    return;
  }

  if (email && !isValidEmail(email)) {
    res.status(400).json({ success: false, error: 'Định dạng email không hợp lý.' });
    return;
  }

  const newSubmission = {
    id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: fullName,
    fullName,
    phone,
    email,
    service: serviceOfInterest,
    serviceOfInterest,
    businessName: businessName || 'Cá nhân / Chưa có doanh nghiệp',
    requestType,
    budget,
    timeline,
    message,
    submittedAt,
    page,
    pageSource: page
  };

  try {
    const currentSubmissions = readSubmissions();
    currentSubmissions.unshift(newSubmission);
    writeSubmissions(currentSubmissions);

    let emailSent = false;
    let emailFeedback = '';

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: contactFromEmail,
          to: [contactToEmail],
          subject: `Khách hàng mới từ website - ${fullName}`,
          html: buildEmailHtml(newSubmission)
        });
        emailSent = true;
        emailFeedback = 'Gửi email thông báo thành công qua Resend!';
      } catch (error: any) {
        emailFeedback = `Không thể gửi email vì lỗi Resend: ${error?.message || error}`;
        console.error(emailFeedback);
      }
    } else {
      emailFeedback = 'Chưa cấu hình RESEND_API_KEY. Dữ liệu vẫn được ghi nhận cục bộ.';
    }

    res.status(200).json({
      success: true,
      message: 'Gửi thông tin thành công. Chúng tôi sẽ liên hệ lại sớm!',
      data: newSubmission,
      emailSent,
      emailFeedback
    });
  } catch (error: any) {
    console.error('Submit contact error:', error);
    res.status(500).json({ success: false, error: 'Không thể gửi thông tin. Vui lòng thử lại.' });
  }
}
