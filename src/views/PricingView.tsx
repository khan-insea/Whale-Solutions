import React, { useState, useEffect } from 'react';
import { Check, Heart, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { PRICING_PLANS, SERVICE_GROUPS } from '../data';

interface PricingViewProps {
  navigate: (path: string) => void;
  setPreFilledForm: (data: { service: string; requestType: 'quote' | 'interest' | 'consult' }) => void;
}

export default function PricingView({ navigate, setPreFilledForm }: PricingViewProps) {
  const [pricingPlans, setPricingPlans] = useState(PRICING_PLANS);
  const [serviceGroups, setServiceGroups] = useState(SERVICE_GROUPS);

  // Fetch updated records from backend API
  useEffect(() => {
    fetch('/api/public/pricing')
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setPricingPlans(res.data);
        }
      })
      .catch(err => console.error('Error fetching public pricing plans:', err));

    fetch('/api/public/services')
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setServiceGroups(res.data);
        }
      })
      .catch(err => console.error('Error fetching public services in PricingView:', err));
  }, []);

  const handleQuoteClick = (packageName: string) => {
    setPreFilledForm({
      service: packageName,
      requestType: 'quote'
    });
    navigate('/nhan-bao-gia');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleInterestClick = (groupName: string) => {
    setPreFilledForm({
      service: groupName,
      requestType: 'interest'
    });
    navigate('/nhan-bao-gia');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Extract coming soon groups for Part 2
  const comingSoonGroups = serviceGroups.filter((g) => g.status === 'coming_soon').slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-20">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#1E73FF]/10 text-[#1E73FF] border border-[#1E73FF]/15">
          BIỂU PHÍ ĐẦU TƯ
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
          Gói Dịch Vụ & Bảng Giá Tham Khảo
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
          Chúng tôi đóng gói dịch vụ thành các biểu phí cụ thể, giúp doanh nghiệp nhỏ dễ dàng ước tính chi phí. Cam kết không phát sinh phụ phí không mong muốn.
        </p>
      </div>

      {/* Part 1: Available packages */}
      <div className="space-y-10">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="font-display font-extrabold text-2xl text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            Phần 1: Các Gói Dịch Vụ Sẵn Sàng Triển Khai
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Dịch vụ cam kết chất lượng, bảo trì 12 tháng, bàn giao tài khoản quản lý gốc sau khi hoàn thành.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => {
            const isHighlight = plan.id === 'price-2' || plan.id === 'price-6';
            return (
              <div
                key={plan.id}
                className={`bg-white border rounded-2xl p-6 flex flex-col justify-between hover:border-[#1E73FF]/45 transition-all shadow-sm ${
                  isHighlight ? 'border-[#1E73FF] ring-1 ring-[#1E73FF]/10 shadow-md shadow-blue-500/5' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-1 pb-4">
                    <h3 className="font-display font-bold text-lg text-slate-900">{plan.name}</h3>
                    {plan.badge && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold text-sky-700 bg-sky-50 border border-sky-100 max-w-max">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="my-5 flex items-baseline">
                    <span className="text-2xl sm:text-3xl font-display font-black text-[#1E73FF] tracking-tight">
                      {plan.price}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8 border-t border-slate-100/50 pt-4">
                    {(plan.features || []).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed font-sans">
                        <Check size={13} className="text-[#1E73FF] mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleQuoteClick(plan.name)}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold text-center cursor-pointer transition-all border-0 ${
                    isHighlight
                      ? 'bg-gradient-to-r from-[#1E73FF] to-[#22C7F5] text-white shadow-lg shadow-blue-500/10'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 border border-slate-200'
                  }`}
                >
                  {plan.ctaText}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 2: Coming Soon services */}
      <div className="space-y-8 bg-slate-50 border border-slate-201 rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="border-b border-slate-200 pb-4">
          <h2 className="font-display font-extrabold text-2xl text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            Phần 2: Các Nhóm Dịch Vụ Chuẩn Bị Ra Mắt
          </h2>
          <p className="text-[#1E73FF] text-xs font-semibold leading-relaxed mt-1">
            Các dịch vụ này đang trong giai đoạn chuẩn bị. Bạn có thể đăng ký quan tâm để whale sea thông báo và dành tặng ưu đãi 20% khi mở nhận báo giá chi tiết.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {comingSoonGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-display font-bold text-sm text-slate-800">{group.title}</h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-sans">
                    Sắp ra mắt
                  </span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed mb-5">
                  {group.note || 'Chúng tôi đang đàm phán ký kết chuỗi cộng tác và thiết kế quy trình bàn giao đạt chuẩn chất lượng cao nhất.'}
                </p>
              </div>

              <button
                onClick={() => handleInterestClick(group.title)}
                className="w-full py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-650 hover:text-slate-900 transition-all cursor-pointer flex items-center justify-center gap-1 p-0"
              >
                Đăng ký quan tâm dịch vụ sắp ra mắt
                <ArrowRight size={12} className="ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
