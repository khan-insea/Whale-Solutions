import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Settings2, Trash } from 'lucide-react';

interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  status: 'available' | 'coming_soon';
}

interface ServiceGroup {
  id: string;
  title: string;
  status: 'available' | 'coming_soon' | 'hybrid';
  badgeText: string;
  ctaText: string;
  note?: string;
  services?: ServiceItem[];
}

export default function AdminServices() {
  const [groups, setGroups] = useState<ServiceGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingGroup, setEditingGroup] = useState<Partial<ServiceGroup> | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Sub-services adding helpers
  const [subName, setSubName] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subStatus, setSubStatus] = useState<'available' | 'coming_soon'>('available');

  const token = sessionStorage.getItem('whale_admin_token') || '';

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?resource=services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGroups(data.data || []);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGroup?.title) {
      alert('Vui lòng nhập tiêu đề nhóm dịch vụ!');
      return;
    }

    try {
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch('/api/admin?resource=services', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingGroup)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isNew) {
          setGroups([data.data, ...groups]);
        } else {
          setGroups(groups.map(g => g.id === editingGroup.id ? data.data : g));
        }
        setEditingGroup(null);
      } else {
        alert(data.error || 'Cập nhật thất bại.');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Chắc chắn xóa nhóm dịch vụ này? Toàn bộ các dịch vụ con bên trong sẽ biến mất.')) return;
    try {
      const res = await fetch(`/api/admin?resource=services&id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setGroups(groups.filter(g => g.id !== id));
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">Quản Lý Nhóm Dịch Vụ (Services CMS)</h2>
          <p className="text-xs text-slate-500 font-sans">Định hình các danh mục lớn, cấu hình nút nhấp CTA và bổ sung chi tiết danh mục dịch vụ con.</p>
        </div>
        {!editingGroup && (
          <button
            onClick={() => {
              setEditingGroup({
                title: '',
                status: 'available',
                badgeText: 'Đang nhận báo giá',
                ctaText: 'Nhận báo giá ngay',
                note: '',
                services: []
              });
              setIsNew(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            <Plus size={14} />
            Tạo nhóm dịch vụ mới
          </button>
        )}
      </div>

      {editingGroup ? (
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-2">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <Settings2 size={16} className="text-blue-600" />
              {isNew ? 'Thạo Mới Nhóm Dịch Vụ' : 'Cập Nhật Nhóm Dịch Vụ'}
            </h3>
            <button type="button" onClick={() => setEditingGroup(null)} className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Title */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase font-mono">Tên nhóm dịch vụ lớn</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Marketing & Quảng cáo online..."
                value={editingGroup.title || ''}
                onChange={(e) => setEditingGroup({ ...editingGroup, title: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Badge Text */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-605 uppercase font-mono">Nhãn trạng thái (Badge)</label>
              <input
                type="text"
                placeholder="Ví dụ: Đang nhận báo giá, Sắp ra mắt..."
                value={editingGroup.badgeText || ''}
                onChange={(e) => setEditingGroup({ ...editingGroup, badgeText: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* CTA action */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase font-mono">Chữ hiển thị trên nút bấm (CTA)</label>
              <input
                type="text"
                placeholder="Ví dụ: Nhận báo giá Marketing..."
                value={editingGroup.ctaText || ''}
                onChange={(e) => setEditingGroup({ ...editingGroup, ctaText: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase font-mono">Lưu ý mô tả cho nhóm (Tùy chọn)</label>
              <input
                type="text"
                placeholder="Một số giải pháp đã sẵn sàng đáp ứng..."
                value={editingGroup.note || ''}
                onChange={(e) => setEditingGroup({ ...editingGroup, note: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Status group */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase font-mono">Trạng thái chung</label>
              <select
                value={editingGroup.status || 'available'}
                onChange={(e) => setEditingGroup({ ...editingGroup, status: e.target.value as any })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              >
                <option value="available">Sẵn sàng thương thương (Available)</option>
                <option value="coming_soon">Sắp ra mắt (Coming Soon)</option>
                <option value="hybrid">Đang nhận & Sắp ra mắt (Hybrid)</option>
              </select>
            </div>

            {/* Sub services list nested inside */}
            <div className="col-span-1 md:col-span-2 border border-slate-100 p-4 rounded-xl bg-slate-50 space-y-3">
              <span className="block text-[10px] font-bold text-slate-600 tracking-wider font-mono">DANH MỤC DỊCH VỤ CON BÊN TRONG ({editingGroup.services?.length || 0})</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500">Tên dịch vụ con</span>
                  <input
                    type="text"
                    placeholder="Thiết kế web WordPress"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs w-full focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-500">Mô tả ngắn (tùy chọn)</span>
                  <input
                    type="text"
                    placeholder="Quét mã check-in..."
                    value={subDesc}
                    onChange={(e) => setSubDesc(e.target.value)}
                    className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs w-full focus:outline-none"
                  />
                </div>
                <div className="flex gap-1">
                  <select
                    value={subStatus}
                    onChange={(e) => setSubStatus(e.target.value as any)}
                    className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs flex-1 focus:outline-none"
                  >
                    <option value="available">Báo giá ngay</option>
                    <option value="coming_soon">Sắp ra mắt</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (!subName.trim()) return;
                      const sItems = editingGroup.services || [];
                      const newItem: ServiceItem = {
                        id: `item-${Date.now()}-${Math.floor(Math.random() * 100)}`,
                        name: subName.trim(),
                        description: subDesc.trim() || undefined,
                        status: subStatus
                      };
                      setEditingGroup({ ...editingGroup, services: [...sItems, newItem] });
                      setSubName('');
                      setSubDesc('');
                    }}
                    className="px-3 py-1.5 bg-blue-650 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              {/* Sub list wrapper */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {(editingGroup.services || []).map((srv, idx) => (
                  <div key={srv.id || idx} className="flex justify-between items-center bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                    <div>
                      <span className="font-bold text-slate-800">{srv.name}</span>
                      {srv.description && <span className="text-slate-400 block text-[10px]">{srv.description}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-1.5 rounded ${srv.status === 'available' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {srv.status === 'available' ? 'Báo giá ngay' : 'Sắp ra mắt'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const list = (editingGroup.services || []).filter((_, i) => i !== idx);
                          setEditingGroup({ ...editingGroup, services: list });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-colors cursor-pointer">
              <Save size={14} />
              Lưu nhóm dịch vụ
            </button>
            <button
              type="button"
              onClick={() => setEditingGroup(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 text-center py-12 text-xs text-slate-400">Đang tải danh mục bài viết...</div>
          ) : groups.length === 0 ? (
            <div className="col-span-2 p-12 bg-white border border-slate-200 rounded-xl text-center text-slate-400 text-xs font-semibold">
              Chưa có cấu hình dịch vụ. Click "Tạo nhóm dịch vụ mới".
            </div>
          ) : (
            groups.map(g => (
              <div key={g.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-slate-300 transition-all">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-105 px-2 py-0.5 rounded uppercase tracking-wider">
                      {g.badgeText}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">ID: {g.id}</span>
                  </div>
                  <h3 className="font-display font-bold text-slate-800 text-base leading-snug">{g.title}</h3>
                  {g.note && <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed italic">📝 {g.note}</p>}
                  
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">Dịch vụ con ({g.services?.length || 0}):</span>
                    <div className="flex flex-wrap gap-1">
                      {(g.services || []).slice(0, 5).map((s, i) => (
                        <span key={i} className="text-[9px] font-medium bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {s.name}
                        </span>
                      ))}
                      {(g.services || []).length > 5 && (
                        <span className="text-[9px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          +{(g.services || []).length - 5} dịch vụ khác
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingGroup(g);
                      setIsNew(false);
                    }}
                    className="p-1 px-2.5 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 size={11} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(g.id)}
                    className="p-1 border border-rose-100 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
