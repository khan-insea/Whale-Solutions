import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Trash2, CheckCircle, Clock, AlertCircle, Edit, Save, X, Eye } from 'lucide-react';

interface Lead {
  id: string;
  fullName?: string;
  phone?: string;
  email?: string;
  businessName?: string;
  requestType?: string;
  serviceOfInterest?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  pageSource?: string;
  status?: string; // 'pending' | 'contacted' | 'deal' | 'rejected'
  internal_note?: string;
  submittedAt?: string;
  created_at?: string;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [statusVal, setStatusVal] = useState('pending');
  const [editingId, setEditingId] = useState<string | null>(null);

  const token = sessionStorage.getItem('whale_admin_token') || '';

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin?resource=leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setLeads(resData.data || []);
      } else {
        setError(resData.error || 'Không tải được danh sách khách hàng.');
      }
    } catch (err: any) {
      setError('Lỗi kết nối API: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatusAndNote = async (id: string) => {
    try {
      const res = await fetch('/api/admin?resource=leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id,
          status: statusVal,
          internal_note: internalNote
        })
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setLeads(leads.map(lead => lead.id === id ? { ...lead, status: statusVal, internal_note: internalNote } : lead));
        setEditingId(null);
        setSelectedLead(null);
      } else {
        alert(resData.error || 'Cập nhật thất bại.');
      }
    } catch (err: any) {
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Chắc chắn muốn xóa khách hàng này?')) return;
    try {
      const res = await fetch(`/api/admin?resource=leads&id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resData = await res.json();
      if (res.ok && resData.success) {
        setLeads(leads.filter(lead => lead.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
      } else {
        alert(resData.error || 'Xóa thất bại.');
      }
    } catch (err: any) {
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  const filtered = leads.filter(item => {
    const term = search.toLowerCase();
    const matchesSearch = 
      (item.fullName || '').toLowerCase().includes(term) ||
      (item.phone || '').includes(term) ||
      (item.email || '').toLowerCase().includes(term) ||
      (item.serviceOfInterest || '').toLowerCase().includes(term);

    if (filterStatus === 'all') return matchesSearch;
    return (item.status || 'pending') === filterStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Danh Sách Yêu Cầu Gửi Đến (Leads)</h2>
          <p className="text-xs text-slate-500">Quản lý phản hồi trực tiếp, cập nhật trạng thái tư vấn và ghi chú nội bộ.</p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, ĐT, email, dịch vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-250 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white border border-slate-250 rounded-lg px-2 py-1.5 text-xs text-slate-700 focus:outline-none"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ tư vấn (Chưa liên hệ)</option>
          <option value="contacted">Đang thương lượng (Đã liên hệ)</option>
          <option value="deal">Đã ký hợp đồng (Thành công)</option>
          <option value="rejected">Không phù hợp / Hủy bỏ</option>
        </select>
      </div>

      {/* Main Panel layout with details drawer if open */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedLead ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          {loading && leads.length === 0 ? (
            <div className="p-12 text-center text-slate-405 text-xs">Đang tải biểu mẫu...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 bg-white border border-slate-200 rounded-xl text-center text-slate-400 text-xs">
              Chưa có khách hàng nào gửi thông tin.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <th className="p-3">Khách hàng</th>
                      <th className="p-3">Nội dung yêu cầu</th>
                      <th className="p-3">Trạng thái</th>
                      <th className="p-3 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((item) => {
                      const status = item.status || 'pending';
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 whitespace-nowrap">
                            <div className="font-bold text-slate-900">{item.fullName}</div>
                            <div className="text-[10px] text-slate-500">{item.phone}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{item.email}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-slate-800 line-clamp-1">{item.serviceOfInterest}</div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">Ns: {item.budget} | Timeline: {item.timeline}</div>
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {status === 'pending' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200"><Clock size={10} /> Chờ liên hệ</span>}
                            {status === 'contacted' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200"><Clock size={10} /> Đan trao đổi</span>}
                            {status === 'deal' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200"><CheckCircle size={10} /> Thành công</span>}
                            {status === 'rejected' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200"><AlertCircle size={10} /> Hủy bỏ</span>}
                          </td>
                          <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                            <button
                              onClick={() => {
                                setSelectedLead(item);
                                setInternalNote(item.internal_note || '');
                                setStatusVal(item.status || 'pending');
                              }}
                              className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Xem chi tiết & Quản lý"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                              title="Xóa thông tin"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Lead action details drawer */}
        {selectedLead && (
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-sm">Chi Tiết Yêu Cầu</h3>
                  <p className="text-[10px] text-slate-400">ID: {selectedLead.id}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Họ và tên</span>
                  <span className="text-slate-900 font-bold">{selectedLead.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tên doanh nghiệp</span>
                  <span className="text-slate-900">{selectedLead.businessName || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Số điện thoại</span>
                  <a href={`tel:${selectedLead.phone}`} className="text-blue-600 font-bold hover:underline">{selectedLead.phone}</a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Email khách hàng</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-slate-800 hover:underline break-all font-mono">{selectedLead.email || 'N/A'}</a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Dịch vụ quan tâm</span>
                  <span className="text-slate-900 font-bold text-blue-800 bg-blue-50/50 px-1 border border-blue-100 rounded">{selectedLead.serviceOfInterest}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Dự toán ngân sách</span>
                  <span className="text-slate-900 font-medium">{selectedLead.budget || 'Chưa cung cấp'}</span>
                </div>
              </div>

              <div className="border-t border-slate-50 pt-3">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-1">Nội dung tin nhắn khách gửi</span>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs leading-relaxed text-slate-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedLead.message || '(Tin nhắn trống)'}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-3">
                <span className="text-[#1E73FF] block text-[10px] uppercase font-bold tracking-wider">Cập Nhật Tiến Độ & Ghi Chú</span>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Trạng thái xử lý</label>
                  <select
                    value={statusVal}
                    onChange={(e) => setStatusVal(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="pending">Chờ tư vấn / chưa liên hệ</option>
                    <option value="contacted">Đang trao đổi thương lượng</option>
                    <option value="deal">Đã chốt hợp đồng / thành công</option>
                    <option value="rejected">Không phù hợp / từ chối</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ghi chú nội bộ (Chỉ lưu trong admin)</label>
                  <textarea
                    rows={3}
                    placeholder="Ghi chú lịch sử liên hệ, tiến độ dự án, ưu đãi..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => handleUpdateStatusAndNote(selectedLead.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-lg text-center flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
              >
                <Save size={14} />
                Lưu cập nhật
              </button>
              <button
                onClick={() => setSelectedLead(null)}
                className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs py-2 rounded-lg text-center font-bold transition-colors cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
