import React from 'react';
import { Mail, Phone, ExternalLink, MessageSquare, MapPin, Clock, ShieldCheck } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function ContactView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-16">
      {/* Page Title */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#1E73FF]/10 text-[#1E73FF] border border-[#1E73FF]/15">
          ĐƯỜNG DÂY LIÊN HỆ
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
          Liên Hệ whale sea
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
          Mọi thắc mắc kỹ thuật trước khi ký kết, yêu cầu can thiệp khẩn cấp hay phác thảo báo giá dự toán, vui lòng chọn phương thức liên hệ phù hợp nhất dưới đây.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left column: Contact Info (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
            <h3 className="font-display font-bold text-slate-900 text-base">Thông tin trực tiếp</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-slate-50 text-[#1E73FF] border border-slate-100 rounded-xl">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-semibold font-mono">Điện thoại hotline</p>
                  <a href="tel:0338808117" className="text-sm font-bold text-slate-800 hover:text-[#1E73FF] transition-colors mt-0.5 block">
                    033.880.8117
                  </a>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-slate-50 text-[#1E73FF] border border-slate-100 rounded-xl">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-semibold font-mono">Mailing box quản lý</p>
                  <a href="mailto:insightads.vn@gmail.com" className="text-sm font-bold text-slate-800 hover:text-[#1E73FF] transition-colors mt-0.5 block break-all font-mono">
                    insightads.vn@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-slate-50 text-[#1E73FF] border border-slate-100 rounded-xl">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-semibold font-mono">Hình thức vận hành</p>
                  <span className="text-xs text-slate-600 block leading-relaxed mt-0.5">
                    Trực tuyến (Online) / Mạng lưới đàm thoại từ xa linh động toàn quốc Việt Nam.
                  </span>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 bg-slate-50 text-[#1E73FF] border border-slate-100 rounded-xl">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-semibold font-mono">Thời gian hoạt động</p>
                  <span className="text-xs text-slate-600 block leading-relaxed mt-0.5">
                    Thứ 2 - Thứ 7: 08:30 - 18:30 <br />
                    Chủ nhật: Nhận tin nhắn chờ trực tuyến
                  </span>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <a
                href="https://zalo.me/0338808117"
                target="_blank"
                referrerPolicy="no-referrer"
                className="w-full py-2.5 rounded-xl text-center text-xs font-semibold text-white bg-[#1E73FF] hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                Trò chuyện qua Zalo
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-250/50 text-emerald-800 text-xs p-5 rounded-2xl flex items-start gap-4 shadow-sm">
            <ShieldCheck size={20} className="flex-shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5 text-emerald-950">Cam kết bảo mật thông tin:</span>
              Mọi dữ liệu cá nhân, số điện thoại, và tài liệu phác thảo dự án của khách hàng đều được mã hóa lưu trữ an toàn, cam đoan không chia sẻ cho bên thứ ba ngoài mục đích thiết lập báo giá.
            </div>
          </div>
        </div>

        {/* Right column: Form (8 cols) */}
        <div className="lg:col-span-8 font-sans">
          <ContactForm defaultService="Liên hệ tư vấn" formSource="Trang liên hệ" />
        </div>
      </div>
    </div>
  );
}
