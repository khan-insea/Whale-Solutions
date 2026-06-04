import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, GraduationCap } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  target_audience?: string;
  curriculum?: string[];
  duration?: string;
  format?: string;
  price_text?: string;
  status: 'available' | 'coming_soon' | 'hidden';
  image_url?: string;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const [curriculumInput, setCurriculumInput] = useState('');

  const token = sessionStorage.getItem('whale_admin_token') || '';

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin?resource=courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCourses(data.data || []);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
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
    setEditingCourse(prev => {
      const updated = { ...prev, title };
      if (isNew && !prev?.slug) {
        updated.slug = slugify(title);
      }
      return updated;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse?.title || !editingCourse?.slug) {
      alert('Vui lòng điền đúng tiêu đề khóa học và đường dẫn (slug).');
      return;
    }

    try {
      const method = isNew ? 'POST' : 'PATCH';
      const res = await fetch('/api/admin?resource=courses', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingCourse)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (isNew) {
          setCourses([data.data, ...courses]);
        } else {
          setCourses(courses.map(c => c.id === editingCourse.id ? data.data : c));
        }
        setEditingCourse(null);
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Chắc chắn muốn xóa khóa học này?')) return;
    try {
      const res = await fetch(`/api/admin?resource=courses&id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCourses(courses.filter(c => c.id !== id));
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">Quản Lý Khóa Học & Đào Tạo CMS</h2>
          <p className="text-xs text-slate-500 font-sans">Chi tiết lộ trình đào tạo nội bộ ChatGPT/Gemini, thiết kế web cơ bản phục vụ đào tạo ngắn hạn.</p>
        </div>
        {!editingCourse && (
          <button
            onClick={() => {
              setEditingCourse({
                title: '',
                slug: '',
                description: '',
                target_audience: 'Chủ doanh nghiệp nhỏ, Freelancers, Marketers',
                duration: '4 buổi (Online/Offline)',
                format: 'Thực chiến 1 kèm 1 hoặc theo nhóm nhỏ',
                price_text: 'Thỏa thuận',
                status: 'coming_soon',
                image_url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
                curriculum: []
              });
              setIsNew(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow cursor-pointer"
          >
            <Plus size={14} />
            Mở khóa học mới
          </button>
        )}
      </div>

      {editingCourse ? (
        <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-2">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <GraduationCap size={16} className="text-blue-600" />
              {isNew ? 'Thiết Kế Khóa Học Mới' : 'Cập Nhật Chương Trình Học'}
            </h3>
            <button type="button" onClick={() => setEditingCourse(null)} className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            {/* Title */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Tên lớp học / Khóa đào tạo <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Đào tạo AI ứng dụng trong marketing..."
                value={editingCourse.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-650 uppercase">Đường dẫn khóa học (Slug)</label>
              <input
                type="text"
                required
                value={editingCourse.slug || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, slug: e.target.value })}
                className="w-full bg-slate-50 border border-slate-250 rounded-lg p-2 text-xs font-mono text-blue-700 focus:outline-none"
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Đối tượng mục tiêu</label>
              <input
                type="text"
                placeholder="Ví dụ: Cá nhân kinh doanh, Marketers..."
                value={editingCourse.target_audience || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, target_audience: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Price text */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Học phí hiển thị</label>
              <input
                type="text"
                placeholder="Ví dụ: 1.500.000đ / khóa hoặc Thỏa thuận..."
                value={editingCourse.price_text || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, price_text: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-650 uppercase">Thời lượng khóa học</label>
              <input
                type="text"
                placeholder="Ví dụ: 4 buổi (Online và Offline)..."
                value={editingCourse.duration || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Format */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Hình thức học tập</label>
              <input
                type="text"
                placeholder="Ví dụ: Online Zoom / Hướng dẫn trực tiếp..."
                value={editingCourse.format || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, format: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Image url */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Ảnh bìa (Image URL)</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={editingCourse.image_url || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, image_url: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Status */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-600 uppercase">Trạng thái tuyển sinh</label>
              <select
                value={editingCourse.status || 'coming_soon'}
                onChange={(e) => setEditingCourse({ ...editingCourse, status: e.target.value as any })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              >
                <option value="coming_soon">Sắp có lịch học / Đặt lịch hẹn (Coming Soon)</option>
                <option value="available">Đang mở tuyển sinh / Có lớp (Available)</option>
                <option value="hidden">Tạm ẩn (Hidden)</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[10px] font-bold text-slate-650 uppercase">Mô tả nội dung tổng quan lớp học</label>
              <textarea
                rows={3}
                placeholder="Học cách làm chủ Gemini và ChatGPT để lên kịch bản viết bài tự động..."
                value={editingCourse.description || ''}
                onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs focus:outline-none"
              />
            </div>

            {/* Curriculum syllabus dynamic list */}
            <div className="col-span-1 md:col-span-2 border border-slate-100 p-3 rounded-xl bg-slate-50 space-y-2">
              <label className="block text-[10px] font-bold text-slate-600 tracking-wider">CHƯƠNG TRÌNH / LỘ TRÌNH BUỔI HỌC ({editingCourse.curriculum?.length || 0})</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ví dụ: Buổi 1 - Tổng quan về prompt mẫu..."
                  value={curriculumInput}
                  onChange={(e) => setCurriculumInput(e.target.value)}
                  className="bg-white border border-slate-250 rounded-lg p-1.5 text-xs flex-1 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!curriculumInput.trim()) return;
                    const oCurrs = editingCourse.curriculum || [];
                    setEditingCourse({ ...editingCourse, curriculum: [...oCurrs, curriculumInput.trim()] });
                    setCurriculumInput('');
                  }}
                  className="px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Thêm buổi
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {(editingCourse.curriculum || []).map((cr, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white border border-slate-195 px-2 py-1 rounded text-[10px] text-slate-750 font-sans">
                    <span>{cr}</span>
                    <button
                      type="button"
                      onClick={() => setEditingCourse({ ...editingCourse, curriculum: (editingCourse.curriculum || []).filter((_, i) => i !== idx) })}
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
              Lưu chương trình học
            </button>
            <button
              type="button"
              onClick={() => setEditingCourse(null)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-xs text-slate-400">Đang đồng bộ lớp học...</div>
          ) : courses.length === 0 ? (
            <div className="col-span-3 p-12 bg-white border border-slate-200 rounded-xl text-center text-slate-400 text-xs font-semibold animate-fade-in">
              Chưa thiết lập chương trình đào tạo nào. Bấm "Mở khóa học mới".
            </div>
          ) : (
            courses.map(course => (
              <div key={course.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow animate-fade-in">
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img src={course.image_url || 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80'} alt={course.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className={`absolute top-3 right-3 font-bold text-[9px] px-2 py-0.5 rounded text-white shadow ${
                      course.status === 'available' ? 'bg-green-500' : 'bg-slate-500'
                    }`}>
                      {course.status === 'available' ? 'Đang mở' : 'Sắp diễn ra'}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-display font-bold text-slate-900 text-sm line-clamp-2 leading-snug">{course.title}</h4>
                    <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">{course.description || 'Không có mô tả chi tiết.'}</p>
                    <div className="text-[10px] text-slate-400 font-medium font-mono">Thời lượng: {course.duration || 'N/A'} &bull; Dạng: {course.format}</div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingCourse(course);
                      setIsNew(false);
                    }}
                    className="p-1 px-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 size={11} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
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
