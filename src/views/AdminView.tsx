import React, { useState, useEffect } from 'react';
import { Database, Search, RefreshCw, Trash2, ArrowUpRight, Sparkles, Filter, ShieldAlert } from 'lucide-react';
import { SubmissionRequest } from '../types';

export default function AdminView() {
  const [submissions, setSubmissions] = useState<SubmissionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [messageFeedback, setMessageFeedback] = useState('');

  const loadSubmissions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/submissions');
      const data = await response.json();
      if (response.ok && data.success) {
        setSubmissions(data.submissions || []);
      } else {
        setError(data.error || 'Cannot fetch submissions');
      }
    } catch (err: any) {
      setError('Cannot connect to backend server: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleClear = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh mục thông tin khách hàng trên hệ thống máy chủ chứ? Hành động này không thể hoàn tác!')) {
      return;
    }

    try {
      const response = await fetch('/api/submissions/clear', { method: 'POST' });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessageFeedback('Đã dọn dẹp danh mục thành công.');
        setSubmissions([]);
      } else {
        setError('Xóa danh sách thất bại.');
      }
    } catch (err: any) {
      setError('Lỗi máy chủ khi xóa.');
    }
  };

  // Filter and search computation
  const filteredList = submissions.filter((item) => {
    // Search filter names, phone, email, messages
    const matchSearch =
      item.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.includes(search) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.message?.toLowerCase().includes(search.toLowerCase()) ||
      item.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      item.serviceOfInterest?.toLowerCase().includes(search.toLowerCase());

    // Type filter
    if (filterType === 'all') return matchSearch;
    return item.requestType === filterType && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-205 pb-5">
        <div>
          <span className="text-[10px] uppercase font-mono font-bold text-[#1E73FF] bg-[#1E73FF]/10 border border-[#1E73FF]/15 px-2 py-0.5 rounded">
            MANAGER SECURITY ONLY
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mt-1.5 flex items-center gap-2">
            <Database className="text-[#1E73FF]" size={24} />
            Quản Trị Yêu Cầu Đơn Đặt Hàng
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Bảng điều khiển kiểm tra, xác thực biểu mẫu được chuyển lưu trữ cục bộ trực tiếp trên Cloud Run Container.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSubmissions}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline font-bold">Làm mới</span>
          </button>
          
          <button
            disabled={submissions.length === 0}
            onClick={handleClear}
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-30 cursor-pointer"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline font-bold">Xóa lịch sử</span>
          </button>
        </div>
      </div>

      {messageFeedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl font-medium shadow-sm">
          {messageFeedback}
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-xl flex items-center gap-2 font-medium shadow-sm">
          <ShieldAlert size={15} className="text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Control center: Search and Filtering */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="md:col-span-6 relative">
          <Search size={14} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm kiếm theo Tên, Số điện thoại, Email, dịch vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#1E73FF] shadow-inner"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#1E73FF] shadow-inner"
          >
            <option value="all">Tất cả mục đích gửi form</option>
            <option value="quote">Nhận báo giá hiện hữu</option>
            <option value="interest">Đăng ký quan tâm sắp ra mắt</option>
            <option value="consult">Cần tư vấn / chưa rõ</option>
          </select>
        </div>

        <div className="md:col-span-3 flex items-center justify-end text-xs text-slate-500 pr-2 font-medium">
          Hiển thị: <b className="text-slate-800 mx-1">{filteredList.length}</b> / {submissions.length} yêu cầu
        </div>
      </div>

      {/* Grid Submissions lists */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 text-xs font-semibold">
          <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-[#1E73FF]" />
          Đang truy vấn lịch sử đơn hàng từ bộ nhớ máy chủ...
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white border border-slate-200 p-16 text-center text-slate-500 text-xs rounded-xl shadow-sm font-semibold">
          Chưa ghi nhận biểu mẫu nào khớp với dữ liệu lọc tìm kiếm khách hàng.
        </div>
      ) : (
        <div className="space-y-4 font-sans">
          {filteredList.map((sub) => (
            <div
              key={sub.id}
              className={`bg-white border rounded-2xl p-6 hover:border-slate-350 transition-all shadow-sm ${
                sub.requestType === 'interest' ? 'border-amber-200 ring-1 ring-amber-100 bg-amber-50/5' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">{sub.fullName}</h3>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded font-semibold">
                      {sub.businessName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Host: {sub.pageSource}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    SĐT: <a href={`tel:${sub.phone}`} className="text-[#1E73FF] hover:underline font-bold">{sub.phone}</a> &bull; Email: <a href={`mailto:${sub.email}`} className="text-slate-600 hover:underline break-all font-mono font-bold">{sub.email}</a>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 text-right">
                  {sub.requestType === 'interest' ? (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/50">
                      QUAN TÂM SẢN PHẨM SẮP RA MẮT
                    </span>
                  ) : sub.requestType === 'quote' ? (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-250/50">
                      BÁO GIÁ DỊCH VỤ HIỆN HỮU
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      YÊU CẦU TƯ VẤN KHÁC
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-semibold font-mono">
                    {new Date(sub.submittedAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>

              {/* Purchase specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs border-b border-slate-50 pb-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono font-semibold">Dịch vụ quan tâm</span>
                  <span className="text-slate-800 font-bold">{sub.serviceOfInterest}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono font-semibold">Ngân sách dự tính</span>
                  <span className="text-slate-800 font-bold">{sub.budget}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono font-semibold">Thời hạn mong muốn</span>
                  <span className="text-slate-800 font-bold">{sub.timeline}</span>
                </div>
              </div>

              {/* Message */}
              <div className="mt-4 bg-slate-50 border border-slate-100 p-3 h-auto max-h-36 overflow-y-auto text-xs text-slate-705 rounded-lg whitespace-pre-wrap leading-relaxed">
                <span className="text-[#1E73FF] font-mono select-none block mb-1 uppercase text-[9px] font-extrabold tracking-wider">Nội dung chi tiết:</span>
                {sub.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
