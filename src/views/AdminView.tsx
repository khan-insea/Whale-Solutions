import React, { useState, useEffect } from 'react';
import { Database, ShieldAlert, LogOut, Users, FileText, Layers, Settings2, DollarSign, Briefcase, Lightbulb, GraduationCap, Cog } from 'lucide-react';

// Modular CMS Panel imports
import AdminLeads from '../components/admin/AdminLeads';
import AdminPosts from '../components/admin/AdminPosts';
import AdminProducts from '../components/admin/AdminProducts';
import AdminServices from '../components/admin/AdminServices';
import AdminPricing from '../components/admin/AdminPricing';
import AdminProjects from '../components/admin/AdminProjects';
import AdminSolutions from '../components/admin/AdminSolutions';
import AdminCourses from '../components/admin/AdminCourses';
import AdminSettings from '../components/admin/AdminSettings';

type CMSTab = 'leads' | 'posts' | 'products' | 'services' | 'pricing' | 'projects' | 'solutions' | 'courses' | 'settings';

export default function AdminView() {
  const [activeTab, setActiveTab] = useState<CMSTab>('leads');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoadingShield, setIsLoadingShield] = useState(false);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('whale_admin_token');
    if (savedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPasswordInput.trim()) {
      setAuthError('Vui lòng nhập mật khẩu quản trị.');
      return;
    }
    setAuthError('');
    setIsLoadingShield(true);

    try {
      // Validate with a ping to leads endpoint
      const response = await fetch('/api/admin/leads', {
        headers: {
          'Authorization': `Bearer ${adminPasswordInput.trim()}`
        }
      });
      if (response.ok) {
        sessionStorage.setItem('whale_admin_token', adminPasswordInput.trim());
        setIsAuthenticated(true);
      } else {
        setAuthError('Mật khẩu quản trị không khớp hoặc rỗng.');
      }
    } catch (err) {
      setAuthError('Lỗi kiểm định mật khẩu: Hãy chắc chắn bạn đã cấu hình biến ADMIN_PASSWORD.');
    } finally {
      setIsLoadingShield(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('whale_admin_token');
    setIsAuthenticated(false);
    setAdminPasswordInput('');
    setAuthError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto pt-44 pb-32 px-4 font-sans">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl space-y-6" id="admin-login-shield">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-rose-50 border border-rose-200 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldAlert size={24} />
            </div>
            <h2 className="font-display font-extrabold text-xl text-slate-900">Xác Thực Quyền Admin</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Hệ thống yêu cầu mật mã quản trị viên cấp cao để truy cập CMS quản lý toàn diện.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="admin-pass">
                Mật khẩu Quản trị viên
              </label>
              <input
                type="password"
                id="admin-pass"
                required
                placeholder="Nhập mật khẩu..."
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                className="w-full bg-white border border-slate-250 focus:border-[#1E73FF] rounded-xl px-4 py-2.5 text-xs text-slate-950 placeholder-slate-400 focus:outline-none transition-colors shadow-inner"
              />
            </div>

            {authError && (
              <p className="text-[11px] font-semibold text-rose-600" id="admin-auth-error-hint">
                * {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoadingShield}
              className="w-full bg-[#1E73FF] hover:bg-blue-600 transition-colors text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
            >
              {isLoadingShield ? '🔑 Đang kiểm định...' : '🚀 Mở khóa hệ thống'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard sidebar links definition
  const sidebarItems = [
    { id: 'leads', label: 'Khách hàng (Leads)', icon: Users },
    { id: 'posts', label: 'Blog & Bài viết', icon: FileText },
    { id: 'products', label: 'Gói phần mềm', icon: Layers },
    { id: 'services', label: 'Nhóm Dịch vụ lớn', icon: Settings2 },
    { id: 'pricing', label: 'Gói Bảng giá', icon: DollarSign },
    { id: 'projects', label: 'Dự án Portfolio', icon: Briefcase },
    { id: 'solutions', label: 'Giải pháp Số', icon: Lightbulb },
    { id: 'courses', label: 'Khóa Đào tạo', icon: GraduationCap },
    { id: 'settings', label: 'Cài đặt Website', icon: Cog },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 font-sans">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5 mb-6">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-[#1E73FF] bg-[#1E73FF]/10 border border-[#1E73FF]/15 px-2 py-0.5 rounded">
            WHALE AGENCY CMS SECURITY INTERACTION
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1.5 flex items-center gap-2">
            <Database className="text-[#1E73FF]" size={24} />
            Hệ Thống Quản Trị Mini CMS
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Chủ động cập nhật toàn bộ bài đăng blog, dịch vụ công ty, dự án portfolio, bảng giá và dữ liệu khách hàng.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-900 hover:text-white border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
          title="Đăng xuất khỏi tài khoản admin"
        >
          <LogOut size={14} />
          Đăng xuất
        </button>
      </div>

      {/* Main CMS Layout containing left navigation sidebar and right workspace panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Responsive Mobile / Tablet navigation bar */}
        <div className="lg:col-span-3 lg:hidden flex overflow-x-auto gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 scrollbar-none mb-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as CMSTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon size={13} />
                {item.label.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Large screen left Sidebar */}
        <div className="hidden lg:block lg:col-span-3 space-y-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 h-fit">
          <span className="text-[9px] uppercase font-bold text-slate-400 block px-3 mb-2 font-mono tracking-wider">HẠNG MỤC CMS</span>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as CMSTab)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[12px] font-bold transition-all text-left cursor-pointer ${
                  active 
                    ? 'bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/10' 
                    : 'text-slate-650 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon size={15} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab rendering window panel */}
        <div className="lg:col-span-9 bg-slate-50/50 border border-slate-200 p-6 rounded-2xl shadow-sm min-h-[500px]">
          {activeTab === 'leads' && <AdminLeads />}
          {activeTab === 'posts' && <AdminPosts />}
          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'services' && <AdminServices />}
          {activeTab === 'pricing' && <AdminPricing />}
          {activeTab === 'projects' && <AdminProjects />}
          {activeTab === 'solutions' && <AdminSolutions />}
          {activeTab === 'courses' && <AdminCourses />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>

      </div>
    </div>
  );
}
