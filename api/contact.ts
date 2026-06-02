import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers for API accessibility
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Chỉ chấp nhận phương thức POST',
    });
  }

  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const contactToEmail = process.env.CONTACT_TO_EMAIL;
    const contactFromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!resendApiKey) {
      return res.status(500).json({
        success: false,
        error: 'Thiếu RESEND_API_KEY trên Vercel.',
      });
    }

    if (!contactToEmail) {
      return res.status(500).json({
        success: false,
        error: 'Thiếu CONTACT_TO_EMAIL trên Vercel.',
      });
    }

    if (!contactFromEmail) {
      return res.status(500).json({
        success: false,
        error: 'Thiếu CONTACT_FROM_EMAIL trên Vercel.',
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

    const resolvedName = (name || fullName || '').trim();
    const resolvedPhone = (phone || '').trim();
    const resolvedEmail = (email || '').trim();
    const resolvedService = (service || serviceOfInterest || 'Chưa chọn dịch vụ').trim();
    const resolvedMessage = (message || 'Không có ghi chú thêm').trim();
    const resolvedPage = (page || pageSource || '/').trim();

    if (!resolvedName) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng nhập họ tên.',
      });
    }

    if (!resolvedPhone) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng nhập số điện thoại.',
      });
    }

    const requestTypeLabel =
      requestType === 'quote'
        ? 'Nhận báo giá dịch vụ đang triển khai'
        : requestType === 'interest'
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
              <td style="padding: 10px 0; color: #0f172a;">${businessName || 'Chưa cung cấp'}</td>
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
              <td style="padding: 10px 0; color: #0f172a;">${budget || 'Chưa xác định'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: bold; color: #475569;">Thời gian triển khai:</td>
              <td style="padding: 10px 0; color: #0f172a;">${timeline || 'Chưa rõ'}</td>
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

    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: contactFromEmail,
      to: [contactToEmail],
      subject: `[Whale Agency] Form mới từ website - ${resolvedName}`,
      html: emailHtml,
    });

    return res.status(200).json({
      success: true,
      message: 'Gửi thông tin thành công. Whale Agency sẽ liên hệ lại sớm!',
    });
  } catch (error: any) {
    console.error('Contact API error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Không thể gửi email. Vui lòng thử lại.',
    });
  }
}
