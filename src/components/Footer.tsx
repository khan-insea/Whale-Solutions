import React from 'react';
import { Mail, Phone, ExternalLink, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export default function Footer({ navigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const menuLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Giới thiệu', path: '/gioi-thieu' },
    { name: 'Dịch vụ', path: '/dich-vu' },
    { name: 'Bảng giá', path: '/bang-gia' },
    { name: 'Dự án', path: '/du-an' },
    { name: 'Giải pháp số', path: '/giai-phap' },
    { name: 'Đào tạo', path: '/dao-tao' },
    { name: 'Kiến thức / Blog', path: '/blog' },
    { name: 'Liên hệ', path: '/lien-he' }
  ];

  return (
    <footer className="bg-[#0B132B] border-t border-slate-800 pt-16 pb-8 text-slate-350">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Intro */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 flex items-center justify-center bg-white rounded-lg p-1 shadow-sm">
                <svg viewBox="0 0 100 100" className="w-7 h-7">
                  <defs>
                    <linearGradient id="whaleSeaFooterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00E5FF" />
                      <stop offset="60%" stopColor="#0077FF" />
                      <stop offset="100%" stopColor="#0A2F8F" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M15,55 C25,58 38,55 45,45 C50,38 42,28 32,32 C22,35 12,48 15,55 Z"
                    fill="url(#whaleSeaFooterGrad)"
                  />
                  <path
                    d="M48,45 C55,30 70,25 82,28 C88,30 82,45 70,52 C58,58 46,55 48,45 Z"
                    fill="url(#whaleSeaFooterGrad)"
                    opacity="0.9"
                  />
                  <path
                    d="M25,58 C40,55 50,42 52,35 C58,45 70,55 85,50 C70,68 45,68 25,58 Z"
                    fill="url(#whaleSeaFooterGrad)"
                    opacity="0.95"
                  />
                </svg>
              </div>
              <span className="font-sans font-extrabold text-lg text-white tracking-tight flex items-center">
                whale <span className="text-[#22C7F5] ml-1">sea</span><span className="text-[9px] font-normal text-slate-400 self-start ml-0.5">™</span>
              </span>
            </div>
            
            <p className="text-[#22C7F5] text-sm font-semibold leading-relaxed">
              “Website, Marketing & AI tinh gọn cho doanh nghiệp nhỏ.”
            </p>
            <p className="text-slate-400 text-xs leading-relaxed">
              whale sea là freelance studio đồng hành cùng hộ kinh doanh, startup, và SME tối ưu quy trình tìm kiếm khách hàng bằng công nghệ, tự động hóa và nội dung chất lượng cao.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse" />
                Đang nhận yêu cầu dịch vụ
              </span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Danh mục trang
            </h3>
            <ul className="space-y-2.5">
              {menuLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => {
                      navigate(link.path);
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    className="text-slate-400 hover:text-[#22C7F5] text-sm flex items-center group transition-colors cursor-pointer bg-transparent border-none p-0"
                  >
                    <ChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#22C7F5] mr-1" />
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
              Liên hệ trực tiếp
            </h3>
            <p className="text-slate-400 text-xs text-left">
              Mọi thắc mắc kỹ thuật hoặc nhu cầu xây dựng khẩn cấp, vui lòng gọi điện thoại hoặc trò chuyện trực tiếp qua Zalo của Solo Founder:
            </p>
            <div className="space-y-3">
              <a
                href="tel:0338808117"
                className="flex items-center text-sm text-slate-300 hover:text-[#22C7F5] transition-colors"
              >
                <Phone size={16} className="text-[#22C7F5] mr-2.5 flex-shrink-0" />
                <span>Hotline: 033.880.8117</span>
              </a>
              <a
                href="mailto:insightads.vn@gmail.com"
                className="flex items-center text-sm text-slate-300 hover:text-[#22C7F5] transition-colors"
              >
                <Mail size={16} className="text-[#22C7F5] mr-2.5 flex-shrink-0" />
                <span className="break-all font-mono text-xs">insightads.vn@gmail.com</span>
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://zalo.me/0338808117"
                target="_blank"
                referrerPolicy="no-referrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-[#22C7F5]/10 hover:bg-[#22C7F5]/20 text-[#22C7F5] transition-colors max-w-max"
              >
                Liên hệ Zalo tư vấn
                <ExternalLink size={12} className="ml-1" />
              </a>
            </div>
          </div>

          {/* Column 4: Lộ trình phát triển */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider">
              Lộ trình dịch vụ
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              “Giải pháp Marketing – Công nghệ – Truyền thông – Sự kiện đang được phát triển theo từng giai đoạn.”
            </p>
            <div className="space-y-2 border-l border-slate-700 pl-3 pt-1">
              <div className="text-xs">
                <span className="text-[#22C7F5] font-semibold">Giai đoạn 1 (Sẵn sàng):</span>
                <span className="text-slate-400"> Web, Landing Page, Ads, Content, Setup Tracking kỹ thuật.</span>
              </div>
              <div className="text-xs">
                <span className="text-slate-500 font-semibold">Giai đoạn 2 (Sắp tới):</span>
                <span className="text-slate-500"> CRM, App doanh nghiệp nhỏ, Trợ lý Chatbot AI, In ấn thi công, Teabreak & Khai trương.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} whale sea Freelance Studio. All rights reserved.
          </p>
          <div className="flex space-x-4 text-xs text-slate-500">
            <span>Mã bảo vệ SSL</span>
            <span>&bull;</span>
            <span>Bảo mật dữ liệu khách hàng</span>
            <span>&bull;</span>
            <button onClick={() => navigate('/admin')} className="hover:text-white transition-colors underline bg-transparent border-0 cursor-pointer p-0 text-xs text-slate-500">
              Quản trị đơn hàng
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
