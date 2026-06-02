import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactFormProps {
  initialService?: string;
  defaultService?: string;
  initialRequestType?: 'quote' | 'interest' | 'consult';
  pageSource?: string;
  formSource?: string;
}

export default function ContactForm({
  initialService,
  defaultService,
  initialRequestType = 'quote',
  pageSource,
  formSource
}: ContactFormProps) {
  const resolvedService = defaultService || initialService || 'Website / Landing Page';
  const resolvedPageSource = formSource || pageSource || '/';

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [requestType, setRequestType] = useState<'quote' | 'interest' | 'consult'>(initialRequestType);
  const [serviceOfInterest, setServiceOfInterest] = useState(resolvedService);
  const [budget, setBudget] = useState('Từ 2.000.000đ - 5.000.000đ');
  const [timeline, setTimeline] = useState('Trong tháng này');
  const [message, setMessage] = useState('');

  // UI Flow State
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [backendFeedback, setBackendFeedback] = useState('');

  // Sync initial selections if they change
  useEffect(() => {
    const freshService = defaultService || initialService;
    if (freshService) setServiceOfInterest(freshService);
  }, [initialService, defaultService]);

  useEffect(() => {
    if (initialRequestType) setRequestType(initialRequestType);
  }, [initialRequestType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setBackendFeedback('');

    // Validation
    if (!fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên.');
      setLoading(false);
      return;
    }

    if (!phone.trim()) {
      setErrorMsg('Vui lòng nhập Số điện thoại.');
      setLoading(false);
      return;
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setErrorMsg('Định dạng email không hợp lý.');
        setLoading(false);
        return;
      }
    }

    try {
      const payload = {
        name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        service: serviceOfInterest,
        message: message.trim(),
        page: window.location.href,
        submittedAt: new Date().toISOString(),
        // Extra metadata for existing database/server compatibility
        fullName: fullName.trim(),
        businessName: businessName.trim(),
        requestType,
        serviceOfInterest,
        budget,
        timeline,
        pageSource: resolvedPageSource
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSuccess(true);
        // Save the detailed warning or success feedback from server (e.g. if Resend key is missing but saved locally)
        setBackendFeedback(result.emailFeedback || '');
        // Reset form of inputs
        setFullName('');
        setPhone('');
        setEmail('');
        setBusinessName('');
        setMessage('');
      } else {
        setErrorMsg(result.error || 'Không thể gửi thông tin. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setErrorMsg('Không thể gửi thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const serviceOptions = [
    'Website / Landing Page',
    'Marketing / Quảng cáo Online',
    'Content / Thiết kế cơ bản',
    'AI / Automation đơn giản',
    'Tracking / Đo lường',
    'Giải pháp số & App/Tool',
    'Đào tạo / Khóa học ngắn hạn',
    'In ấn / Quà tặng',
    'Sự kiện / Tiệc ngọt',
    'Tư vấn tổng thể',
    'Chưa rõ, cần tư vấn'
  ];

  const requestTypeOptions = [
    { value: 'quote', label: 'Nhận báo giá dịch vụ đang triển khai' },
    { value: 'interest', label: 'Đăng ký quan tâm dịch vụ sắp ra mắt' },
    { value: 'consult', label: 'Cần tư vấn chưa rõ dịch vụ' }
  ];

  const budgetOptions = [
    'Dưới 2.000.000đ',
    'Từ 2.000.000đ - 5.000.000đ',
    'Từ 5.000.000đ - 10.000.000đ',
    'Trên 10.000.000đ',
    'Chưa xác định ngân sách'
  ];

  const timelineOptions = [
    'Muốn thực hiện ngay lập tức',
    'Trong tháng này',
    'Trong 1-3 tháng tới',
    'Chưa chốt thời gian chi tiết'
  ];

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-slate-205 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-xl"
        id="contact-form-success"
      >
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">Gửi yêu cầu thành công!</h3>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          Cảm ơn bạn đã quan tâm. whale sea đã ghi nhận chính xác dữ liệu của bạn vào hàng chờ liên hệ. Solo Founder của chúng tôi sẽ phản hồi trực tiếp tư vấn chi tiết cho bạn qua số điện thoại <b>{phone}</b> hoặc email trong vòng tối đa 4 giờ làm việc.
        </p>

        {backendFeedback && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-left text-xs text-slate-600">
            <span className="font-semibold text-slate-800 block mb-1">🔍 Trạng thái hệ thống:</span>
            {backendFeedback}
          </div>
        )}

        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1E73FF] hover:bg-blue-600 transition-all cursor-pointer"
        >
          Gửi yêu cầu khác
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/85 rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto shadow-xl shadow-slate-100/40" id="contact-form-block">
      <div className="mb-6 flex items-start gap-3">
        <div className="p-2 bg-[#1E73FF]/10 rounded-lg text-[#1E73FF] mt-1">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-display font-semibold text-slate-900 text-lg sm:text-xl">
            Nhận Báo Giá & Đăng Ký Quan Tâm
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
            Mẫu điền thông tin chung cho dịch vụ hiện hữu và ghi nhận mối quan tâm của khách hàng đối với các giải pháp chuẩn bị ra mắt.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Họ và tên */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="form-fullName">
              Họ và tên *
            </label>
            <input
              type="text"
              id="form-fullName"
              required
              placeholder="Ví dụ: Nguyễn Văn A"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#1E73FF] rounded-xl px-4 py-2.5 text-xs text-slate-950 placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="form-phone">
              Số điện thoại *
            </label>
            <input
              type="tel"
              id="form-phone"
              required
              placeholder="Ví dụ: 0338808117"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#1E73FF] rounded-xl px-4 py-2.5 text-xs text-slate-950 placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="form-email">
              Địa chỉ Email
            </label>
            <input
              type="email"
              id="form-email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#1E73FF] rounded-xl px-4 py-2.5 text-xs text-slate-950 placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="form-business">
              Tên cửa hàng / doanh nghiệp
            </label>
            <input
              type="text"
              id="form-business"
              placeholder="Nếu là cá nhân, vui lòng ghi 'Cá nhân'"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#1E73FF] rounded-xl px-4 py-2.5 text-xs text-slate-950 placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Loại yêu cầu */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Mục đích gửi thông tin *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {requestTypeOptions.map((opt) => {
              const isSelected = requestType === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setRequestType(opt.value as any)}
                  className={`px-3 py-2 border rounded-xl text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-[#1E73FF] text-[#1E73FF] font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#1E73FF]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Warning Alert based on selection */}
        {requestType === 'interest' && (
          <div className="bg-amber-50 border border-amber-200 text-xs text-amber-700 p-3 rounded-xl flex items-start gap-2 animate-fade-in">
            <AlertCircle size={15} className="mt-0.5 flex-shrink-0 text-amber-600" />
            <span>
              <b>Ghi chú sắp ra mắt:</b> Dịch vụ này đang được whale sea phát triển và sẽ mở nhận trong thời gian tới. Chúng tôi sẽ tự động gắn thẻ ưu tiên và liên hệ thông báo ngay cho bạn khi dịch vụ chính thức khởi chạy.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Dịch vụ quan tâm */}
          <div className="sm:col-span-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="form-serviceSelect">
              Dịch vụ chọn mua / quan tâm
            </label>
            <select
              id="form-serviceSelect"
              value={serviceOfInterest}
              onChange={(e) => setServiceOfInterest(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#1E73FF] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none transition-colors"
            >
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Ngân sách dự kiến */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="form-budget">
              Ngân sách dự kiến *
            </label>
            <select
              id="form-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#1E73FF] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none transition-colors"
            >
              {budgetOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Thời gian mong muốn */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="form-timeline">
              Thời gian triển khai *
            </label>
            <select
              id="form-timeline"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#1E73FF] rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none transition-colors"
            >
              {timelineOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Nội dung cần tư vấn */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="form-msg">
            Mô tả chi tiết yêu cầu của bạn
          </label>
          <textarea
            id="form-msg"
            rows={4}
            placeholder="Hãy chia sẻ thêm về mô hình kinh doanh, mục tiêu và yêu cầu chi tiết (nếu có) để chúng tôi chuẩn bị giải pháp tối ưu nhất trước khi gọi tư vấn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-[#1E73FF] rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors resize-y"
          />
        </div>

        {/* Error warning display */}
        {errorMsg && (
          <div className="bg-rose-50/10 border border-rose-500/20 text-rose-650 text-xs p-3.5 rounded-xl flex items-start gap-2.5">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1E73FF] hover:bg-blue-600 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Đang xử lý biểu mẫu...
            </>
          ) : (
            <>
              <Send size={15} />
              {requestType === 'interest' ? 'Đăng ký quan tâm ngay' : 'Nhận tư vấn & Báo giá miễn phí'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
