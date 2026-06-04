import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, HelpCircle, BadgeAlert, Sparkles, GraduationCap } from 'lucide-react';

interface TrainingViewProps {
  navigate: (path: string) => void;
  setPreFilledForm: (data: { service: string; requestType: 'quote' | 'interest' | 'consult' }) => void;
}

export default function TrainingView({ navigate, setPreFilledForm }: TrainingViewProps) {
  const handleInterestClick = (courseName: string) => {
    setPreFilledForm({
      service: `Khóa học: ${courseName}`,
      requestType: 'interest'
    });
    navigate('/nhan-bao-gia');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const initialCourses = [
    { name: 'Khóa học AI ứng dụng doanh nghiệp', duration: '4 buổi', desc: 'Sử dụng AI tự động hóa quy trình chuẩn soạn nội dung và lên kế hoạch marketing thực tế.' },
    { name: 'Khóa học ChatGPT/Gemini thực chiến', duration: '3 buổi', desc: 'Khai thác tối đa năng lực mô hình lớn để tối ưu hiệu suất công việc văn phòng.' },
    { name: 'Khóa học viết prompt kỹ năng cao', duration: '2 buổi', desc: 'Học cách thiết kế câu lệnh có cấu trúc chuẩn xác để lập trình bot phản hồi đúng ý 100%.' },
    { name: 'Khóa học thiết kế Website cơ bản', duration: '6 buổi', desc: 'Tự tay thiết kế và vận hành website WordPress/Vercel không cần chạm một dòng code.' },
    { name: 'Khóa học thiết kế Landing page chuyển đổi', duration: '4 buổi', desc: 'Sáng tạo bố cục, viết tiêu đề copywriting đắt giá để tăng nhân tố thu số điện thoại.' },
    { name: 'Khóa học chạy quảng cáo cơ bản', duration: '5 buổi', desc: 'Thực hành setup chiến dịch Google, Facebook, đo lường chi phí hiệu quả, cấu hình pixel.' },
    { name: 'Khóa học Content marketing căn bản', duration: '4 buổi', desc: 'Nghệ thuật lên luồng ý tưởng, viết bài chuẩn SEO, viết content Ads thu hút khách hàng.' },
    { name: 'Khóa học Canva thiết kế visual mượt', duration: '3 buổi', desc: 'Kỹ năng thiết kế banner, slide, ảnh đăng feed nhanh chóng, đồng bộ màu sắc thương hiệu.' },
    { name: 'Khóa học Automation marketing đơn giản', duration: '4 buổi', desc: 'Tự động đồng bộ leads từ biểu mẫu web về sheets, gửi tin nhắn zalo hàng loạt tự động.' },
    { name: 'Khóa học Quản trị fanpage bán hàng', duration: '4 buổi', desc: 'Quy chuẩn lên schedule bài đăng chăm sóc fanpage, xử lý phản hồi bình luận chuyên nghiệp.' },
    { name: 'Khóa học Công cụ số cho doanh nghiệp', duration: '4 buổi', desc: 'Tích hợp các tool số hiện lượng cao giúp quản lý công việc nhóm, lưu trữ dữ liệu an toàn.' }
  ];

  const [coursesList, setCoursesList] = useState(initialCourses);

  useEffect(() => {
    fetch('/api/public?resource=courses')
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((item: any) => ({
            name: item.title,
            duration: item.duration || '4 buổi',
            desc: item.description
          }));
          setCoursesList(mapped);
        }
      })
      .catch(err => console.error('Error fetching public courses:', err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-12">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#1E73FF]/10 text-[#1E73FF] border border-[#1E73FF]/15">
          ĐÀO TẠO THỰC CHIẾN
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
          Các Khóa Học Ngắn Hạn Đang Xây Dựng
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
          Đào tạo kỹ năng thực nghiệm cầm tay chỉ việc, bám sát các dự án thực tế. Đơn giản, dễ hiểu, thực hành và áp dụng tạo ra sản phẩm được ngay trong lớp học.
        </p>
      </div>

      {/* Info warning */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-3xl mx-auto text-center space-y-3 shadow-inner">
        <p className="text-[#1E73FF] text-xs font-semibold leading-relaxed">
          “Các khóa học ngắn hạn đang được whale sea xây dựng nội dung chi tiết. Bạn có thể đăng ký quan tâm dưới đây để nhận lịch học và mã ưu đãi giảm 30% học phí khi mở lớp.”
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {coursesList.map((course) => (
          <div
            key={course.name}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-350 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold text-[#1E73FF] bg-[#1E73FF]/5 border border-[#1E73FF]/15 px-2 py-0.5 rounded font-mono">
                  {course.duration}
                </span>
                <span className="text-[9px] font-bold uppercase text-amber-700 bg-amber-50 border border-amber-250/50 px-2 py-0.5 rounded font-sans">
                  Sắp ra mắt
                </span>
              </div>

              <h3 className="font-display font-bold text-slate-805 text-sm group-hover:text-[#1E73FF] transition-colors">
                {course.name}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed mt-2.5">
                {course.desc}
              </p>
            </div>

            <button
              onClick={() => handleInterestClick(course.name)}
              className="w-full py-2.5 bg-slate-50 hover:bg-[#1E73FF] border border-slate-200 hover:border-transparent rounded-xl text-slate-700 hover:text-white text-xs font-semibold text-center mt-6 transition-all cursor-pointer flex items-center justify-center gap-1.5 p-0 shadow-sm"
            >
              <GraduationCap size={14} />
              Đăng ký nhận lịch học
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
