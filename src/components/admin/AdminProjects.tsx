import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Briefcase, Eye } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  websiteUrl?: string;
  gallery?: string[];
  challenge?: string;
  solution?: string;
  results?: string[];
  details?: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingProj, setEditingProj] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Arrays input helpers
  const [tagInput, setTagInput] = useState('');
  const [resultInput, setResultInput] = useState('');

  const token = sessionStorage.getItem('whale_admin_token') || '';

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?resource=projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.data || []);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj?.title || !editingProj?.image) {
      alert('Vui lòng điền tiêu đề dự án và ảnh hiển thị đại diện!');
      return;
    }

    try {
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch('/api/admin?resource=projects', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingProj)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isNew) {
          setProjects([data.data, ...projects]);
        } else {
          setProjects(projects.map(p => p.id === editingProj.id ? data.data : p));
        }
        setEditingProj(null);
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Chắc chắn muốn xóa dự án thực tế này?')) return;
    try {
      const res = await fetch(`/api/admin?resource=projects&id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">Quản Lý Dự Án / Portfolio CMS</h2>
          <p className="text-xs text-slate-500 font-sans">Đăng tải các sản phẩm thực tế đã hoàn thiện giúp củng cố niềm tin trọn vẹn từ khách hàng truy cập.</p>
        </div>
        {!editingProj && (
          <button
            onClick={() => {
              setEditingProj({
                title: '',
                category: 'Website giới thiệu dịch vụ',
                description: '',
                image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
                tags: [],
                websiteUrl: '',
                gallery: [],
                challenge: '',
                solution: '',
                results: [],
                details: ''
              });
              setIsNew(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow cursor-pointer"
          >
            <Plus size={14} />
            Đăng dự án mới
          </button>
        )}
      </div>

      {editingProj ? (
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-2">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <Briefcase size={16} className="text-blue-600" />
              {isNew ? 'Đăng Dự Án Mới' : 'Cập Nhật Chi Tiết Dự Án'}
            </h3>
            <button type="button" onClick={() => setEditingProj(null)} className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Title */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-650 uppercase">Tiêu đề dự án thực tế <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Landing page Hack Não Tiếng Anh..."
                value={editingProj.title || ''}
                onChange={(e) => setEditingProj({ ...editingProj, title: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Phân loại thể loại</label>
              <select
                value={editingProj.category || 'Website giới thiệu dịch vụ'}
                onChange={(e) => setEditingProj({ ...editingProj, category: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              >
                <option value="Website giới thiệu dịch vụ">Website giới thiệu dịch vụ</option>
                <option value="Landing page thu lead">Landing page thu lead</option>
                <option value="Setup tracking GA4/Clarity/Pixel">Setup tracking GA4/Clarity/Pixel</option>
                <option value="Content fanpage & Setup quảng cáo">Content fanpage & Setup quảng cáo</option>
                <option value="Zalo Mini App & Loyalty System">Zalo Mini App & Loyalty System</option>
              </select>
            </div>

            {/* Thumbnail URL */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Hình ảnh chính (Image URL) <span className="text-red-500">*</span></label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={editingProj.image || ''}
                onChange={(e) => setEditingProj({ ...editingProj, image: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Website URL */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Đường dẫn trang web demo (Nếu có)</label>
              <input
                type="url"
                placeholder="https://nhakhoaminhkhai.vn"
                value={editingProj.websiteUrl || ''}
                onChange={(e) => setEditingProj({ ...editingProj, websiteUrl: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Mô tả ngắn gọn (Hiển thị trang chính)</label>
              <textarea
                rows={2}
                placeholder="Thiết kế giao diện hiện đại chuyên nghiệp thu hút khách hàng tiềm năng..."
                value={editingProj.description || ''}
                onChange={(e) => setEditingProj({ ...editingProj, description: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Challenge */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Thách thức của khách hàng (Challenge)</label>
              <textarea
                rows={3}
                placeholder="Dữ liệu cũ bị lệch hoặc website tải quá chậm..."
                value={editingProj.challenge || ''}
                onChange={(e) => setEditingProj({ ...editingProj, challenge: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Solution */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Giải pháp của chúng tôi (Solution)</label>
              <textarea
                rows={3}
                placeholder="Tái thiết kế UI/UX theo tiêu chuẩn AIDA và gắn tracking đo lường chuẩn xác..."
                value={editingProj.solution || ''}
                onChange={(e) => setEditingProj({ ...editingProj, solution: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Details */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Bổ sung thông tin chi tiết (Details)</label>
              <textarea
                rows={3}
                placeholder="Có thể nêu chi tiết thêm về công việc như thiết kế database, các module CRM tích hợp..."
                value={editingProj.details || ''}
                onChange={(e) => setEditingProj({ ...editingProj, details: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Tags config array */}
            <div className="border border-slate-100 p-3 rounded-xl bg-slate-50 space-y-2 col-span-1">
              <label className="block text-[10px] font-bold text-slate-600 tracking-wider">THẺ PHÂN CHIA CÔNG NGHỆ ({editingProj.tags?.length || 0})</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ví dụ: WordPress, SEO, ReactJS..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs flex-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!tagInput.trim()) return;
                    const oTags = editingProj.tags || [];
                    setEditingProj({ ...editingProj, tags: [...oTags, tagInput.trim()] });
                    setTagInput('');
                  }}
                  className="px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(editingProj.tags || []).map((tg, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-700">
                    {tg}
                    <button
                      type="button"
                      onClick={() => setEditingProj({ ...editingProj, tags: (editingProj.tags || []).filter((_, i) => i !== idx) })}
                      className="text-red-500 font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Results config list */}
            <div className="border border-slate-100 p-3 rounded-xl bg-slate-50 space-y-2 col-span-1">
              <label className="block text-[10px] font-bold text-slate-600 tracking-wider">KẾT QUẢ ĐẠT ĐƯỢC ({editingProj.results?.length || 0})</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ví dụ: Tăng 75% số lượng đơn đặt hàng..."
                  value={resultInput}
                  onChange={(e) => setResultInput(e.target.value)}
                  className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs flex-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!resultInput.trim()) return;
                    const oRes = editingProj.results || [];
                    setEditingProj({ ...editingProj, results: [...oRes, resultInput.trim()] });
                    setResultInput('');
                  }}
                  className="px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Thêm
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {(editingProj.results || []).map((rs, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white border border-slate-200 px-2 py-1 rounded text-[10px] text-slate-750">
                    <span className="truncate">{rs}</span>
                    <button
                      type="button"
                      onClick={() => setEditingProj({ ...editingProj, results: (editingProj.results || []).filter((_, i) => i !== idx) })}
                      className="text-red-500 font-bold"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-colors cursor-pointer">
              <Save size={14} />
              Đăng dự án lên Portfolio
            </button>
            <button
              type="button"
              onClick={() => setEditingProj(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-xs text-slate-400">Đang đồng bộ...</div>
          ) : projects.length === 0 ? (
            <div className="col-span-3 p-12 bg-white border border-slate-200 rounded-xl text-center text-slate-400 text-xs font-semibold">
              Chưa bổ sung sản phẩm thực tế. Hãy bấm "Đăng dự án mới" phía trên.
            </div>
          ) : (
            projects.map(proj => (
              <div key={proj.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="relative h-44 bg-slate-150 overflow-hidden">
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute top-3 left-3 bg-[#1E73FF] text-white font-bold text-[9px] px-2 py-0.5 rounded tracking-wide line-clamp-1 max-w-[150px]">
                      {proj.category}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-display font-bold text-slate-905 text-sm line-clamp-2 leading-snug">{proj.title}</h4>
                    <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1 leading-none pt-1">
                      {(proj.tags || []).slice(0, 4).map((t, i) => (
                        <span key={i} className="text-[9px] bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 leading-none">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingProj(proj);
                      setIsNew(false);
                    }}
                    className="p-1 px-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 size={11} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id)}
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
