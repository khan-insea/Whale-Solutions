import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, FileText, Check } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  category?: string;
  cover_image?: string;
  status: 'draft' | 'published';
  seo_title?: string;
  seo_description?: string;
  created_at?: string;
}

export default function AdminPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const token = sessionStorage.getItem('whale_admin_token') || '';

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?resource=posts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPosts(data.data || []);
      } else {
        setError(data.error);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
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
    setEditingPost(prev => {
      const updated = { ...prev, title };
      if (isNew && !prev?.slug) {
        updated.slug = slugify(title);
      }
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost?.title || !editingPost?.slug) {
      alert('Vui lòng điền đủ tiêu đề và đường dẫn (slug)');
      return;
    }

    try {
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch('/api/admin?resource=posts', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingPost)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isNew) {
          setPosts([data.data, ...posts]);
        } else {
          setPosts(posts.map(p => p.id === editingPost.id ? data.data : p));
        }
        setEditingPost(null);
      } else {
        alert(data.error || 'Lưu thất bại.');
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Chắc chắn muốn xóa bài viết này?')) return;
    try {
      const res = await fetch(`/api/admin?resource=posts&id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">Quản Lý Bài Đăng (Blog CMS)</h2>
          <p className="text-xs text-slate-500 font-sans">Viết bài chia sẻ thông tin, cập nhật SEO, tin tức hữu ích định kỳ cho doanh nghiệp.</p>
        </div>
        {!editingPost && (
          <button
            onClick={() => {
              setEditingPost({
                title: '',
                slug: '',
                excerpt: '',
                content: '',
                category: 'AI',
                cover_image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
                status: 'draft',
                seo_title: '',
                seo_description: ''
              });
              setIsNew(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow cursor-pointer"
          >
            <Plus size={14} />
            Đăng bài mới
          </button>
        )}
      </div>

      {editingPost ? (
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-2">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <FileText size={16} className="text-blue-650" />
              {isNew ? 'Thêm Bài Đăng Mới' : 'Cập Nhật Bài Đăng'}
            </h3>
            <button
              type="button"
              onClick={() => setEditingPost(null)}
              className="p-1 hover:bg-slate-150 rounded text-slate-400 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Title */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Tiêu đề bài viết <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="Nhập tiêu đề hoặc chủ đề..."
                value={editingPost.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Đường dẫn tĩnh (Slug) <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="slug-duong-dan-bai-viet"
                value={editingPost.slug || ''}
                onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 font-mono text-blue-700"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Chuyên mục</label>
              <select
                value={editingPost.category || 'AI'}
                onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="AI">Ứng dụng AI</option>
                <option value="Marketing">Marketing & Quảng cáo</option>
                <option value="Website">Thiết kế Web</option>
                <option value="Tracking">Đo lường & Dữ liệu</option>
                <option value="In ấn">In ấn thi công</option>
              </select>
            </div>

            {/* Image */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Ảnh đại diện (Cover Image URL)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={editingPost.cover_image || ''}
                onChange={(e) => setEditingPost({ ...editingPost, cover_image: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* Excerpt */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Mô tả ngắn hiển thị ở trang danh sách</label>
              <textarea
                rows={2}
                placeholder="Viết tóm tắt thu hút độc giả..."
                value={editingPost.excerpt || ''}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Content */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Nội dung chi tiết (Markdown)</label>
              <textarea
                rows={8}
                placeholder="Hãy viết toàn bộ nội dung của bài blog..."
                value={editingPost.content || ''}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            {/* SEO Section */}
            <div className="md:col-span-2 border-t border-slate-100 pt-3 mt-1 space-y-3">
              <span className="text-[#1E73FF] block text-[10px] uppercase font-bold tracking-wider">Cấu Hình Meta SEO (Tối ưu hóa tìm kiếm)</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">SEO Title (Trống sẽ lấy tiêu đề)</label>
                  <input
                    type="text"
                    placeholder="Chuẩn SEO tiêu đề thu hút..."
                    value={editingPost.seo_title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, seo_title: e.target.value })}
                    className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">SEO Description (Mô tả tìm kiếm Google)</label>
                  <input
                    type="text"
                    placeholder="Tóm tắt SEO ngắn dưới 160 ký tự"
                    value={editingPost.seo_description || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, seo_description: e.target.value })}
                    className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Status selection */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Xuất bản luôn?</label>
              <div className="flex gap-4 mt-1.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="radio"
                    name="pub_status"
                    checked={editingPost.status === 'draft'}
                    onChange={() => setEditingPost({ ...editingPost, status: 'draft' })}
                  />
                  Chỉ lưu bản nháp (Draft)
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-705">
                  <input
                    type="radio"
                    name="pub_status"
                    checked={editingPost.status === 'published'}
                    onChange={() => setEditingPost({ ...editingPost, status: 'published' })}
                  />
                  Xuất bản ngay (Published)
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow transition-colors cursor-pointer"
            >
              <Save size={14} />
              Lưu bài đăng
            </button>
            <button
              type="button"
              onClick={() => setEditingPost(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-1 md:col-span-3 py-12 text-center text-slate-500 text-xs">Đang tải danh mục bài viết...</div>
          ) : posts.length === 0 ? (
            <div className="col-span-1 md:col-span-3 p-12 bg-white border border-slate-200 rounded-xl text-center text-slate-400 text-xs font-semibold">
              Chưa có bài viết nào. Hãy click "Đăng bài mới" phía trên.
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={post.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/80 text-white font-bold text-[9px] px-2 py-0.5 rounded backdrop-blur">
                      {post.category || 'Chưa lọc'}
                    </span>
                    <span className={`absolute top-3 right-3 font-bold text-[9px] px-2 py-0.5 rounded shadow ${
                      post.status === 'published' ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'
                    }`}>
                      {post.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-display font-bold text-slate-900 text-sm line-clamp-2 leading-snug">{post.title}</h4>
                    <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">{post.excerpt || 'Không có mô tả nội dung.'}</p>
                    <div className="text-[10px] text-slate-400 font-mono">Slug: {post.slug}</div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div className="text-[10px] text-slate-405 font-medium">{post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Mới tạo'}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setIsNew(false);
                      }}
                      className="p-1 px-2 border border-slate-200 bg-white hover:bg-slate-100 hover:border-slate-300 text-slate-700 text-[11px] font-bold rounded-md flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Edit2 size={12} /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1 border border-rose-100 bg-white hover:bg-rose-50 text-rose-600 text-[11px] font-bold rounded-md transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
