import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Layers, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  category?: string;
  price_text?: string;
  price_from?: number;
  features?: string[]; // jsonb / array
  suitable_for?: string[]; // jsonb / array
  delivery_time?: string;
  status: 'available' | 'coming_soon' | 'hidden';
  image_url?: string;
  is_featured?: boolean;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingProd, setEditingProd] = useState<Partial<Product> | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Lists/inputs helpers
  const [featureInput, setFeatureInput] = useState('');
  const [suitableInput, setSuitableInput] = useState('');

  const token = sessionStorage.getItem('whale_admin_token') || '';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(data.data || []);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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

  const handleTitleChange = (name: string) => {
    setEditingProd(prev => {
      const updated = { ...prev, name };
      if (isNew && !prev?.slug) {
        updated.slug = slugify(name);
      }
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProd?.name || !editingProd?.slug) {
      alert('Vui lòng nhập tên và đường dẫn tĩnh (slug).');
      return;
    }

    try {
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch('/api/admin/products', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingProd)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isNew) {
          setProducts([data.data, ...products]);
        } else {
          setProducts(products.map(p => p.id === editingProd.id ? data.data : p));
        }
        setEditingProd(null);
      } else {
        alert(data.error || 'Thao tác lưu thất bại.');
      }
    } catch (err: any) {
      alert('Sự cố: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Chắc chắn muốn xóa sản phẩm này?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">Quản Lý Gói Sản Phẩm (Products CMS)</h2>
          <p className="text-xs text-slate-500">Thiết lập các sản phẩm phần mềm đóng gói, công cụ bàn giao mẫu hỗ trợ tự động hóa.</p>
        </div>
        {!editingProd && (
          <button
            onClick={() => {
              setEditingProd({
                name: '',
                slug: '',
                short_description: '',
                description: '',
                category: 'Phần mềm đóng gói',
                price_text: 'Từ 1.000.000đ',
                price_from: 1000000,
                delivery_time: '3-5 ngày',
                status: 'available',
                image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                is_featured: false,
                features: [],
                suitable_for: []
              });
              setIsNew(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow cursor-pointer"
          >
            <Plus size={14} />
            Thêm sản phẩm mới
          </button>
        )}
      </div>

      {editingProd ? (
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-2">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <Layers size={16} className="text-blue-600" />
              {isNew ? 'Thêm Sản Phẩm Mới' : 'Cập Nhật Sản Phẩm'}
            </h3>
            <button type="button" onClick={() => setEditingProd(null)} className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Tên */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Tên sản phẩm / Gói <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="Ví dụ: CRM quản lý khách hàng..."
                value={editingProd.name || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Đường dẫn (Slug)</label>
              <input
                type="text"
                required
                value={editingProd.slug || ''}
                onChange={(e) => setEditingProd({ ...editingProd, slug: e.target.value })}
                className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2 text-xs font-mono text-blue-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Danh mục sản phẩm</label>
              <input
                type="text"
                placeholder="Phần mềm / Gói tối ưu..."
                value={editingProd.category || ''}
                onChange={(e) => setEditingProd({ ...editingProd, category: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Image */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Hình ảnh mô tả (Image URL)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={editingProd.image_url || ''}
                onChange={(e) => setEditingProd({ ...editingProd, image_url: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Price text */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Giá hiển thị thương lượng</label>
              <input
                type="text"
                placeholder="Từ 3.000.000đ hoặc Thỏa thuận..."
                value={editingProd.price_text || ''}
                onChange={(e) => setEditingProd({ ...editingProd, price_text: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Price from (number) */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Giá tối thiểu (Để sắp xếp - Số)</label>
              <input
                type="number"
                placeholder="3000000"
                value={editingProd.price_from || 0}
                onChange={(e) => setEditingProd({ ...editingProd, price_from: parseInt(e.target.value) || 0 })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Delivery time */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Thời gian bàn giao</label>
              <input
                type="text"
                placeholder="5-7 ngày thực làm việc..."
                value={editingProd.delivery_time || ''}
                onChange={(e) => setEditingProd({ ...editingProd, delivery_time: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Featured toggle */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Hiển thị nổi bật trang chủ?</label>
              <div className="flex gap-4 mt-1.5 text-xs text-slate-700">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={!!editingProd.is_featured}
                    onChange={(e) => setEditingProd({ ...editingProd, is_featured: e.target.checked })}
                  />
                  Có, hiển thị nổi bật hàng đầu
                </label>
              </div>
            </div>

            {/* Short description */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Mô tả ngắn gọn (Trang danh sách)</label>
              <textarea
                rows={2}
                placeholder="Tóm tắt tính năng chính của gói..."
                value={editingProd.short_description || ''}
                onChange={(e) => setEditingProd({ ...editingProd, short_description: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Chi tiết đầy đủ</label>
              <textarea
                rows={5}
                placeholder="Trình bày đầy đủ về sản phẩm..."
                value={editingProd.description || ''}
                onChange={(e) => setEditingProd({ ...editingProd, description: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Array fields using simple tags UI */}
            {/* Features list */}
            <div className="border border-slate-100 p-3 rounded-xl bg-slate-50 col-span-1 md:col-span-2 space-y-2">
              <label className="block text-[10px] font-bold text-slate-6 tracking-wide">DANH SÁCH CHI TIẾT TÍNH NĂNG ({editingProd.features?.length || 0})</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tính năng (ví dụ: responsive di động, ssl miễn phí...)"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs flex-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!featureInput.trim()) return;
                    const feats = editingProd.features || [];
                    setEditingProd({ ...editingProd, features: [...feats, featureInput.trim()] });
                    setFeatureInput('');
                  }}
                  className="px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(editingProd.features || []).map((feat, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-700">
                    {feat}
                    <button
                      type="button"
                      onClick={() => setEditingProd({ ...editingProd, features: (editingProd.features || []).filter((_, i) => i !== idx) })}
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status selection */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-650 uppercase">Trạng thái phát triển</label>
              <select
                value={editingProd.status || 'available'}
                onChange={(e) => setEditingProd({ ...editingProd, status: e.target.value as any })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              >
                <option value="available">Sẵn sàng cung cấp (Available)</option>
                <option value="coming_soon">Đang nghiên cứu / Sắp ra mắt (Coming Soon)</option>
                <option value="hidden">Ẩn hiển thị (Hidden)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-colors cursor-pointer">
              <Save size={14} />
              Lưu cấu hình sản phẩm
            </button>
            <button
              type="button"
              onClick={() => setEditingProd(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-xs text-slate-400 font-medium">Đang truy xuất thông số...</div>
          ) : products.length === 0 ? (
            <div className="col-span-3 p-12 bg-white border border-slate-200 rounded-xl text-center text-slate-400 text-xs font-semibold">
              Chưa có sản phẩm đóng gói nào được bổ sung. Click "Thêm sản phẩm mới" để bắt đầu.
            </div>
          ) : (
            products.map(prod => (
              <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img src={prod.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'} alt={prod.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {prod.is_featured && (
                      <span className="absolute top-3 left-3 bg-amber-500 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow">
                        Nổi bật hàng đầu
                      </span>
                    )}
                    <span className={`absolute top-3 right-3 font-bold text-[9px] px-2 py-0.5 rounded text-white shadow ${
                      prod.status === 'available' ? 'bg-green-500' : prod.status === 'coming_soon' ? 'bg-amber-500' : 'bg-slate-400'
                    }`}>
                      {prod.status === 'available' ? 'Sẵn sàng' : prod.status === 'coming_soon' ? 'Sắp ra mắt' : 'Ẩn'}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-display font-bold text-slate-900 text-sm line-clamp-2 leading-snug">{prod.name}</h4>
                    <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">{prod.short_description || 'Không có tóm lược.'}</p>
                    <div className="text-blue-700 font-bold font-sans text-xs">{prod.price_text}</div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingProd(prod);
                      setIsNew(false);
                    }}
                    className="p-1 px-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-705 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 size={11} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
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
