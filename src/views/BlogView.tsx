import React, { useState } from 'react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../data';
import { Clock, ArrowLeft, Send, ChevronRight, HelpCircle, User } from 'lucide-react';

interface BlogViewProps {
  navigate: (path: string) => void;
  setPreFilledForm: (data: { service: string; requestType: 'quote' | 'interest' | 'consult' }) => void;
}

export default function BlogView({ navigate, setPreFilledForm }: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleBack = () => {
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleArticleClick = (post: BlogPost) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCtaClick = (categoryName: string) => {
    setPreFilledForm({
      service: categoryName,
      requestType: 'consult'
    });
    navigate('/nhan-bao-gia');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  if (selectedPost) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-8 animate-fade-in">
        {/* Back navigation */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E73FF] hover:text-blue-700 cursor-pointer transition-colors border-0 bg-transparent p-0"
        >
          <ArrowLeft size={14} />
          Quay lại danh mục tin tức
        </button>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-slate-500 text-xs font-mono">
            <span className="text-[#1E73FF] uppercase font-bold tracking-wider">{selectedPost.category}</span>
            <span>&bull;</span>
            <span>{selectedPost.date}</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {selectedPost.readTime}
            </span>
          </div>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-900 leading-tight">
            {selectedPost.title}
          </h1>

          <div className="flex items-center space-x-2 pt-2 pb-4 border-b border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs uppercase">
              WA
            </div>
            <div className="text-xs">
              <p className="text-slate-850 font-bold">whale sea</p>
              <p className="text-slate-500">Solo Founder & Freelance Guild</p>
            </div>
          </div>
        </div>

        {/* Article Image Banner */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200">
          <img
            referrerPolicy="no-referrer"
            src={selectedPost.image}
            alt={selectedPost.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="text-slate-700 text-sm leading-relaxed space-y-6 whitespace-pre-wrap font-sans">
          {selectedPost.content}
        </div>

        {/* Author Call to Action */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 mt-12 text-center shadow-sm">
          <h3 className="font-display font-bold text-slate-900 text-base">
            Xây dựng nền tảng tiếp thị số vững vàng cho dự án của bạn?
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed max-w-xl mx-auto">
            Tại whale sea, chúng tôi lập trình trực tiếp các mã theo dõi đo lường, thiết kế website wordpress/landing page chuyển đổi, tối ưu ngân sách quảng cáo bám sát với thực trạng kinh tế nhỏ.
          </p>
          <button
            onClick={() => handleCtaClick(selectedPost.category)}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#1E73FF] to-[#22C7F5] hover:opacity-95 cursor-pointer transition-all inline-flex items-center gap-1.5 border-0"
          >
            Đăng ký tư vấn trực tiếp theo chủ đề
            <Send size={12} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-12">
      {/* Page Title */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#1E73FF]/10 text-[#1E73FF] border border-[#1E73FF]/15">
          BLOG & CẨM NANG
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
          Kiến Thức Thực Chiến Cho Doanh Nghiệp Nhỏ
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
          Nơi tổng hợp các bài chia sẻ kỹ năng thiết kế, tối ưu hóa đo lường GA4/Ads, viết câu lệnh Prompt AI thực chiến trực tiếp từ Solo Founder whale sea.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.id}
            onClick={() => handleArticleClick(post)}
            className="bg-white border border-slate-205 hover:border-slate-300 rounded-2xl overflow-hidden group cursor-pointer transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            <div>
              {/* Image banner */}
              <div className="aspect-video w-full overflow-hidden relative">
                <img
                  referrerPolicy="no-referrer"
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-103 duration-300 transition-transform"
                />
                <span className="absolute bottom-2.5 left-2.5 text-[9px] font-bold tracking-wider font-mono uppercase bg-slate-900/95 text-white border border-transparent px-2 py-0.5 rounded">
                  {post.category}
                </span>
              </div>

              {/* Text content details */}
              <div className="p-5 space-y-3">
                <div className="flex gap-4 items-center text-[10px] text-slate-405 font-semibold font-mono">
                  <span>{post.date}</span>
                  <span>&bull;</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-display font-bold text-slate-800 text-sm sm:text-base group-hover:text-[#1E73FF] leading-snug transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Read action trigger */}
            <div className="p-5 pt-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleArticleClick(post);
                }}
                className="text-xs text-[#1E73FF] font-semibold group-hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0"
              >
                Đọc bài viết chi tiết
                <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
