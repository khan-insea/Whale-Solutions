import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, DollarSign } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  ctaText: string;
  badge?: string;
  sort_order?: number;
}

export default function AdminPricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingPlan, setEditingPlan] = useState<Partial<PricingPlan> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const [featureInput, setFeatureInput] = useState('');

  const token = sessionStorage.getItem('whale_admin_token') || '';

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pricing', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPlans(data.data || []);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan?.name || !editingPlan?.price) {
      alert('Vui lòng điền đủ tên gói và giá !');
      return;
    }

    try {
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch('/api/admin/pricing', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingPlan)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isNew) {
          setPlans([...plans, data.data]);
        } else {
          setPlans(plans.map(p => p.id === editingPlan.id ? data.data : p));
        }
        setEditingPlan(null);
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Chắc chắn xóa gói giá này?')) return;
    try {
      const res = await fetch(`/api/admin/pricing?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPlans(plans.filter(p => p.id !== id));
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">Quản Lý Gói Bảng Giá (Pricing CMS)</h2>
          <p className="text-xs text-slate-500 font-sans">Sắp đặt biểu giá dịch vụ thiết kế landing page, website theo template hoặc đồng hành marketing.</p>
        </div>
        {!editingPlan && (
          <button
            onClick={() => {
              setEditingPlan({
                name: '',
                price: 'Từ 2.000.000đ',
                features: [],
                ctaText: 'Đăng ký ngay',
                badge: '',
                sort_order: plans.length + 1
              });
              setIsNew(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow cursor-pointer"
          >
            <Plus size={14} />
            Bổ sung gói mới
          </button>
        )}
      </div>

      {editingPlan ? (
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-2">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <DollarSign size={16} className="text-blue-650" />
              {isNew ? 'Thêm Mới Gói Toàn Diện' : 'Cập Nhật Gói Bảng Giá'}
            </h3>
            <button type="button" onClick={() => setEditingPlan(null)} className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            {/* Tên */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Tên gói chi thiết</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Landing Page chạy Ads..."
                value={editingPlan.name || ''}
                onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Đơn giá hiển thị</label>
              <input
                type="text"
                required
                placeholder="Từ 2.500.000đ hoặc Thỏa thuận..."
                value={editingPlan.price || ''}
                onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* CTA text */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Nhãn nút hành động (CTA)</label>
              <input
                type="text"
                placeholder="Nhận báo giá..."
                value={editingPlan.ctaText || 'Nhận báo giá'}
                onChange={(e) => setEditingPlan({ ...editingPlan, ctaText: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Badge */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-605 uppercase">Thẻ đính kèm (Badge - Tùy chọn)</label>
              <input
                type="text"
                placeholder="Ví dụ: Phù hợp nhất cho dịch vụ nhỏ..."
                value={editingPlan.badge || ''}
                onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Sort order */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Thứ tự hiển thị (Số)</label>
              <input
                type="number"
                placeholder="1, 2, 3..."
                value={editingPlan.sort_order || 1}
                onChange={(e) => setEditingPlan({ ...editingPlan, sort_order: parseInt(e.target.value) || 1 })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Features tags inline list config */}
            <div className="col-span-1 md:col-span-2 border border-slate-100 p-3 rounded-xl bg-slate-50 space-y-2">
              <label className="block text-[10px] font-bold text-slate-600 tracking-wider">ĐIỂM NỔI BẬT BAO GỒM ({editingPlan.features?.length || 0})</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Gắn Analytics / Trọn gói 3-5 trang..."
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs flex-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!featureInput.trim()) return;
                    const feats = editingPlan.features || [];
                    setEditingPlan({ ...editingPlan, features: [...feats, featureInput.trim()] });
                    setFeatureInput('');
                  }}
                  className="px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(editingPlan.features || []).map((feat, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-700">
                    {feat}
                    <button
                      type="button"
                      onClick={() => setEditingPlan({ ...editingPlan, features: (editingPlan.features || []).filter((_, i) => i !== idx) })}
                      className="text-red-500 font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-colors cursor-pointer">
              <Save size={14} />
              Lưu biểu phí gói
            </button>
            <button type="button" onClick={() => setEditingPlan(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-705 font-bold text-xs rounded-lg cursor-pointer">
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-xs text-slate-400">Đang đồng bộ...</div>
          ) : plans.length === 0 ? (
            <div className="col-span-3 p-12 bg-white border border-slate-200 rounded-xl text-center text-slate-400 text-xs font-semibold">
              Chưa có cấu hình bảng giá. Click "Bổ sung gói mới".
            </div>
          ) : (
            plans.map(p => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between hover:scale-[1.01] transition-all">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] text-slate-400 font-mono">Thứ tự: {p.sort_order || 0}</span>
                    {p.badge && (
                      <span className="text-[9px] bg-blue-50 text-blue-750 font-bold px-2 py-0.5 rounded border border-blue-100 tracking-wide line-clamp-1">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-display font-extrabold text-slate-900 text-base">{p.name}</h4>
                  <div className="text-[#1E73FF] font-extrabold text-lg">{p.price}</div>
                  
                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 block font-mono">Nổi bật:</span>
                    <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                      {p.features?.slice(0, 4).map((f, i) => (
                        <li key={i} className="truncate">{f}</li>
                      ))}
                      {(p.features || []).length > 4 && <li>... và {p.features.length - 4} tính năng khác</li>}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingPlan(p);
                      setIsNew(false);
                    }}
                    className="p-1 px-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 size={11} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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
