import React, { useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Layers,
  Database,
  CheckCircle2,
  Cpu,
  Globe,
  TrendingUp,
  FileText,
  BadgeAlert,
  Calendar,
  Gift,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { SERVICE_GROUPS, PRICING_PLANS, PORTFOLIO_PROJECTS, BLOG_POSTS, FAQS } from '../data';
import ContactForm from '../components/ContactForm';

interface HomeViewProps {
  navigate: (path: string) => void;
  setPreFilledForm: (data: { service: string; requestType: 'quote' | 'interest' | 'consult' }) => void;
}

export default function HomeView({ navigate, setPreFilledForm }: HomeViewProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCtaClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleInterestClick = (serviceName: string) => {
    setPreFilledForm({
      service: serviceName,
      requestType: 'interest'
    });
    navigate('/nhan-bao-gia');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleQuoteClick = (serviceName: string) => {
    setPreFilledForm({
      service: serviceName,
      requestType: 'quote'
    });
    navigate('/nhan-bao-gia');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const groupIcons: { [key: string]: React.ReactNode } = {
    'group-1': <Globe className="text-[#1E73FF] w-5 h-5" />,
    'group-2': <TrendingUp className="text-[#1E73FF] w-5 h-5" />,
    'group-3': <FileText className="text-[#1E73FF] w-5 h-5" />,
    'group-4': <Sparkles className="text-[#1E73FF] w-5 h-5" />,
    'group-5': <Layers className="text-[#1E73FF] w-5 h-5" />,
    'group-6': <Cpu className="text-[#1E73FF] w-5 h-5" />,
    'group-7': <Gift className="text-[#1E73FF] w-5 h-5" />,
    'group-8': <Calendar className="text-[#1E73FF] w-5 h-5" />,
    'group-9': <Database className="text-[#1E73FF] w-5 h-5" />
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1E73FF]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          {/* Animated Badge */}
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#1E73FF]/10 text-[#1E73FF] border border-[#1E73FF]/15 shadow-inner">
            <span className="w-1.5 h-1.5 bg-[#1E73FF] rounded-full mr-2 animate-pulse" />
            Website &bull; Landing Page &bull; Ads &bull; Content &bull; AI &bull; Tracking
          </div>

          {/* Headline */}
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-slate-900 tracking-tight leading-[1.15]">
            Freelance Studio làm <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#1E73FF] via-[#22C7F5] to-blue-700 bg-clip-text text-transparent">
              Website, Marketing & AI
            </span> <br />
            tinh gọn cho doanh nghiệp nhỏ
          </h1>

          {/* Subheadline */}
          <p className="text-slate-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            whale sea giúp bạn xây dựng website, landing page, nội dung, quảng cáo, tracking và từng bước mở rộng các giải pháp số để tìm kiếm khách hàng hiệu quả hơn.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleCtaClick('/nhan-bao-gia')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#1E73FF] to-[#22C7F5] shadow-lg shadow-blue-500/20 hover:opacity-95 active:scale-95 transition-all text-center cursor-pointer"
            >
              Nhận báo giá miễn phí
            </button>
            <button
              onClick={() => handleCtaClick('/dich-vu')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:text-slate-900 hover:bg-slate-50 active:scale-95 transition-all text-center cursor-pointer shadow-sm"
            >
              Xem dịch vụ
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-slate-400 text-xs max-w-2xl mx-auto leading-relaxed">
            * Các dịch vụ nâng cao như app/tool, Zalo Mini App, in ấn, sự kiện và khóa học đang được phát triển và sẽ ra mắt theo từng giai đoạn.
          </p>
        </div>
      </section>

      {/* 2. DỊCH VỤ ĐANG NHẬN BÁO GIÁ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-display font-extrabold text-3xl text-slate-900">Dịch Vụ Đang Sẵn Sàng</h2>
          <p className="text-slate-655 text-sm max-w-2xl mx-auto">
            Các chuyên môn chính trong giai đoạn 1 mà whale sea tự tin triển khai tốt nhất trực tiếp giúp doanh nghiệp nhỏ mở rộng đầu ra doanh thu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICE_GROUPS.filter(g => g.status === 'available' || g.status === 'hybrid').map((group) => {
            const availableServices = group.services.filter(s => s.status === 'available');
            return (
              <div
                key={group.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 hover:border-[#1E73FF]/40 hover:shadow-lg hover:shadow-slate-100/85 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-205/60">
                      {groupIcons[group.id] || <Globe className="text-[#1E73FF]" />}
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                      Đang nhận báo giá
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 mb-4">{group.title}</h3>

                  <ul className="space-y-2 mb-6">
                    {availableServices.map((service) => (
                      <li key={service.id} className="flex items-start gap-2 text-xs text-slate-650">
                        <CheckCircle2 size={13} className="text-[#1E73FF] mt-0.5 flex-shrink-0" />
                        <span>{service.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleQuoteClick(group.services[0]?.name || group.title)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-center text-[#1E73FF] bg-[#1E73FF]/10 hover:bg-[#1E73FF]/15 border border-[#1E73FF]/20 hover:border-[#1E73FF]/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {group.ctaText}
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. DỊCH VỤ SẮP RA MẮT */}
      <section className="bg-slate-50/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-[#1E73FF]/10 text-[#1E73FF] border border-[#1E73FF]/15">
              GIAI ĐOẠN PHÁT TRIỂN
            </span>
            <h2 className="font-display font-extrabold text-3xl text-slate-900">Dịch Vụ Sắp Ra Mắt</h2>
            <p className="text-slate-605 text-sm max-w-2xl mx-auto">
              Các giải pháp nâng cao nằm trong lộ trình xây dựng và quy chuẩn liên kết mạng lưới nhà thầu đang chuẩn bị công bố hoạt động của whale sea.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICE_GROUPS.filter(g => g.status === 'coming_soon').slice(0, 4).map((group) => (
              <div
                key={group.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-[#1E73FF]/30 hover:shadow-md hover:shadow-slate-100 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-slate-50 rounded-lg text-slate-400 border border-slate-100">
                      {groupIcons[group.id] || <Layers className="text-slate-400" />}
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                      Sắp ra mắt
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-sm text-slate-800 mb-2">{group.title}</h3>
                  <p className="text-slate-505 text-[11px] leading-relaxed mb-4">
                    {group.note || 'Đang xây dựng hoàn thiện quy trình tư vấn và thiết lập nhà thầu cơ sở.'}
                  </p>
                </div>

                <button
                  onClick={() => handleInterestClick(group.title)}
                  className="w-full py-2 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-[#1E73FF] bg-slate-50 border border-slate-200/60 hover:border-slate-300 hover:bg-white transition-all cursor-pointer text-center"
                >
                  Tôi muốn quan tâm trước
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => handleCtaClick('/dich-vu')}
              className="text-[#1E73FF] hover:text-blue-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              Xem chi tiết tất cả các dịch vụ sắp tới
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BẢNG GIÁ NỔI BẬT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-display font-extrabold text-3xl text-slate-900">Bảng Giá Tham Khảo</h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            Minh bạch chi phí đầu tư ban đầu giúp doanh nghiệp dễ dàng cân đối tài chính. Không phụ phí, không mập mờ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRICING_PLANS.slice(0, 3).map((plan) => (
            <div
              key={plan.id}
              className={`bg-white border rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:scale-[1.015] transition-all shadow-sm ${
                plan.id === 'price-2'
                  ? 'border-[#1E73FF] shadow-lg shadow-blue-500/5 relative'
                  : 'border-slate-200'
              }`}
            >
              {plan.id === 'price-2' && (
                <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#1E73FF] to-[#22C7F5] text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                  ĐƯỢC ƯU CHUỘNG NHẤT
                </span>
              )}

              <div>
                {plan.badge && (
                  <p className="text-xs font-mono text-[#1E73FF] mb-2 font-semibold">{plan.badge}</p>
                )}
                <h3 className="font-display font-bold text-xl text-slate-900 mb-3">{plan.name}</h3>
                
                <div className="flex items-baseline mb-6 border-b border-slate-100 pb-5">
                  <span className="text-2xl sm:text-3xl font-display font-black text-slate-950 tracking-tight">
                    {plan.price}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                      <CheckCircle2 size={13} className="text-[#1E73FF] mt-1 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleCtaClick('/nhan-bao-gia')}
                className={`w-full py-3 rounded-xl text-xs font-semibold text-center cursor-pointer transition-all ${
                  plan.id === 'price-2'
                    ? 'bg-gradient-to-r from-[#1E73FF] to-[#22C7F5] text-white shadow-xl shadow-blue-500/10'
                    : 'bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => handleCtaClick('/bang-gia')}
            className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-950 transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm"
          >
            Xem trọn bộ bảng giá 6 dịch vụ đang chạy
            <ArrowRight size={12} className="ml-1" />
          </button>
        </div>
      </section>

      {/* 5. VÌ SAO CHỌN WHALESOLUTIONS.VN */}
      <section className="bg-slate-50/60 py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="font-display font-extrabold text-3xl text-slate-900">Sự Khác Biệt Chuẩn Thực Chiến</h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              Chúng tôi hiểu doanh nghiệp nhỏ cần kết quả chân thực, không vẽ vời lý thuyết cồng kềnh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-[#1E73FF]">
                <Cpu size={20} />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">Mô hình Solo & Network</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Bạn trực tiếp thảo luận và nhận bản giao với những freelance đầu ngành chuyên môn thay vì giao tiếp qua trung gian quản trị dự án, đảm bảo sản phẩm bám sát và chính xác 100% mục tiêu ban đầu.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-[#1E73FF]">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">Tiết kiệm & Tối ưu</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                0% chi phí duy trì bộ máy cồng kềnh giúp dịch vụ của whale sea có giá vô cùng hời so với các công ty lớn mà chất lượng vẫn luôn thuộc tốp đầu ngành kỹ thuật thiết kế.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-[#1E73FF]">
                <Clock size={20} />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900">Đồng hành thực chiến</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Bàn giao đầy đủ tài khoản quản trị gốc và mã nguồn, đi kèm chế độ bảo hành miễn phí lỗi kỹ thuật 12 tháng. Luôn sọc trực xử lý các khẩn cấp trong vòng tối đa 2 giờ qua Zalo chat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. QUY TRÌNH LÀM VIỆC TỐI GIẢN */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="font-display font-extrabold text-3xl text-slate-900">Quy Trình 5 Bước Tinh Gọn</h2>
          <p className="text-slate-605 text-sm max-w-2xl mx-auto">
            Từ ý tưởng sơ khai đến một sản phẩm hoàn thiện giúp tăng tối đa cơ hội bán hàng.
          </p>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:bg-slate-200">
          {[
            { step: '01', title: 'Tiếp nhận yêu cầu', text: 'Khách hàng điền form hoặc gọi trực tiếp, whale sea thu nhận các mục tiêu cốt lõi và dữ liệu chuẩn bị.' },
            { step: '02', title: 'Tư vấn giải pháp & Báo giá', text: 'Solo Founder gọi điện phân tích, tư vấn chọn cấu trúc tối ưu chi phí và gửi báo giá chi tiết trong vòng 4 tiếng.' },
            { step: '03', title: 'Thiết kế & Nghiệm thu mốc', text: 'Triển khai dự án, nghiệm thu theo từng tuần/mốc cam kết để khách hàng theo dõi sát sườn hình thái sản phẩm.' },
            { step: '04', title: 'Tích hợp mã đo lường', statusCheck: true, text: 'Gắn tracking GA4, Clarity, Pixel giúp thu thập data hành vi chuẩn xác trước khi tung chiến dịch quảng cáo.' },
            { step: '05', title: 'Bàn giao, hướng dẫn & Hỗ trợ', text: 'Giao tài khoản gốc, hướng dẫn 1-1 qua Zoom/Meet cách đăng bài, chỉnh giá và khởi động gói bảo hành 12 tháng.' }
          ].map((item, index) => (
            <div key={index} className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between group">
              <div className="flex items-center gap-4 sm:w-1/2 sm:group-even:order-2 sm:group-even:pl-12 sm:group-odd:pr-12 sm:group-odd:text-right scroll-m-20">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border-2 border-[#1E73FF] text-slate-900 flex items-center justify-center font-display font-bold text-xs relative z-10 shadow-sm">
                  {item.step}
                </div>
                <div className="text-left sm:group-odd:text-right">
                  <h3 className="font-display font-bold text-slate-905 text-base md:text-lg flex items-center gap-1.5 sm:justify-end sm:group-even:justify-start">
                    {item.title}
                    {item.statusCheck && <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-mono font-medium border border-sky-100">Đặc Trưng</span>}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed mt-1">
                    {item.text}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block sm:w-1/2" />
            </div>
          ))}
        </div>
      </section>

      {/* 7. DỰ ÁN MẪU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <h2 className="font-display font-extrabold text-3xl text-slate-900">Sản Phẩm Đầu Ra Thực Tế</h2>
            <p className="text-slate-600 text-sm mt-1">
              Điểm qua một số sản phẩm tinh gọn whale sea đã thiết kế thực tế giúp cải thiện hiệu quả vận hành.
            </p>
          </div>
          <button
            onClick={() => handleCtaClick('/du-an')}
            className="text-[#1E73FF] hover:text-blue-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            Xem tất cả các dự án mẫu
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PORTFOLIO_PROJECTS.map((proj) => (
            <div
              key={proj.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden group flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
            >
              <div>
                <div className="relative aspect-video overflow-hidden">
                  <img
                    referrerPolicy="no-referrer"
                    src={proj.image}
                    alt={proj.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-900/90 text-[10px] text-white rounded font-semibold border border-slate-700/50">
                    {proj.category}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-display font-bold text-slate-800 text-sm group-hover:text-[#1E73FF] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.tags.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-medium rounded border border-slate-200/50">
                      #{t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleQuoteClick(proj.title)}
                  className="w-full py-2 bg-slate-50 border border-slate-200 hover:bg-[#1E73FF] hover:text-white hover:border-transparent rounded-xl text-[11px] text-slate-600 font-semibold text-center transition-all cursor-pointer"
                >
                  Tôi muốn làm tương tự
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. GIẢI PHÁP SẮP RA MẮT */}
      <section className="bg-slate-50/70 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12 animate-fade-in">
            <span className="px-2.5 py-1 text-[10px] font-mono text-[#1E73FF] bg-[#1E73FF]/10 rounded-full border border-[#1E73FF]/15">
              DỰ KIẾN RA MẮT GIAI ĐOẠN 2
            </span>
            <h2 className="font-display font-extrabold text-3xl text-slate-900">Smart Tools & Giải Pháp Chuyển Đổi Số</h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              Nhóm giải pháp này đang được whale sea phát triển theo từng giai đoạn. Khách hàng có thể đăng ký quan tâm để nhận thông báo hoặc ưu đãi khi giải pháp ra mắt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'CRM quản lý khách hàng tinh gọn', text: 'Giải pháp lưu trữ tập trung dữ liệu leads, tương tác qua Zalo/Phone ngay trên dashboard đơn giản của bạn.' },
              { title: 'Zalo Mini App & ZNS tự động', text: 'Dự án app chạy trực tiếp trong WeChat/Zalo, giải pháp gửi tin nhắn CSKH chăm sóc tối đa 24/7.' },
              { title: 'Check-in QR sự kiện & Báo cáo', text: 'Quản lý vé, check-in quét QR tại sự kiện, cập nhật số liệu khách ghé thăm theo mốc giây thực tế.' }
            ].map((sol, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-5 relative flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                <div>
                  <span className="absolute top-4 right-4 text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/75 px-2 py-0.5 rounded-full">
                    Sắp ra mắt
                  </span>
                  <h3 className="font-display font-semibold text-sm text-slate-800 mb-2 pr-16">{sol.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4">{sol.text}</p>
                </div>
                <button
                  onClick={() => handleInterestClick(sol.title)}
                  className="text-xs text-[#1E73FF] hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1 inline-flex self-start font-semibold"
                >
                  Đăng ký quan tâm giải pháp
                  <ArrowRight size={11} />
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => handleCtaClick('/giai-phap')}
              className="px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold shadow-sm"
            >
              Khám phá tất cả các Smart Tools tích hợp
            </button>
          </div>
        </div>
      </section>

      {/* 9. BLOG & KIẾN THỨC MỚI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <div>
            <h2 className="font-display font-extrabold text-3xl text-slate-900">Cẩm Nang & Xu Hướng Kỹ Thuật</h2>
            <p className="text-slate-600 text-sm mt-1">
              Chia sẻ kiến thức thực nghiệm hữu ích giúp bạn áp dụng ngay vào công việc kinh doanh của mình.
            </p>
          </div>
          <button
            onClick={() => handleCtaClick('/blog')}
            className="text-[#1E73FF] hover:text-blue-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            Đến trang tin tức
            <ArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => handleCtaClick('/blog')}
              className="bg-white border border-slate-200/90 rounded-xl overflow-hidden group cursor-pointer hover:border-slate-350 transition-all shadow-sm hover:shadow-md"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  referrerPolicy="no-referrer"
                  src={post.image}
                  alt={post.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold font-mono">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base group-hover:text-[#1E73FF] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-display font-extrabold text-3xl text-slate-900">Chủ Đề Thắc Mắc Thường Gặp</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Giải đáp trung thực, rõ ràng mọi thắc mắc trước khi bạn chính thức bắt đầu công việc cùng whale sea.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer border-none bg-white text-slate-800 font-semibold"
                >
                  <span className="font-display text-xs sm:text-sm">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180 text-[#1E73FF]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 11. FORM NHẬN BÁO GIÁ TRỰC TIẾP */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="px-3.5 py-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
            LIÊN HỆ KHỞI ĐỘNG
          </span>
          <h2 className="font-display font-extrabold text-3xl text-slate-900">Đặt Lịch Tư Vấn Với whale sea</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Dành 1 phút để phác họa nhanh dự án của bạn dưới đây. Chúng tôi sẽ phân tích các điểm cốt lõi và gửi lại tài liệu tư vấn miễn phí.
          </p>
        </div>

        <ContactForm pageSource="/" />
      </section>
    </div>
  );
}
