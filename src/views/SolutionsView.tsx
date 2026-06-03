import React, { useState, useEffect } from 'react';
import { Layers, Database, ShieldAlert, Heart, ArrowRight, BarChart3, QrCode, ClipboardList, Wallet, CalendarClock, MessageSquareShare, Wifi, Gamepad2 } from 'lucide-react';

interface SolutionsViewProps {
  navigate: (path: string) => void;
  setPreFilledForm: (data: { service: string; requestType: 'quote' | 'interest' | 'consult' }) => void;
}

export default function SolutionsView({ navigate, setPreFilledForm }: SolutionsViewProps) {
  const handleInterestClick = (solutionName: string) => {
    setPreFilledForm({
      service: solutionName,
      requestType: 'interest'
    });
    navigate('/nhan-bao-gia');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const initialSolutionsByString = [
    { name: 'CRM quản lý khách hàng', icon: 'Database', text: 'Giải pháp thu nhận và phân loại thông tin khách hàng từ Form, Hotline, Fanpage về một quản lý chung tập tử tế.' },
    { name: 'Quản lý lead quảng cáo', icon: 'Layers', text: 'Đồng bộ hóa lead tự động thời gian thực từ quảng cáo Facebook, Google Ads, TikTok về Google Sheets lọc số điện thoại trùng.' },
    { name: 'Dashboard marketing báo cáo', icon: 'BarChart3', text: 'Xem nhanh hiệu quả chi tiêu chiến dịch quảng cáo và tỷ lệ chuyển đổi trực quan cùng biểu đồ D3 dọn dẹp sạch.' },
    { name: 'Hệ thống check-in QR sự kiện', icon: 'QrCode', text: 'Quản lý bán vé hoặc kiểm tra ra vào hội thảo trực tiếp bằng điện thoại cá nhân siêu dễ của whale sea.' },
    { name: 'Khảo sát thu hồi đánh giá', icon: 'ClipboardList', text: 'Biểu mẫu thu nhận feedback khách hàng sau dịch vụ, tích hợp báo cáo tự động giúp chủ cửa hàng dễ kiểm soát.' },
    { name: 'Booking đặt lịch hẹn thông minh', icon: 'CalendarClock', text: 'Trang đặt lịch dịch vụ spa, salon, phong khám bám sát phòng trống thời gian thực, nhắc hẹn tự động qua tin nhắn.' },
    { name: 'Cổng Loyalty & Tích điểm thành viên', icon: 'Wallet', text: 'Mã thành viên quét QR tại quầy giúp khách hàng tích điểm, đổi voucher giảm giá trên điện thoại của họ.' },
    { name: 'Zalo Mini App & ZNS CSKH', icon: 'MessageSquareShare', text: 'Khởi chạy ứng dụng gọn gàng trên nền tảng Zalo, gửi tin nhắn chăm sóc khách hàng chủ động chi phí cực thấp.' },
    { name: 'Wifi Marketing tăng tương tác', icon: 'Wifi', text: 'Hệ thống đăng nhập Wifi miễn phí yêu cầu like fanpage hoặc xem video quảng cáo thích hợp cho cafe/nhà hàng.' },
    { name: 'Gamification Mini-game vòng quay', icon: 'Gamepad2', text: 'Vòng quay may mắn, lật hình trúng thưởng giúp giữ chân khách hàng trên landing page lâu gấp 2 lần.' }
  ];

  const [solutionsList, setSolutionsList] = useState(initialSolutionsByString);

  useEffect(() => {
    fetch('/api/public/solutions')
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          // Map backend schema to view elements
          const mapped = res.data.map((item: any) => ({
            name: item.title,
            icon: item.icon || 'Database',
            text: item.description
          }));
          setSolutionsList(mapped);
        }
      })
      .catch(err => console.error('Error fetching public solutions:', err));
  }, []);

  const iconRegistry: { [key: string]: React.ReactNode } = {
    'Database': <Database size={18} />,
    'Layers': <Layers size={18} />,
    'BarChart3': <BarChart3 size={18} />,
    'QrCode': <QrCode size={18} />,
    'ClipboardList': <ClipboardList size={18} />,
    'CalendarClock': <CalendarClock size={18} />,
    'Wallet': <Wallet size={18} />,
    'MessageSquareShare': <MessageSquareShare size={18} />,
    'Wifi': <Wifi size={18} />,
    'Gamepad2': <Gamepad2 size={18} />
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/50">
          ROADMAP PHÁT TRIỂN
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
          Giải Pháp Số & Smart Tools
        </h1>
        <p className="text-slate-605 text-sm max-w-2xl mx-auto leading-relaxed">
          Đang được whale sea nghiên cứu và đóng gói quy chuẩn ứng dụng theo từng giai đoạn. Thiết kế tối giản, hiệu quả sử dụng trực quan, thích hợp cao cho quy mô hộ kinh doanh và SME.
        </p>
      </div>

      {/* Info warning */}
      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-4 rounded-xl max-w-3xl mx-auto flex items-start gap-4 shadow-sm">
        <ShieldAlert size={18} className="mt-0.5 flex-shrink-0 text-amber-600" />
        <div>
          <span className="font-bold block mb-0.5 text-amber-950">⚠️ Ghi chú trạng thái dịch vụ:</span>
          Chương trình cung cấp Smart Tools và Giải pháp số thuộc giai đoạn 2 của whale sea. Hiện tại các giải pháp đang được kiểm tra ổn định nội bộ. Bạn có thể đăng ký quan tâm ngay dưới đây để được hệ thống gửi mail thông báo nhận ưu đãi trải nghiệm sớm nhất!
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {solutionsList.map((sol) => (
          <div
            key={sol.name}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#1E73FF]/30 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
          >
            <div>
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="p-2.5 bg-slate-50 text-[#1E73FF] rounded-xl border border-slate-100">
                  {iconRegistry[sol.icon] || <Database size={18} />}
                </div>
                <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100/50 px-2 py-0.5 rounded-full font-mono">
                  Sắp ra mắt
                </span>
              </div>

              <h3 className="font-display font-bold text-slate-800 text-sm group-hover:text-[#1E73FF] transition-colors">
                {sol.name}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mt-2.5">
                {sol.text}
              </p>
            </div>

            <button
              onClick={() => handleInterestClick(sol.name)}
              className="w-full py-2 bg-slate-50 hover:bg-amber-50 duration-200 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-800 rounded-xl text-[11px] font-bold text-center mt-6 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm p-0"
            >
              Tôi muốn đăng ký quan tâm
              <Heart size={10} fill="currentColor" className="text-rose-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
