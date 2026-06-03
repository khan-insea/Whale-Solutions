import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Key, ShieldCheck, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface SettingItem {
  id: string;
  key: string;
  value: any;
}

interface EnvStatus {
  resend_configured: boolean;
  supabase_configured: boolean;
  analytics_configured: boolean;
  clarity_configured: boolean;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // form states mapped dynamically
  const [form, setForm] = useState({
    brand_name: 'Whale Sea',
    tagline: 'Premium Digital Agency & Freelance Studio',
    hotline: '0338808117',
    email_receiver: 'insightads.vn@gmail.com',
    zalo_link: 'https://zalo.me/0338808117',
    facebook_link: 'https://www.facebook.com/khan7th5.iam/',
    messenger_link: 'https://m.me/khan7th5.iam/',
    site_domain: 'https://www.khansea.io.vn/'
  });

  const token = sessionStorage.getItem('whale_admin_token') || '';

  const fetchSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.data || []);
        setEnvStatus(data.status || null);
        
        // Parse settings array into form State
        const mapped: any = { ...form };
        (data.data || []).forEach((item: SettingItem) => {
          if (item.key in mapped) {
            mapped[item.key] = item.value;
          }
        });
        setForm(mapped);
      } else {
        setError(data.error || 'Truy vấn cấu hình thất bại.');
      }
    } catch (e: any) {
      setError('Sự cố kết nối hệ thống: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSuccess('');
    setError('');

    // Format fields array
    const payload = Object.entries(form).map(([key, value]) => ({
      key,
      value
    }));

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess('Đã đồng bộ hóa thiết lập hệ thống web Whale Agency thành công!');
        setSettings(data.data || []);
      } else {
        setError(data.error || 'Lưu cấu hình thất bại.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-slate-900">Cấu Hình Website & Trạng Thái Hệ Thống</h2>
        <p className="text-xs text-slate-500 font-sans">Quản lý các trường thông tin hiển thị chung, liên kết liên hệ, và kiểm tra tình trạng kết nối backend.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: main branding & links configuration form */}
        <form onSubmit={handleSave} className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 text-xs font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">Thiết Lập Nhãn & Liên Kết</h3>
            <button
              type="button"
              onClick={fetchSettings}
              className="p-1 px-2 flex items-center gap-1.5 hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-[11px] font-bold"
            >
              <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
              Đồng bộ dữ liệu
            </button>
          </div>

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-850 font-bold rounded-lg my-2">
              ✓ {success}
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-250 text-rose-850 font-bold rounded-lg my-2">
              ✗ {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brand name */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Tên thương hiệu chính (Brand name)</label>
              <input
                type="text"
                value={form.brand_name}
                onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Tagline */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Slogan / Định vị thương hiệu (Tagline)</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Hotline phone */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Số hotline / Zalo kinh doanh</label>
              <input
                type="text"
                value={form.hotline}
                onChange={(e) => setForm({ ...form, hotline: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none font-bold text-slate-800"
              />
            </div>

            {/* Email receiver */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Hòm thư nhận biểu mẫu liên hệ (Email receiver)</label>
              <input
                type="email"
                value={form.email_receiver}
                onChange={(e) => setForm({ ...form, email_receiver: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none font-mono text-blue-700"
              />
            </div>

            {/* Zalo link */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Liên kết chat nhanh Zalo</label>
              <input
                type="url"
                value={form.zalo_link}
                onChange={(e) => setForm({ ...form, zalo_link: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none font-mono"
              />
            </div>

            {/* Facebook Fanpage link */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Đường dẫn Facebook fanpage cá nhân</label>
              <input
                type="url"
                value={form.facebook_link}
                onChange={(e) => setForm({ ...form, facebook_link: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none font-mono"
              />
            </div>

            {/* Messenger link */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Đường dẫn Messenger chat trực tiếp</label>
              <input
                type="url"
                value={form.messenger_link}
                onChange={(e) => setForm({ ...form, messenger_link: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none font-mono"
              />
            </div>

            {/* Main Domain */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Tên miền trang chính (Domain Vercel/Cloud)</label>
              <input
                type="url"
                value={form.site_domain}
                onChange={(e) => setForm({ ...form, site_domain: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none font-mono text-blue-805"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2.5 bg-blue-650 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save size={14} />
              {updating ? 'Đang lưu thiết lập...' : 'Lưu tất cả cấu hình Web'}
            </button>
          </div>
        </form>

        {/* Right column: System verification & Env status checklist */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 font-sans text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1">
              <ShieldCheck size={15} className="text-blue-600" />
              Kết Nối & An Toàn Môi Trường
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Trạng thái bảo mật biến môi trường (Environment Variables) hiện hữu.</p>
          </div>

          {envStatus ? (
            <div className="space-y-4.5">
              {/* Supabase status indicator */}
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="mt-0.5">
                  {envStatus.supabase_configured ? (
                    <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-500 fill-amber-50" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-[11px]">CSDL Supabase Postgres</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                    {envStatus.supabase_configured 
                      ? '✓ Đã phát hiện Supabase URL. Toàn bộ CMS được đồng bộ hóa và lưu trữ trực tiếp trên đám mây PostgreSQL của bạn.'
                      : '⚠ Đang chạy cục bộ (Fallback Local File JSON DB): Chế độ lưu trữ tệp tin tạm thời. Hãy khai báo NEXT_PUBLIC_SUPABASE_URL và SUPABASE_SERVICE_ROLE_KEY trên môi trường.'}
                  </p>
                </div>
              </div>

              {/* Resend Status indicator */}
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="mt-0.5">
                  {envStatus.resend_configured ? (
                    <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50" />
                  ) : (
                    <AlertTriangle size={16} className="text-amber-500 fill-amber-50" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-[11px]">Hạ Tầng Gửi Thư Resend Email</h4>
                  <p className="text-[10px] text-slate-505 mt-0.5 leading-relaxed">
                    {envStatus.resend_configured
                      ? '✓ Đã phát hiện RESEND_API_KEY. Biểu mẫu liên hệ báo giá sẽ tự động kích hoạt tiến trình gửi thư về email Solopreunur.'
                      : '⚠ RESEND_API_KEY rỗng. Form liên hệ sẽ ghi nhận dữ liệu bình thường, nhưng việc tự động chuyển tiếp email sẽ bị hoãn lại.'}
                  </p>
                </div>
              </div>

              {/* Analytics tracking indicators */}
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100">
                <div className="mt-0.5">
                  {envStatus.analytics_configured ? (
                    <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50" />
                  ) : (
                    <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-[11px]">Google Analytics (G-...)</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                    {envStatus.analytics_configured
                      ? '✓ Đã phát hiện VITE_GA_ID. Mã đo lường tracking người dùng bật tự động ở frontend.'
                      : '✓ Mã đo lường rỗng: Hệ thống chạy sạch, không chèn tracker theo dõi bên thứ ba.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-slate-405 text-xs">Đang truy vấn kiểm định biến...</div>
          )}

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-normal space-y-2">
            <span className="font-extrabold text-slate-700 block uppercase font-mono text-[9px] tracking-wider">Lưu Ý Quan Trọng Bảo Mật</span>
            <p>Hệ thống CMS tự động ẩn toàn bộ mã khóa, mật mã truy cập ra khỏi luồng render của trình duyệt để đảm bảo an toàn tuyệt đối và chống rò rỉ dữ liệu.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
