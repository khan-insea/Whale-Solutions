import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Lightbulb } from 'lucide-react';

interface Solution {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  category?: string;
  features?: string[];
  suitable_for?: string[];
  status: 'available' | 'coming_soon' | 'hidden';
  image_url?: string;
}

export default function AdminSolutions() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingSol, setEditingSol] = useState<Partial<Solution> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const [featureInput, setFeatureInput] = useState('');
  const [suitableInput, setSuitableInput] = useState('');

  const token = sessionStorage.getItem('whale_admin_token') || '';

  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?resource=solutions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSolutions(data.data || []);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
      .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
      .replace(/[íìỉĩị]/g, 'i')
      .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
      .replace(/[úùủũụưứừửữự]/g, 'u')
      .replace(/[ýỳỷỹỵ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (title: string) => {
    setEditingSol(prev => {
      const updated = { ...prev, title };
      if (isNew && !prev?.slug) {
        updated.slug = slugify(title);
      }
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSol?.title || !editingSol?.slug) {
      alert('Vui lòng nhập tiêu đề giải pháp và đường dẫn (slug).');
      return;
    }

    try {
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch('/api/admin?resource=solutions', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingSol)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isNew) {
          setSolutions([data.data, ...solutions]);
        } else {
          setSolutions(solutions.map(s => s.id === editingSol.id ? data.data : s));
        }
        setEditingSol(null);
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Chắc chắn muốn xóa giải pháp này?')) return;
    try {
      const res = await fetch(`/api/admin?resource=solutions&id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSolutions(solutions.filter(s => s.id !== id));
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">Quản Lý Công Cụ / Giải Pháp Số CMS</h2>
          <p className="text-xs text-slate-500 font-sans">Kiến hình các sản phẩm/tool, CRM, Wifi marketing, v.v... phục vụ hoạt động chuyển đổi số của doanh nghiệp.</p>
        </div>
        {!editingSol && (
          <button
            onClick={() => {
              setEditingSol({
                title: '',
                slug: '',
                short_description: '',
                description: '',
                category: 'Hệ thống Quản trị',
                status: 'available',
                image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                features: [],
                suitable_for: []
              });
              setIsNew(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow cursor-pointer"
          >
            <Plus size={14} />
            Đăng giải pháp mới
          </button>
        )}
      </div>

      {editingSol ? (
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-2">
            <h3 className="font-bold text-sm text-slate-805 flex items-center gap-1.5">
              <Lightbulb size={16} className="text-blue-600" />
              {isNew ? 'Thêm Giải Pháp Công Nghệ Mới' : 'Cập Nhật Giải Pháp Số'}
            </h3>
            <button type="button" onClick={() => setEditingSol(null)} className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            {/* Title */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Tên giải pháp / App <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Wifi marketing, CRM chăm sóc khách hàng..."
                value={editingSol.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Đường dẫn tĩnh (Slug)</label>
              <input
                type="text"
                required
                value={editingSol.slug || ''}
                onChange={(e) => setEditingSol({ ...editingSol, slug: e.target.value })}
                className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2 text-xs font-mono text-blue-750 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Chuyên mục / Thể loại</label>
              <input
                type="text"
                placeholder="Ví dụ: Ứng dụng di động, Phần mềm quản trị..."
                value={editingSol.category || ''}
                onChange={(e) => setEditingSol({ ...editingSol, category: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Image */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-605 uppercase">Hình ảnh minh họa (Image URL)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={editingSol.image_url || ''}
                onChange={(e) => setEditingSol({ ...editingSol, image_url: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Short description */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Tóm tắt ngắn gọn hiển thị ngoài trang chính</label>
              <textarea
                rows={2}
                placeholder="Phễu quản lý cơ sở dữ liệu khách hàng từ quảng cáo..."
                value={editingSol.short_description || ''}
                onChange={(e) => setEditingSol({ ...editingSol, short_description: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Mô tả đầy đủ chi tiết</label>
              <textarea
                rows={4}
                placeholder="Giúp doanh nghiệp theo sát mọi mốc hành trình khách hàng..."
                value={editingSol.description || ''}
                onChange={(e) => setEditingSol({ ...editingSol, description: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Features lists array tags representation */}
            <div className="border border-slate-100 p-3 rounded-xl bg-slate-50 space-y-2 col-span-1">
              <label className="block text-[10px] font-bold text-slate-600 tracking-wider">TÍNH NĂNG CHỦ CHỐT ({editingSol.features?.length || 0})</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ví dụ: Tự động phân chia lead cho Sale..."
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs flex-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!featureInput.trim()) return;
                    const oFeats = editingSol.features || [];
                    setEditingSol({ ...editingSol, features: [...oFeats, featureInput.trim()] });
                    setFeatureInput('');
                  }}
                  className="px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(editingSol.features || []).map((ft, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-700">
                    {ft}
                    <button
                      type="button"
                      onClick={() => setEditingSol({ ...editingSol, features: (editingSol.features || []).filter((_, i) => i !== idx) })}
                      className="text-red-500 font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Suitable for lists array tags representation */}
            <div className="border border-slate-100 p-3 rounded-xl bg-slate-50 space-y-2 col-span-1">
              <label className="block text-[10px] font-bold text-slate-600 tracking-wider">PHÙ HỢP CHO ĐỐI TƯỢNG ({editingSol.suitable_for?.length || 0})</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ví dụ: Phòng Sales, Cửa hàng ăn uống..."
                  value={suitableInput}
                  onChange={(e) => setSuitableInput(e.target.value)}
                  className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs flex-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!suitableInput.trim()) return;
                    const oSuts = editingSol.suitable_for || [];
                    setEditingSol({ ...editingSol, suitable_for: [...oSuts, suitableInput.trim()] });
                    setSuitableInput('');
                  }}
                  className="px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 font-sans">
                {(editingSol.suitable_for || []).map((st, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-700">
                    {st}
                    <button
                      type="button"
                      onClick={() => setEditingSol({ ...editingSol, suitable_for: (editingSol.suitable_for || []).filter((_, i) => i !== idx) })}
                      className="text-red-500 font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status selection */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Trạng thái triển khai</label>
              <select
                value={editingSol.status || 'available'}
                onChange={(e) => setEditingSol({ ...editingSol, status: e.target.value as any })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none font-medium"
              >
                <option value="available">Đã phát hành / Thử nghiệm (Available)</option>
                <option value="coming_soon">Lộ trình xây dựng / Sắp có (Coming Soon)</option>
                <option value="hidden">Ẩn hiển thị (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-colors cursor-pointer">
              <Save size={14} />
              Lưu cấu hình giải pháp
            </button>
            <button
              type="button"
              onClick={() => setEditingSol(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-xs text-slate-400 font-medium">Đang tải data giải pháp...</div>
          ) : solutions.length === 0 ? (
            <div className="col-span-3 p-12 bg-white border border-slate-200 rounded-xl text-center text-slate-400 text-xs font-semibold">
              Chưa thiết lập giải pháp số chuyển đổi nào. Hãy click "Đăng giải pháp mới" để tiến hành.
            </div>
          ) : (
            solutions.map(sol => (
              <div key={sol.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img src={sol.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'} alt={sol.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute top-3 left-3 bg-slate-900/85 text-white font-bold text-[9px] px-2 py-0.5 rounded tracking-wide max-w-[120px] truncate">
                      {sol.category || 'N/A'}
                    </span>
                    <span className={`absolute top-3 right-3 font-bold text-[9px] px-2 py-0.5 rounded text-white shadow ${
                      sol.status === 'available' ? 'bg-green-500' : 'bg-amber-500'
                    }`}>
                      {sol.status === 'available' ? 'Đã xuất bản' : 'Sắp ra mắt'}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-display font-bold text-slate-900 text-sm line-clamp-2 leading-snug">{sol.title}</h4>
                    <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">{sol.short_description || 'Không có tóm tắt chi tiết.'}</p>
                    <div className="text-[10px] text-slate-400 font-mono">Slug: {sol.slug}</div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingSol(sol);
                      setIsNew(false);
                    }}
                    className="p-1 px-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 size={11} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(sol.id)}
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
