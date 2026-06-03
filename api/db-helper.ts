import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load Supabase configuration with fallback prefixes
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

// Determine if we should use Supabase
const useSupabase = !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

let supabaseInstance: any = null;

export function getSupabase() {
  if (!useSupabase) return null;
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          persistSession: false
        }
      });
      console.log('[DATABASE] Supabase client initialized via service role.');
    } catch (err) {
      console.error('[DATABASE] Failed to initialize Supabase client:', err);
    }
  }
  return supabaseInstance;
}

// Global path helpers for Vercel vs Local writable filesystem
function getTableFilePath(table: string): string {
  const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
  const folder = isVercel ? '/tmp/data' : path.join(process.cwd(), 'data');
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  return path.join(folder, `${table}.json`);
}

// Standard SEED DATA generator
export function getInitialSeedData(table: string): any[] {
  switch (table) {
    case 'posts':
      return [
        {
          id: 'blog-1',
          title: 'Hướng dẫn gắn Google Analytics 4 (GA4) cho website bán hàng nhỏ năm 2026',
          slug: 'huong-dan-gan-ga4-cho-website',
          excerpt: 'Làm thế nào để đo lường chính xác lượng truy cập và biết khách hàng đến từ nguồn nào? Bài viết hướng dẫn chi tiết từng bước gắn thẻ mã GA4 không cần chạm code.',
          category: 'Đo lường & Dữ liệu',
          date: '15/05/2026',
          readTime: '6 phút đọc',
          content: 'Đo lường là huyết mạch của tiếp thị số. Nếu bạn chạy quảng cáo mà không biết khách hàng từ đâu đến, bạn đang ném tiền qua cửa sổ. Dưới đây là các bước định cấu hình GA4 nhanh nhất:\n\n1. Tạo thuộc tính GA4 trong Google Analytics.\n2. Thiết lập Luồng dữ liệu (Data Stream) cho Website của bạn để nhận mã đo lường G-xxxxxxxxxx.\n3. Sử dụng Google Tag Manager (GTM) để chèn thẻ cấu hình Google mà không can thiệp sâu vào HTML gốc.\n4. Kích hoạt chế độ gỡ lỗi (DebugView) để kiểm chứng sự kiện gửi form hoạt động mượt mà.\n5. Xem báo cáo tại trang thời gian thực.',
          image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
          status: 'published',
          seo_title: 'Hướng dẫn cài đặt GA4 và GTM chuẩn 2026',
          seo_description: 'Hướng dẫn từng bước tích hợp Google Analytics 4 và Tag Manager chuẩn chỉ cho website.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'blog-2',
          title: '5 công thức Prompt ChatGPT/Gemini giúp tối ưu hóa Content Fanpage tự động',
          slug: '5-prompt-chatgpt-gemini-content-fanpage',
          excerpt: 'Tiết kiệm 80% thời gian lên ý tưởng nội dung mạng xã hội với những mẫu câu lệnh cực chất dành riêng cho các chủ doanh nghiệp bận rộn.',
          category: 'Ứng dụng AI',
          date: '12/05/2026',
          readTime: '5 phút đọc',
          content: 'Áp dụng AI vào chuỗi sản xuất content giúp studio nhỏ hoạt động hiệu suất bằng cả một phòng marketing truyền thống. Hãy tham khảo bộ khung prompt chuẩn chỉnh sau:\n\n"Vui lòng đóng vai là một Chuyên gia Copywriter dày rặn kinh nghiệm. Hãy viết một bài đăng Facebook hấp dẫn khoảng 300 từ nhằm giới thiệu sản phẩm dịch vụ [Tên dịch vụ] nhắm tới đối tượng [Khách hàng tiềm năng]. Sử dụng văn phong chân thật, thuyết phục và kèm theo 3 hashtag liên quan..."\n\nHãy chia nhỏ quy hoạch nội dung ra thành: Tìm ý tưởng -> Phác thảo dàn ý -> Viết nháp bản thảo -> Tinh chỉnh kêu gọi CTA.',
          image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
          status: 'published',
          seo_title: 'Prompts AI viết content mạng xã hội thần tốc',
          seo_description: 'Nhận diện các prompt mẫu ứng dụng viết content marketing chuyên nghiệp.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'blog-3',
          title: 'Bí quyết tối ưu tỷ lệ chuyển đổi (CRO) trên Landing Page ngân sách ít',
          slug: 'bi-quyet-toi-uu-ty-le-chuyen-doi',
          excerpt: 'Những thay đổi nhỏ ở tiêu đề chính, màu sắc nút CTA và tốc độ tải trang có thể giúp tăng gấp đôi lượng số điện thoại thu về ngay trong tuần.',
          category: 'Tận dụng Chuyển Đổi',
          date: '08/05/2026',
          readTime: '8 phút đọc',
          content: 'Landing page không chuyển đổi là một sự lãng phí rất lớn. Để tối ưu hóa landing page chạy ads, bạn cần tuân theo quy tắc sau:\n\n- **Tiêu đề đắt giá**: Trả lời ngay câu hỏi: Bạn giải quyết nỗi đau gì trong 3 giây đầu tiên?\n- **Thời gian tải trang**: Tối ưu dung lượng ảnh dưới 100kb bằng định dạng WebP.\n- **Nút bấm CTA**: Hãy giữ vị trí nổi bật tại dải màn hình đầu tiên và ghim ở chân trang trên thiết bị di động.\n- **Bằng chứng xã hội**: Đưa ảnh đánh giá thực tế của khách hàng đã sử dụng.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          status: 'published',
          seo_title: 'Bí quyết tối ưu tỷ lệ chuyển đổi (CRO) trên Landing Page',
          seo_description: 'Những thay đổi nhỏ ở tiêu đề chính, màu sắc nút CTA và tốc độ tải trang nâng cao chuyển đổi.',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

    case 'products':
      return [
        {
          id: 'prod-1',
          name: 'Website Doanh Nghiệp Cơ Bản',
          slug: 'website-doanh-nghiep-co-ban',
          short_description: 'Phù hợp nhất cho dịch vụ/kinh doanh nhỏ giới thiệu thương hiệu.',
          description: 'Hỗ trợ thiết kế trọn gói từ cấu trúc bài viết, hosting, domain, form gửi email và chuẩn seo.',
          category: 'Website',
          price_text: 'Từ 3.000.000đ',
          price_from: 3000000,
          features: ['Website 3-5 trang', 'Responsive di động', 'Form liên hệ thu lead', 'Gắn Analytics / Clarity'],
          suitable_for: ['Cá nhân kinh doanh', 'Cửa hàng', 'Doanh nghiệp thương mại nhỏ'],
          delivery_time: '7-10 ngày',
          status: 'available',
          image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          is_featured: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

    case 'services':
      return [
        {
          id: 'group-1',
          title: 'Website, Landing Page & Nền tảng số',
          status: 'available',
          badgeText: 'Đang nhận báo giá',
          ctaText: 'Nhận báo giá website',
          services: [
            { id: 'web-1', name: 'Thiết kế Website WordPress', status: 'available' },
            { id: 'web-2', name: 'Thiết kế website theo template', status: 'available' },
            { id: 'web-3', name: 'Thiết kế website tự code theo yêu cầu cơ bản', status: 'available' },
            { id: 'web-4', name: 'Thiết kế landing page', status: 'available' },
            { id: 'web-5', name: 'Tối ưu landing page chạy quảng cáo', status: 'available' },
            { id: 'web-6', name: 'Gắn form tư vấn', status: 'available' },
            { id: 'web-7', name: 'Gắn Google Analytics', status: 'available' },
            { id: 'web-8', name: 'Gắn Microsoft Clarity', status: 'coming_soon' },
            { id: 'web-9', name: 'Gắn Meta Pixel', status: 'coming_soon' },
            { id: 'web-10', name: 'Gắn Google Ads Conversion', status: 'available' },
            { id: 'web-11', name: 'Cấu hình domain, Vercel, Cloudflare cơ bản', status: 'coming_soon' },
            { id: 'web-12', name: 'Tư vấn cấu trúc website cho doanh nghiệp nhỏ', status: 'available' }
          ]
        },
        {
          id: 'group-2',
          title: 'Marketing & Quảng cáo Online',
          status: 'available',
          badgeText: 'Đang nhận báo giá',
          ctaText: 'Nhận báo giá marketing',
          services: [
            { id: 'mkt-1', name: 'Thuê ngoài marketing theo gói nhỏ', status: 'available' },
            { id: 'mkt-2', name: 'Lập kế hoạch marketing cơ bản', status: 'available' },
            { id: 'mkt-3', name: 'Quản lý fanpage', status: 'available' },
            { id: 'mkt-4', name: 'Content marketing', status: 'available' },
            { id: 'mkt-5', name: 'Viết bài website', status: 'available' },
            { id: 'mkt-6', name: 'Viết bài SEO cơ bản', status: 'available' },
            { id: 'mkt-7', name: 'Viết nội dung quảng cáo', status: 'available' },
            { id: 'mkt-8', name: 'Google Ads', status: 'available' },
            { id: 'mkt-9', name: 'Facebook Ads', status: 'available' },
            { id: 'mkt-10', name: 'TikTok Ads cơ bản', status: 'available' },
            { id: 'mkt-11', name: 'Zalo Ads cơ bản', status: 'available' },
            { id: 'mkt-12', name: 'Tối ưu landing page chuyển đổi', status: 'available' },
            { id: 'mkt-13', name: 'Theo dõi lead và báo cáo quảng cáo', status: 'available' }
          ]
        },
        {
          id: 'group-3',
          title: 'Content, Thiết kế & Truyền thông cơ bản',
          status: 'available',
          badgeText: 'Đang nhận báo giá',
          ctaText: 'Nhận báo giá nội dung',
          services: [
            { id: 'cnt-1', name: 'Viết nội dung website', status: 'available' },
            { id: 'cnt-2', name: 'Viết bài SEO cơ bản', status: 'available' },
            { id: 'cnt-3', name: 'Viết nội dung quảng cáo', status: 'available' },
            { id: 'cnt-4', name: 'Viết nội dung fanpage', status: 'available' },
            { id: 'cnt-5', name: 'Thiết kế banner cơ bản', status: 'available' },
            { id: 'cnt-6', name: 'Thiết kế bài đăng mạng xã hội', status: 'available' },
            { id: 'cnt-7', name: 'Thiết kế profile công ty cơ bản', status: 'available' },
            { id: 'cnt-8', name: 'Thiết kế brochure/catalogue cơ bản', status: 'available' },
            { id: 'cnt-9', name: 'Lên ý tưởng nội dung truyền thông', status: 'available' },
            { id: 'cnt-10', name: 'Viết kịch bản video ngắn', status: 'coming_soon' },
            { id: 'cnt-11', name: 'Quay phim & Chụp ảnh chuyên nghiệp (Videography & photography)', status: 'available', description: 'Cung cấp giải pháp ghi hình, chụp hình sản phẩm, sự kiện thực tế để làm hình ảnh tư liệu chuyên nghiệp.' }
          ]
        },
        {
          id: 'group-4',
          title: 'AI, Automation & Công cụ làm việc',
          status: 'coming_soon',
          badgeText: 'Sắp ra mắt',
          ctaText: 'Đăng ký quan tâm AI',
          services: [
            { id: 'ai-1', name: 'Tư vấn ứng dụng AI vào marketing', status: 'coming_soon' },
            { id: 'ai-2', name: 'Tạo prompt cho công việc', status: 'coming_soon' },
            { id: 'ai-3', name: 'Tạo template nội dung bằng AI', status: 'coming_soon' },
            { id: 'ai-4', name: 'Tạo workflow AI đơn giản', status: 'coming_soon' },
            { id: 'ai-5', name: 'Tự động hóa form và báo cáo cơ bản', status: 'coming_soon' },
            { id: 'ai-6', name: 'Hướng dẫn sử dụng AI sau bàn giao', status: 'coming_soon' },
            { id: 'ai-7', name: 'Chatbot AI cho website', status: 'coming_soon', description: 'Tích hợp chatbot thông minh hỗ trợ trả lời khách hàng 24/7 theo kịch bản tùy biến.' },
            { id: 'ai-8', name: 'Dashboard AI báo cáo marketing', status: 'coming_soon', description: 'Báo cáo marketing tự động hóa phân tích số liệu bằng AI trực sinh động.' },
            { id: 'ai-9', name: 'Hệ thống tự động hóa chăm sóc khách hàng', status: 'coming_soon', description: 'Gửi tin nhắn chăm sóc khách hàng, phân loại tự động nâng cao hiệu quả.' },
            { id: 'ai-10', name: 'Dịch vụ AI và App/Tool AI nội bộ cho doanh nghiệp', status: 'coming_soon', description: 'Xây dựng giải pháp AI ứng dụng bám sâu thực trạng hoạt động nội bộ của quý doanh nghiệp.' }
          ]
        },
        {
          id: 'group-5',
          title: 'Giải pháp số & App/Tool doanh nghiệp',
          status: 'hybrid',
          badgeText: 'Đang nhận & Sắp ra mắt',
          ctaText: 'Đăng ký quan tâm giải pháp',
          note: 'Một số giải pháp đã sẵn sàng đáp ứng yêu cầu của bạn, phần còn lại đang được phát triển theo từng giai đoạn.',
          services: [
            { id: 'sol-1', name: 'CRM quản lý khách hàng', status: 'coming_soon', description: 'Hệ thống quản trị cơ sở dữ liệu khách hàng, ghi nhận tiến độ chăm sóc từ phễu tiếp thị.' },
            { id: 'sol-2', name: 'Quản lý lead quảng cáo', status: 'coming_soon' },
            { id: 'sol-3', name: 'Dashboard marketing', status: 'coming_soon' },
            { id: 'sol-4', name: 'QR check-in', status: 'coming_soon' },
            { id: 'sol-5', name: 'Khảo sát khách hàng', status: 'coming_soon' },
            { id: 'sol-6', name: 'Booking lịch hẹn', status: 'coming_soon' },
            { id: 'sol-7', name: 'Loyalty/tích điểm', status: 'coming_soon' },
            { id: 'sol-8', name: 'Quản lý sự kiện', status: 'coming_soon' },
            { id: 'sol-9', name: 'Quản lý vé/đặt chỗ', status: 'coming_soon' },
            { id: 'sol-10', name: 'Báo cáo doanh thu', status: 'coming_soon' },
            { id: 'sol-11', name: 'Zalo Mini App - ZNS', status: 'available', description: 'Xây dựng ứng dụng Mini App mượt mà chạy trực tiếp trên nền tảng Zalo, tích hợp tin nhắn chăm sóc khách hàng tự động.' },
            { id: 'sol-12', name: 'Wifi Marketing', status: 'coming_soon' },
            { id: 'sol-13', name: 'Gamification', status: 'available', description: 'Tạo các trò chơi vòng quay, lật thẻ trúng quà nhằm kéo dài thời gian trải nghiệm và tỷ lệ chuyển đổi thu số điện thoại.' },
            { id: 'sol-14', name: 'Hệ thống check-in, khảo sát, báo cáo, thống kê', status: 'coming_soon' },
            { id: 'sol-15', name: 'Homestay không lễ tân', status: 'available', description: 'Giải pháp tự động hóa vận hành phòng homestay, mở khoá cửa từ xa, tương tác thông minh không cần lễ tân trực quầy.' },
            { id: 'sol-16', name: 'Hệ thống bán vé online', status: 'coming_soon' },
            { id: 'sol-17', name: 'Hệ thống đặt chỗ có thanh toán online', status: 'coming_soon' }
          ]
        },
        {
          id: 'group-6',
          title: 'Đào tạo & Khóa học ngắn hạn',
          status: 'coming_soon',
          badgeText: 'Sắp ra mắt',
          ctaText: 'Đăng ký nhận lịch học',
          note: 'Các khóa học ngắn hạn đang được whale sea xây dựng nội dung. Bạn có thể đăng ký quan tâm để nhận lịch học khi mở lớp.',
          services: [
            { id: 'edu-1', name: 'Khóa học AI ứng dụng', status: 'coming_soon' },
            { id: 'edu-2', name: 'Khóa học ChatGPT/Gemini', status: 'coming_soon' },
            { id: 'edu-3', name: 'Khóa học viết prompt', status: 'coming_soon' },
            { id: 'edu-4', name: 'Khóa học thiết kế website cơ bản', status: 'coming_soon' },
            { id: 'edu-5', name: 'Khóa học landing page', status: 'coming_soon' },
            { id: 'edu-6', name: 'Khóa học chạy quảng cáo cơ bản', status: 'coming_soon' },
            { id: 'edu-7', name: 'Khóa học content marketing', status: 'coming_soon' },
            { id: 'edu-8', name: 'Khóa học Canva', status: 'coming_soon' },
            { id: 'edu-9', name: 'Khóa học automation marketing', status: 'coming_soon' },
            { id: 'edu-10', name: 'Khóa học quản trị fanpage', status: 'coming_soon' },
            { id: 'edu-11', name: 'Khóa học công cụ số cho doanh nghiệp', status: 'coming_soon' }
          ]
        },
        {
          id: 'group-7',
          title: 'In ấn, Thi công quảng cáo & Quà tặng',
          status: 'hybrid',
          badgeText: 'Đang nhận & Sắp ra mắt',
          ctaText: 'Đăng ký quan tâm',
          note: 'Nhờ mạng lưới đối tác xưởng in ấn lớn và uy tín, chúng tôi tiếp nhận các đơn hàng in ấn, thi công biển bảng và sản xuất quà tặng.',
          services: [
            { id: 'prt-1', name: 'In banner', status: 'available', description: 'In ấn banner, băng rôn, bạt hiflex chất lượng rõ nét phục vụ quảng cáo.' },
            { id: 'prt-2', name: 'In poster', status: 'coming_soon' },
            { id: 'prt-3', name: 'In catalogue', status: 'coming_soon' },
            { id: 'prt-4', name: 'In brochure', status: 'coming_soon' },
            { id: 'prt-5', name: 'In namecard', status: 'coming_soon' },
            { id: 'prt-6', name: 'In menu', status: 'coming_soon' },
            { id: 'prt-7', name: 'In voucher', status: 'coming_soon' },
            { id: 'prt-8', name: 'In tem nhãn', status: 'coming_soon' },
            { id: 'prt-9', name: 'In bao bì', status: 'available', description: 'Thiết kế và in ấn bao bì sản phẩm, hộp giấy, túi nilon nhãn mác thương hiệu.' },
            { id: 'prt-10', name: 'Thi công bảng hiệu', status: 'available', description: 'Thiết kế, lắp đặt bảng hiệu Alu, hộp đèn, chữ nổi quảng cáo chuyên nghiệp ngoài trời.' },
            { id: 'prt-11', name: 'Thi công backdrop', status: 'available', description: 'Dịch vụ thi công khung sắt backdrop, căng bạt sự kiện khai trương, tiệc sinh nhật.' },
            { id: 'prt-12', name: 'Thi công standee', status: 'available', description: 'In bạt PP kèm cung cấp chân standee chữ X, standee cuốn nhôm linh động.' },
            { id: 'prt-13', name: 'Thi công decal', status: 'coming_soon' },
            { id: 'prt-14', name: 'Thi công hộp đèn', status: 'coming_soon' },
            { id: 'prt-15', name: 'Thi công POSM', status: 'coming_soon' },
            { id: 'prt-16', name: 'Sản xuất quà tặng doanh nghiệp', status: 'available', description: 'Gia công quà tặng in ấn logo thương hiệu (bình giữ nhiệt, sổ tay, bút ký, ô dù).' },
            { id: 'prt-17', name: 'In logo lên quà tặng', status: 'coming_soon' },
            { id: 'prt-18', name: 'Gift set theo concept', status: 'coming_soon' },
            { id: 'prt-19', name: 'Ly đựng quà tặng', status: 'coming_soon' },
            { id: 'prt-20', name: 'Bình giữ nhiệt thương hiệu', status: 'coming_soon' },
            { id: 'prt-21', name: 'Áo thun đồng phục', status: 'coming_soon' },
            { id: 'prt-22', name: 'Túi vải canvas', status: 'coming_soon' },
            { id: 'prt-23', name: 'Sổ tay thiết kế', status: 'coming_soon' },
            { id: 'prt-24', name: 'Bút kim loại in logo', status: 'coming_soon' },
            { id: 'prt-25', name: 'Hộp quà cao cấp', status: 'coming_soon' },
            { id: 'prt-26', name: 'Móc khóa mica/cao su', status: 'coming_soon' },
            { id: 'prt-27', name: 'Ô dù cầm tay gấp gọn', status: 'coming_soon' }
          ]
        },
        {
          id: 'group-8',
          title: 'Sự kiện, Tiệc ngọt & Activation',
          status: 'hybrid',
          badgeText: 'Đang nhận & Sắp ra mắt',
          ctaText: 'Đăng ký quan tâm sự kiện',
          note: 'whale sea liên kết cùng các đơn vị tổ chức ẩm thực và thiết bị sự kiện để cung cấp trọn gói khâu setup vận hành.',
          services: [
            { id: 'evt-1', name: 'Tổ chức sự kiện & Khai trương trọn gói (Event organization)', status: 'available', description: 'Lên kịch bản, cung cấp âm thanh, ánh sáng, MC, PG và thi công setup sự kiện hoàn chỉnh.' },
            { id: 'evt-2', name: 'Tổ chức hội thảo', status: 'available', description: 'Cho thuê thiết bị trình chiếu, setup check-in QR hội thảo và vận hành kĩ thuật.' },
            { id: 'evt-3', name: 'Sự kiện ra mắt sản phẩm', status: 'coming_soon' },
            { id: 'evt-4', name: 'Sự kiện tri ân khách hàng', status: 'coming_soon' },
            { id: 'evt-5', name: 'Sự kiện nội bộ doanh nghiệp', status: 'coming_soon' },
            { id: 'evt-6', name: 'Sự kiện bán hàng', status: 'coming_soon' },
            { id: 'evt-7', name: 'Activation', status: 'coming_soon' },
            { id: 'evt-8', name: 'Setup sân khấu', status: 'coming_soon' },
            { id: 'evt-9', name: 'Âm thanh, ánh sáng', status: 'coming_soon' },
            { id: 'evt-10', name: 'Backdrop sự kiện', status: 'coming_soon' },
            { id: 'evt-11', name: 'Nhân sự sự kiện', status: 'coming_soon' },
            { id: 'evt-12', name: 'Check-in QR sự kiện', status: 'coming_soon' },
            { id: 'evt-13', name: 'Tiệc ngọt & Catering trọn gói (All-inclusive catering packages)', status: 'available', description: 'Cung cấp tiệc ngọt teabreak chất lượng cao, trang trí tinh tế cho sự kiện, hội nghị.' },
            { id: 'evt-14', name: 'Teabreak hội thảo', status: 'coming_soon' },
            { id: 'evt-15', name: 'Tiệc sinh nhật công ty', status: 'coming_soon' },
            { id: 'evt-16', name: 'Tiệc ra mắt sản phẩm / Activation', status: 'coming_soon' },
            { id: 'evt-17', name: 'Setup bàn tiệc theo concept', status: 'coming_soon' }
          ]
        },
        {
          id: 'group-9',
          title: 'Tư vấn, Triển khai & Vận hành tổng thể',
          status: 'hybrid',
          badgeText: 'Đang nhận & Sắp ra mắt',
          ctaText: 'Nhận tư vấn phù hợp',
          services: [
            { id: 'cst-1', name: 'Tư vấn cấu trúc website', status: 'available' },
            { id: 'cst-2', name: 'Tư vấn landing page', status: 'available' },
            { id: 'cst-3', name: 'Tư vấn tracking quảng cáo', status: 'available' },
            { id: 'cst-4', name: 'Tư vấn marketing cơ bản', status: 'available' },
            { id: 'cst-5', name: 'Tư vấn lựa chọn công cụ AI', status: 'available' },
            { id: 'cst-6', name: 'Tư vấn quy trình thu lead', status: 'available' },
            { id: 'cst-7', name: 'Tư vấn chuyển đổi số cho doanh nghiệp', status: 'coming_soon', isComingSoonNote: 'whale sea phát triển lộ trình đào tạo và tư vấn văn phòng số, sẽ mở nhận trong tương lai.' },
            { id: 'cst-8', name: 'Tư vấn CRM', status: 'coming_soon', isComingSoonNote: 'whale sea sẽ mở nhận dịch vụ này trong giai đoạn tới.' },
            { id: 'cst-9', name: 'Tư vấn automation nâng cao', status: 'coming_soon', isComingSoonNote: 'whale sea sẽ mở nhận dịch vụ này trong giai đoạn tới.' },
            { id: 'cst-10', name: 'Tư vấn dashboard dữ liệu nâng cao', status: 'coming_soon', isComingSoonNote: 'whale sea sẽ mở nhận dịch vụ này trong giai đoạn tới.' },
            { id: 'cst-11', name: 'Triển khai hệ thống marketing & công nghệ trọn gói', status: 'available', description: 'Lập trình hạ tầng, kết nối các kênh đổ lead, xây dựng cổng website và setup phễu marketing trọn gói cho doanh nghiệp nhỏ.' },
            { id: 'cst-12', name: 'Vận hành dự án & marketing theo tháng (Monthly project operation)', status: 'available', description: 'Đóng vai trò là phòng marketing thuê ngoài, tối ưu và kiểm định, duy trì hiệu quả quảng cáo mỗi tháng.' },
            { id: 'cst-13', name: 'Quản lý dữ liệu khách hàng nâng cao', status: 'coming_soon', isComingSoonNote: 'whale sea sẽ mở nhận dịch vụ này trong giai đoạn tới.' },
            { id: 'cst-14', name: 'Báo cáo hiệu quả định kỳ nâng cao', status: 'coming_soon', isComingSoonNote: 'whale sea sẽ mở nhận dịch vụ này trong giai đoạn tới.' }
          ]
        }
      ];

    case 'pricing_plans':
      return [
        {
          id: 'price-1',
          name: 'Website Cơ Bản',
          price: 'Từ 3.000.000đ',
          features: [
            'Website giới thiệu 3–5 trang',
            'Giao diện responsive di động',
            'Form liên hệ thu thập thông tin',
            'Gắn Analytics / Clarity cơ bản',
            'Hướng dẫn quản trị chi tiết sau bàn giao'
          ],
          ctaText: 'Nhận báo giá website',
          badge: 'Phù hợp nhất cho dịch vụ/kinh doanh nhỏ',
          status: 'active',
          sort_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'price-2',
          name: 'Landing Page Chạy Ads',
          price: 'Từ 2.500.000đ',
          features: [
            '1 Landing page chuyển đổi cao',
            'Nội dung chuẩn Copywriting theo sản phẩm',
            'Form thu thập lead (khách hàng tiềm năng)',
            'Lời kêu gọi hành động (CTA) rõ ràng, hút khách',
            'Gắn mã theo dõi quảng cáo (Meta, GA4, Clarity)',
            'Tối ưu giao diện Mobile trải nghiệm cực mượt'
          ],
          ctaText: 'Làm landing page ngay',
          badge: 'Bùng nổ chiến dịch quảng cáo',
          status: 'active',
          sort_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'price-3',
          name: 'Setup Quảng Cáo Cơ Bản',
          price: 'Từ 2.000.000đ / tháng',
          features: [
            'Tư vấn tối ưu hóa ngân sách hàng ngày',
            'Thiết lập chiến dịch Google, Facebook cơ bản',
            'Viết các mẫu quảng cáo/tiêu đề thu hút',
            'Gắn pixel tracking chuẩn xác',
            'Theo dõi và báo cáo tối ưu chuyển đổi ban đầu'
          ],
          ctaText: 'Nhận báo giá marketing',
          badge: 'Tiếp cận khách hàng mục tiêu',
          status: 'active',
          sort_order: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'price-4',
          name: 'Content & Thiết Kế Cơ Bản',
          price: 'Từ 1.500.000đ',
          features: [
            'Biên soạn nội dung chuẩn SEO website/fanpage',
            'Viết bài viết chăm sóc website/fanpage',
            'Thiết kế banner hoặc bài đăng đơn giản (Canva/PS)',
            'Lên ý tưởng, định hướng chuỗi nội dung theo tuần/tháng'
          ],
          ctaText: 'Nhận báo giá nội dung',
          status: 'active',
          sort_order: 4,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'price-5',
          name: 'Tracking & Đo Lường',
          price: 'Từ 1.000.000đ',
          features: [
            'Cấu hình Google Analytics 4 (GA4)',
            'Cơ chế ghi hình nhiệt Microsoft Clarity',
            'Tích hợp Meta Pixel & Đo lường chuyển đổi',
            'Cài đặt Google Ads Conversion Tracking',
            'Quản lý thẻ thông qua Google Tag Manager (GTM)',
            'Kiểm thử hoạt động của sự kiện Submit Form'
          ],
          ctaText: 'Gắn tracking đo lường',
          badge: 'Tối ưu dựa trên dữ liệu',
          status: 'active',
          sort_order: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'price-6',
          name: 'Đồng Hành Marketing Nhỏ',
          price: 'Từ 4.000.000đ / tháng',
          features: [
            'Tư vấn kế hoạch truyền thông/marketing tổng quan',
            'Vận hành nội dung mượt mà hàng tuần',
            'Tối ưu chiến dịch quảng cáo tiết kiệm ngân sách',
            'Theo dõi thu nhận lead & lọc data ảo',
            'Báo cáo minh bạch hiệu quả hàng tháng'
          ],
          ctaText: 'Đăng ký đồng hành',
          badge: 'Giải pháp Freelance tối ưu nhất',
          status: 'active',
          sort_order: 6,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

    case 'projects':
      return [
        {
          id: 'proj-1',
          title: 'Website Giới Thiệu Nha Khoa Minh Khai',
          category: 'Website giới thiệu dịch vụ',
          description: 'Thiết kế giao diện hiện đại, chuyên nghiệp với tính năng đăng ký lịch hẹn khám thông minh, tích hợp hiển thị cơ sở vật chất bằng hình ảnh thực tế sắc nét.',
          image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
          tags: ['WordPress', 'SEO Cơ bản', 'Responsive', 'Booking'],
          websiteUrl: 'https://nhakhoaminhkhai.vn',
          gallery: [
            'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1629557940711-2512a334db36?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1579684388669-650a3ccbcbec?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
          ],
          challenge: 'Nha Khoa Minh Khai gặp khó khăn trong việc thu hút khách hàng mới đăng ký trực tuyến, website cũ tải chậm (mất 8 giây), trải nghiệm đặt lịch hẹn rườm rà dẫn đến tỷ lệ thoát trang lớn.',
          solution: 'Chúng tôi thiết kế lại hoàn toàn website trên nền tảng WordPress chuẩn SEO, tối ưu tốc độ tải trang dưới 2 giây. Đặc biệt, xây dựng luồng đặt hẹn 1 chạm tinh gọn tích hợp kiểm tra phòng trống theo thời gian thực.',
          results: [
            'Tốc độ phản tải trang cải thiện vượt trội (Speed Index từ 8s xuống 1.8s)',
            'Tăng trưởng 75% lượng biểu mẫu đặt lịch hẹn tư vấn và khám dịch vụ thành công',
            'Tăng lượng hiển thị tự nhiên (Organic Traffic) trên Google thêm 45% sau 3 tháng bàn giao'
          ],
          details: 'Bằng việc kết xuất hình ảnh 4K sinh động về phòng lab, đội ngũ bác sĩ tay nghề cao, nâng tầm niềm tin cho bệnh nhân ngay từ dải màn hình đầu tiên. Hệ thống dữ liệu lịch hẹn đồng bộ mượt mà về Google Sheets giúp nhân viên tư vấn gọi điện xác nhận nhanh chóng.',
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'proj-2',
          title: 'Landing Page Sách Hack Não Tiếng Anh',
          category: 'Landing page thu lead',
          description: 'Trang landing page bán hàng kết hợp quà tặng ebook, cấu trúc tâm lý học hành vi giúp thu hút hơn 3.000 leads đăng ký chỉ trong 1 tháng đầu tiên.',
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          tags: ['Landing Page', 'Copywriting', 'Pixel Tracking'],
          websiteUrl: 'https://hacknaotienganh-demo.whale.agency',
          gallery: [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
          ],
          challenge: 'Doanh số bán sách chững lại do trang bán hàng cũ quá nhiều văn bản, thiếu cấu trúc thuyết phục, không kích thích được sự tò mò học thử của độc giả trẻ tuổi.',
          solution: 'Áp dụng bộ khung Copywriting chuẩn AIDA, dẫn dắt độc giả qua chuỗi câu chuyện nỗi sợ học từ vựng truyền thống, từ đó mở ra giải pháp Hack Não Tiếng Anh. Đi kèm nút download ebook học thử miễn phí tại chỗ để bẫy leads tiềm năng.',
          results: [
            'Thu về hơn 3.200 số điện thoại và email đăng ký nhận tài liệu chỉ trong 28 ngày đầu tiên',
            'Tăng tỷ lệ chuyển đổi mua sách trực tiếp một cách rõ rệt (CR đạt mức 8.5% so với mức 3.2% cũ)',
            'Gắn thẻ Pixel đo lường chi tiết hành vi cuộn trang để tái mục tiêu (Retargeting) chuẩn xác'
          ],
          details: 'Chúng tôi tối giản hoá form đăng ký chỉ gồm 3 trường thông tin thiết yếu nhất. Kết hợp hiệu ứng ghim nút CTA bám đuổi chân màn hình trên thiết bị di động để tối ưu trải nghiệm của người dùng lướt feed TikTok/Facebook Ads.',
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'proj-3',
          title: 'Hệ Thống Đo Lường Cho Thời Trang Z-Studio',
          category: 'Setup tracking GA4/Clarity/Pixel',
          description: 'Chữa lỗi tracking bị lệch 40% trên Facebook Business. Cài đặt chuẩn xác GTM, đo lường toàn bộ hành vi cuộn trang, nhấp nút mua và sự kiện checkout.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          tags: ['GA4', 'Clarity', 'Pixel', 'GTM'],
          websiteUrl: 'https://zstudio-fashion.vn',
          gallery: [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80'
          ],
          challenge: 'Chủ thương hiệu Z-Studio liên tục chịu cảnh đốt ngân sách quảng cáo không hiệu quả do dữ liệu chuyển đổi bị lệch lớn, không thể phân biệt dữ liệu click robot ảo và khách có nhu cầu thực tế.',
          solution: 'Khởi tạo Google Tag Manager (GTM) để quản lý tập trung toàn hệ thống. Đo lường sự kiện nâng cao bao gồm: Nhấp xem ảnh sản phẩm, Thêm vào giỏ hàng (Add To Cart), và Gửi thông tin thanh toán (Purchase) đồng thời tích hợp ghi hình nhiệt Microsoft Clarity.',
          results: [
            'Khắc phục triệt để lỗi lệch dữ liệu Facebook Conversions API (đưa sai số về dưới mức 3%)',
            'Ghi hình hành vi cuộn trang của khách hàng giúp phát hiện và lược bỏ 2 lỗi chết trên giao điện giỏ hàng',
            'Cung cấp bức tranh trực quan phân loại rạch ròi 4 nhóm khách hàng có giá trị cao nhất'
          ],
          details: 'Nhờ số liệu minh bạch được cấu hình thông qua Google Analytics 4, chủ studio đã can đảm đưa ra các quyết định ngưng chạy dòng sản phẩm kém tiềm năng, chuyển dời 60% ngân sách tập trung cho tệp khách sỉ có hành vi ở lại trang cực kì lâu.',
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'proj-4',
          title: 'Quản Trị Content & Ads Cho Chuỗi Cafe Vintage',
          category: 'Content fanpage & Setup quảng cáo',
          description: 'Giải pháp thuê ngoài trọn gói bao gồm lên kế hoạch content 15 bài/tháng, thiết kế hình ảnh feed retro vintage đồng bộ và vận hành Google/Facebook Ads.',
          image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
          tags: ['Content Core', 'Graphic Design', 'FB Ads'],
          websiteUrl: 'https://vintagecafe.whale.agency',
          gallery: [
            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
          ],
          challenge: 'Fanpage trống nội dung, thiếu chất thơ cần có của một quán cafe vintage mộc mạc. Chạy ads thô lỗ chỉ nhét giá menu khiến quán vắng khách dù ở vị trí trung tâm.',
          solution: 'Tạo lập nội dung theo hình mẫu người chia sẻ (The Creator) kể những mẩu chuyện nhỏ bên cốc cà phê mộc. Setup ảnh chụp cổ điển ấm áp đồng bộ toàn kênh, tổ chức minigame "Gửi một lời chúc - Nhận một ly trà" lan tỏa tự nhiên.',
          results: [
            'Số lượng tương tác tự nhiên (Organic Reach) trên fanpage tăng vọt 210% sau 2 tuần vận hành',
            'Tiết kiệm 35% chi phí quảng cáo hiển thị nhờ điểm chất lượng nội dung hấp dẫn tự nhiên',
            'Quán luôn chật kín bàn vào các tối cuối tuần bằng chiến dịch định hướng bản đồ vị trí Google Maps'
          ],
          details: 'Từng tác phẩm hình ảnh bài đăng đều được căn góc, kéo màu kĩ lưỡng bảo đảm tính độc quyền cho chuỗi cafe. Không copy nội dung đại trà, kiến tạo bản sắc riêng là yếu tố cốt lõi giữ chân khách hàng.',
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'proj-5',
          title: 'Zalo Mini App & Loyalty Cho Nhà Hàng Sen Vàng',
          category: 'Zalo Mini App & Loyalty System',
          description: 'Phát triển Zalo Mini App tích hợp hệ thống Loyalty và Tích điểm tự động bằng QR Code tại bàn. Khách hàng quét mã là có thể đăng ký thành viên trọn đời.',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
          tags: ['Zalo Mini App', 'ZNS Marketing', 'Loyalty System', 'QR Code'],
          websiteUrl: 'https://sen-vang-restaurant.whale.agency',
          gallery: [
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80'
          ],
          challenge: 'Nhà hàng đối mặt với tỉ lệ khách quay lại thấp và khó khăn trong việc thu thập thông tin khách hàng trung thành, việc cài đặt ứng dụng rời phức tạp kéo lùi trải nghiệm người dùng.',
          solution: 'Xây dựng Zalo Mini App cực nhẹ chạy trực tiếp trong ứng dụng Zalo người dùng sẵn có. Khách hàng chỉ việc quét mã QR tại quầy thanh toán hoặc mặt bàn để nhận chiết khấu, thăng hạng thành viên tức thời.',
          results: [
            'Thu hút hơn 4.200 thực khách đăng ký tài khoản thành viên chỉ sau 1.5 tháng triển khai',
            'Đóng góp nâng tỷ lệ thực khách quay lại nhà hàng (Retention Rate) tăng thêm 42%',
            'Cắt giảm sâu đến 85% chi phí gửi tin nhắn tri ân chăm sóc truyền thống nhờ kênh Zalo ZNS tự động hóa'
          ],
          details: 'Ứng dụng cho phép khách hàng tự kiểm tra xếp hạng thẻ (Đồng, Bạc, Vàng), số điểm khả dụng và đổi lấy vé buffet hoặc đĩa khai vị tặng kèm trực quan. Giúp tối ưu vận hành cho thu ngân bằng hệ thống đối soát QR Code.',
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

    case 'solutions':
      return [
        {
          id: 'sol-1',
          title: 'CRM Quản lý khách hàng',
          slug: 'crm-quan-ly-khach-hang',
          short_description: 'Phễu quản lý cơ sở dữ liệu khách hàng từ quảng cáo tập trung.',
          description: 'Giúp doanh nghiệp theo sát hành trình khách hành từ khi tiếp nhận yêu cầu đến tư vấn, chốt sales.',
          category: 'Hệ thống Quản trị',
          features: ['Tự động phân chia lead cho Sale', 'Ghi chú lịch sử chăm sóc', 'Báo cáo phễu chuyển đổi'],
          suitable_for: ['Phòng Sales', 'Agency', 'Cửa hàng dịch vụ'],
          status: 'coming_soon',
          image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'sol-2',
          title: 'Zalo Mini App - ZNS',
          slug: 'zalo-mini-app-zns',
          short_description: 'Dựng app chạy mượt ngay trên Zalo, tích hợp tin nhắn chăm sóc tự động.',
          description: 'Giải pháp tiếp cận khách hàng toàn diện trực tiếp trên điện thoại người dùng không cần cài đặt rườm rà.',
          category: 'Ứng dụng di động',
          features: ['Mini game trúng quà', 'Quét mã tích điểm', 'Gửi tin Zalo ZNS chăm sóc khách hàng'],
          suitable_for: ['Nhà hàng', 'Cà phê', 'Tiệm giặt là', 'Chuỗi bán lẻ'],
          status: 'available',
          image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

    case 'courses':
      return [
        {
          id: 'course-1',
          title: 'AI Ứng Dụng Trong Content Marketing',
          slug: 'ai-ung-dung-content-marketing',
          description: 'Học cách làm chủ Gemini và ChatGPT để lên kế hoạch và viết kịch bản mượt mà.',
          target_audience: 'Marketers, freelancers, doanh nghiệp nhỏ',
          curriculum: ['Tổng quan về AI', 'Viết prompt nâng cao', 'Lên chuỗi kịch bản video ngắn', 'Kiểm chứng nội dung'],
          duration: '4 buổi (Online/Offline)',
          format: 'Hybrid học kết hợp thực hành trực tiếp',
          price_text: 'Liên hệ tư vấn',
          status: 'coming_soon',
          image_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

    case 'site_settings':
      return [
        { id: '1', key: 'brand_name', value: 'Whale Sea' },
        { id: '2', key: 'tagline', value: 'Premium Digital Agency & Freelance Studio' },
        { id: '3', key: 'hotline', value: '0338808117' },
        { id: '4', key: 'email_receiver', value: 'insightads.vn@gmail.com' },
        { id: '5', key: 'zalo_link', value: 'https://zalo.me/0338808117' },
        { id: '6', key: 'facebook_link', value: 'https://www.facebook.com/khan7th5.iam/' },
        { id: '7', key: 'messenger_link', value: 'https://m.me/khan7th5.iam/' },
        { id: '8', key: 'site_domain', value: 'https://www.khansea.io.vn/' }
      ];

    default:
      return [];
  }
}

// Legacy local file upgrade and schema migration helper
function migrateOrUpgradeCollection(table: string, data: any[]): any[] {
  if (!Array.isArray(data) || data.length === 0) {
    return getInitialSeedData(table);
  }

  // 1. Services
  if (table === 'services') {
    const isLegacy = data.some(item => !item.hasOwnProperty('services'));
    if (isLegacy) {
      console.warn(`[DATABASE] Services local data schema is legacy, automatically upgrading to latest seed schema...`);
      return getInitialSeedData(table);
    }
  }

  // 2. Pricing Plans
  if (table === 'pricing_plans') {
    const isLegacy = data.some(item => item.hasOwnProperty('cta_text') || !item.hasOwnProperty('ctaText'));
    if (isLegacy) {
      console.warn(`[DATABASE] Pricing plans local data schema is legacy, automatically upgrading to latest seed schema...`);
      return getInitialSeedData(table);
    }
  }

  // 3. Projects
  if (table === 'projects') {
    const isLegacy = data.some(item => item.hasOwnProperty('image_url') || !item.hasOwnProperty('results'));
    if (isLegacy) {
      console.warn(`[DATABASE] Projects local data schema is legacy, automatically upgrading to latest seed schema...`);
      return getInitialSeedData(table);
    }
  }

  // 4. Posts
  if (table === 'posts') {
    const isLegacy = data.some(item => item.hasOwnProperty('cover_image') || !item.hasOwnProperty('image'));
    if (isLegacy) {
      console.warn(`[DATABASE] Posts local data schema is legacy, automatically upgrading to latest seed schema...`);
      return getInitialSeedData(table);
    }
  }

  return data;
}

// Global CRUD implementation with Supabase fallback
export function checkProductionSupabase() {
  if (process.env.NODE_ENV === 'production') {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Cấu hình Supabase bị thiếu trên môi trường Production (thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY). Vui lòng thiết lập biến môi trường.');
    }
  }
}

export async function getCollection<T>(table: string): Promise<T[]> {
  checkProductionSupabase();
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.from(table).select('*').order('created_at', { ascending: false });
      if (error) {
        throw error;
      }
      if (data) {
        return data as T[];
      }
    } catch (e: any) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Lỗi truy vấn Supabase trên bảng "${table}": ${e?.message || JSON.stringify(e)}`);
      }
      console.log(`[DATABASE] Table "${table}" is not active on Supabase. Falling back to local file storage...`);
    }
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Supabase chưa cấu hình hoặc không kết nối được bảng "${table}" trên môi trường Production. Không thể dùng fallback file.`);
  }

  // Fallback to json files natively
  const filePath = getTableFilePath(table);
  if (!fs.existsSync(filePath)) {
    const seed = getInitialSeedData(table);
    fs.writeFileSync(filePath, JSON.stringify(seed, null, 2), 'utf-8');
    return seed as T[];
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    const migrated = migrateOrUpgradeCollection(table, parsed);
    if (JSON.stringify(parsed) !== JSON.stringify(migrated)) {
      fs.writeFileSync(filePath, JSON.stringify(migrated, null, 2), 'utf-8');
    }
    return migrated as T[];
  } catch (err) {
    console.error(`Error reading local table ${table}:`, err);
    return getInitialSeedData(table) as T[];
  }
}

export async function saveCollection<T>(table: string, list: T[]): Promise<void> {
  checkProductionSupabase();
  const sb = getSupabase();
  if (sb) {
    try {
      // For Supabase, the easiest sync is to delete previous and mass insert, or let client handle rows.
      // But since we are building simple CMS serverless admin api endpoints, it is safer to perform upserts or rows handling.
      // Since some tables don't have RLS allowed or require quick batch, we'll try to sync or fail over.
      // We will perform upsert operations.
      const { error } = await sb.from(table).upsert(list, { onConflict: 'id' });
      if (error) {
        throw error;
      }
      return;
    } catch (e: any) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Lỗi cập nhật hoặc đồng bộ Supabase trên bảng "${table}": ${e?.message || JSON.stringify(e)}`);
      }
      console.log(`[DATABASE] Supabase upsert not active on ${table}, saved local draft.`);
    }
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Supabase chưa cấu hình hoặc không kết nối được bảng "${table}" trên môi trường Production. Không thể dùng fallback file.`);
  }

  const filePath = getTableFilePath(table);
  try {
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error saving local table ${table}:`, err);
  }
}

// Single item CRUD operations
export async function insertItem<T extends { id?: string; created_at?: string; updated_at?: string }>(table: string, item: T): Promise<T> {
  checkProductionSupabase();
  const sb = getSupabase();
  const newItem = {
    ...item,
    id: item.id || `${table.substring(0, 4)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (sb) {
    try {
      const { data, error } = await sb.from(table).insert([newItem]).select();
      if (error) {
        throw error;
      }
      return (data && data[0] ? data[0] : newItem) as T;
    } catch (e: any) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Lỗi thêm mới dòng vào bảng "${table}" trên Supabase: ${e?.message || JSON.stringify(e)}`);
      }
      console.log(`[DATABASE] Supabase insert failed: ${e?.message || JSON.stringify(e)}. Falling back to local file...`);
    }
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Supabase chưa cấu hình hoặc không kết nối được để thêm dòng vào bảng "${table}" trên môi trường Production. Không thể dùng fallback file.`);
  }

  // Fallback to local file storage (development only!)
  const list = await getCollection<T>(table);
  list.unshift(newItem);
  await saveCollection(table, list);
  return newItem;
}

export async function updateItem<T extends { id: string; updated_at?: string }>(table: string, id: string, payload: Partial<T>): Promise<T> {
  checkProductionSupabase();
  const sb = getSupabase();
  const updatedPayload = {
    ...payload,
    updated_at: new Date().toISOString()
  };

  if (sb) {
    try {
      const { data, error } = await sb.from(table).update(updatedPayload).eq('id', id).select();
      if (error) {
        throw error;
      }
      if (data && data[0]) {
        return data[0] as T;
      }
      const fetched = await sb.from(table).select('*').eq('id', id).single();
      if (fetched.data) {
        return fetched.data as T;
      }
    } catch (e: any) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Lỗi cập nhật dòng ID ${id} trên bảng "${table}" của Supabase: ${e?.message || JSON.stringify(e)}`);
      }
      console.log(`[DATABASE] Supabase update failed: ${e?.message || JSON.stringify(e)}. Falling back to local file...`);
    }
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Supabase chưa cấu hình hoặc không kết nối được để cập nhật dòng trên bảng "${table}" trên môi trường Production. Không thể dùng fallback file.`);
  }

  // Fallback to local file storage (development only!)
  const list = await getCollection<T>(table);
  const index = list.findIndex((x: any) => x.id === id);
  if (index === -1) {
    throw new Error(`Không tìm thấy dòng ${id} trong bảng ${table}`);
  }

  const updated = {
    ...list[index],
    ...payload,
    updated_at: new Date().toISOString()
  };

  list[index] = updated;
  await saveCollection(table, list);
  return updated;
}

export async function removeItem<T extends { id: string }>(table: string, id: string): Promise<void> {
  checkProductionSupabase();
  const sb = getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from(table).delete().eq('id', id);
      if (error) {
        throw error;
      }
      return;
    } catch (e: any) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(`Lỗi xóa dòng ID ${id} trên bảng "${table}" của Supabase: ${e?.message || JSON.stringify(e)}`);
      }
      console.log(`[DATABASE] Supabase delete failed: ${e?.message || JSON.stringify(e)}. Falling back to local file...`);
    }
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Supabase chưa cấu hình hoặc không kết nối được để xóa dòng trong bảng "${table}" trên môi trường Production. Không thể dùng fallback file.`);
  }

  // Fallback to local file storage (development only!)
  const list = await getCollection<T>(table);
  const filtered = list.filter((x: any) => x.id !== id);
  await saveCollection(table, filtered);
}
