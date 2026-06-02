import React from 'react';
import ContactForm from '../components/ContactForm';
import { Sparkles, MessageCircle, ArrowLeft } from 'lucide-react';

interface NhanBaoGiaViewProps {
  preFilledService: string;
  preFilledRequestType: 'quote' | 'interest' | 'consult';
  clearPreFilled: () => void;
}

export default function NhanBaoGiaView({
  preFilledService,
  preFilledRequestType,
  clearPreFilled
}: NhanBaoGiaViewProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#1E73FF]/10 text-[#1E73FF] border border-[#1E73FF]/15 animate-pulse">
          TIẾP NHẬN YÊU CẦU DỰ ÁN
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
          Yêu Cầu Báo Giá & Tư Vấn
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
          whale sea cam kết phản hồi chi tiết giải trình phương án kỹ thuật và báo phí đúc kết tinh gọn trong vòng tối đa 4 tiếng làm việc.
        </p>

        {preFilledService && (
          <div className="inline-flex items-center gap-2 bg-[#1E73FF]/5 border border-[#1E73FF]/15 rounded-lg py-1.5 px-3.5 text-xs text-[#1E73FF]">
            <span>Dịch vụ liên kết: <b>{preFilledService}</b></span>
            <span>&bull;</span>
            <button
              onClick={clearPreFilled}
              className="underline text-slate-500 hover:text-slate-700 cursor-pointer bg-transparent border-none p-0"
            >
              Reset lựa chọn
            </button>
          </div>
        )}
      </div>

      {/* Main Core Form */}
      <ContactForm
        defaultService={preFilledService || 'Website / Landing Page'}
        initialRequestType={preFilledRequestType || 'quote'}
        formSource="Trang nhận báo giá"
      />

      {/* Support details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto pt-6 border-t border-slate-200">
        <div className="space-y-4">
          <h4 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-1.5">💡 Sau khi gửi thông tin, điều gì xảy ra?</h4>
          <p className="text-slate-600 text-xs leading-relaxed">
            Hệ thống local sẽ lập tức ghi nhận dữ liệu của bạn, đồng thời chuyển tiếp trực tiếp một thông báo bảo mật tới hòm thư quản lý của Solo Founder. Chúng tôi sẽ gọi điện trao đổi chi tiết nhất.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-display font-semibold text-slate-800 text-sm flex items-center gap-1.5 font-sans">📞 Cần hỗ trợ xử lý khẩn cấp?</h4>
          <p className="text-slate-605 text-xs leading-relaxed">
            Nếu bạn đang chạy các sự kiện chiến dịch cấp tốc hoặc cần website gấp trong 24h, vui lòng gọi điện thoại trực tiếp tới đường dây nóng hotline: <b className="text-slate-900 font-bold">033.880.8117</b> để gặp đầu tàu kỹ thuật.
          </p>
        </div>
      </div>
    </div>
  );
}
