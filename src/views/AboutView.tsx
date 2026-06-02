import React from 'react';
import { Shield, Sparkles, Coffee, UserCheck, MessageSquare, Anchor, Heart, Award } from 'lucide-react';

interface AboutViewProps {
  navigate: (path: string) => void;
}

export default function AboutView({ navigate }: AboutViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-16">
      {/* Intro Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#1E73FF]/10 text-[#1E73FF] border border-[#1E73FF]/15">
          VỀ CHÚNG TÔI
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight leading-tight">
          Câu Chuyện Về <br />
          <span className="bg-gradient-to-r from-[#1E73FF] via-[#22C7F5] to-blue-700 bg-clip-text text-transparent">
            whale sea Freelance Studio
          </span>
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Chúng tôi không cố tỏ ra là một tập đoàn công nghệ khổng lồ. whale sea hoạt động như một studio kỹ thuật tinh gọn, giải quyết các rào cản đo lường và hiển thị trực tuyến của doanh nghiệp nhỏ một cách chân thành nhất.
        </p>
      </div>

      {/* Brand values banner */}
      <div className="relative rounded-2xl overflow-hidden aspect-video max-w-3xl mx-auto border border-slate-200 shadow-xl">
        <img
          referrerPolicy="no-referrer"
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
          alt="Whale Teamwork"
          className="object-cover w-full h-full filter brightness-75 select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-white font-display font-medium text-lg italic sm:text-xl md:text-2xl text-shadow">
            "We are small, we are swift, we deliver elite crafts."
          </p>
          <p className="text-slate-300 text-xs mt-1">— Solo Founder & Network Team</p>
        </div>
      </div>

      {/* Core Concept */}
      <section className="space-y-6">
        <h2 className="font-display font-extrabold text-2xl text-slate-900 border-b border-slate-200 pb-3">
          Tuyên danh thương hiệu: Định vị "Tinh gọn"
        </h2>
        <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-4">
          <p>
            whale sea ra đời không nhằm cạnh tranh với những agency hàng trăm nhân sự có mức giá nghìn đô. Chúng tôi phục vụ những doanh nghiệp nhỏ, các cửa hàng, hộ gia đình kinh doanh, startup công nghệ và các cá nhân cung cấp dịch vụ độc lập—những người cực kỳ cần tối ưu hóa dòng tiền đầu tư.
          </p>
          <p>
            Mọi quy trình từ tiếp nhận yêu cầu, tư vấn chiến lược, vẽ layout, viết bài copywriting, cho tới cấu hình mã đo lường Google Tag Manager, viết code hay setup chiến dịch Ads đều được đảm nhiệm trực tiếp bởi Solo Founder giàu kinh nghiệm cùng mạng lưới các cộng tác viên giỏi (copywriters, designers, marketers) có uy tín trong nghề.
          </p>
        </div>
      </section>

      {/* Tôn chỉ của whale sea */}
      <section className="space-y-6">
        <h2 className="font-display font-extrabold text-2xl text-slate-900 border-b border-slate-200 pb-3">
          3 Nguyên Tắc Làm Việc Của whale sea
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-8 h-8 rounded-lg bg-[#1E73FF]/10 text-[#1E73FF] flex items-center justify-center">
              <UserCheck size={18} />
            </div>
            <h3 className="font-display font-bold text-slate-800 text-sm">Chân thành & Minh bạch</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Mức giá đã báo ban đầu là trọn gói duy nhất. Bạn được cập nhật và kiểm duyệt liên tục thiết kế demo trên internet trước mốc nghiệm thu.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-8 h-8 rounded-lg bg-[#1E73FF]/10 text-[#1E73FF] flex items-center justify-center">
              <Shield size={18} />
            </div>
            <h3 className="font-display font-bold text-slate-800 text-sm">Cứng tay & Đo lường tốt</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              whale sea đặc biệt chú trọng khâu kỹ thuật tích hợp đo lường GA4, Ads, Clarity và Pixel. Giúp website thực sự mang lại số liệu chuyển đổi rõ ràng.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm hover:shadow-md transition-all">
            <div className="w-8 h-8 rounded-lg bg-[#1E73FF]/10 text-[#1E73FF] flex items-center justify-center">
              <Coffee size={18} />
            </div>
            <h3 className="font-display font-bold text-slate-800 text-sm">Giản dị & Gần gũi</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Không nói từ ngữ hoa mỹ hay thuật ngữ "đao to búa lớn". Chúng tôi trò chuyện bằng ngôn ngữ bán hàng bình khuyên và hướng dẫn từng bước chi tiết nhất.
            </p>
          </div>
        </div>
      </section>

      {/* Lộ trình Giai đoạn */}
      <section className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="font-display font-extrabold text-lg text-[#1E73FF]">
          Lộ Trình Phát Triển whale sea
        </h3>
        <p className="text-slate-600 text-xs leading-relaxed">
          Được xây dựng là một tổ chức linh động, các phạm trù truyền thông công nghệ của studio sẽ mở rộng dần qua từng năm tháng để phục vụ trọn vẹn nhất cho quý khách hàng:
        </p>

        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 mt-0.5 min-w-max">
              Giai đoạn 1 (Sẵn Sàng)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <b>Xây dựng nền tảng gốc:</b> WordPress Web, Landing Page thu lead, Thiết kế cơ bản, Quảng cáo số, Cài đặt GTM đo lường & Tư vấn quy trình phác thảo.
            </p>
          </div>
          <div className="flex gap-4 items-start border-t border-slate-200 pt-4">
            <div className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono uppercase bg-amber-50 text-amber-700 border border-amber-200 mt-0.5 min-w-max">
              Giai đoạn 2 (Sắp tới)
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              <b>Mở rộng Smart Tools:</b> Quản trị CRM mini, QR code check-in, Đào tạo Canva/SEO/AI ngắn hạn, In ấn bao bì thi công backdrop, Set-up trọn gói tiệc trà teabreak và sự kiện khai trương ra mắt cửa hàng nhỏ.
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <div className="text-center pt-4">
        <button
          onClick={() => {
            navigate('/nhan-bao-gia');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          className="px-8 py-3.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#1E73FF] to-[#22C7F5] shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-center cursor-pointer inline-flex items-center gap-2"
        >
          Đặt lịch làm việc cùng chúng tôi
          <MessageSquare size={13} />
        </button>
      </div>
    </div>
  );
}
