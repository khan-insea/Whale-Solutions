import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, Check, Code, Sparkles, Target, ExternalLink, ShieldCheck } from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '../data';
import { ProjectItem } from '../types';

interface ProjectsViewProps {
  navigate: (path: string) => void;
  setPreFilledForm: (data: { service: string; requestType: 'quote' | 'interest' | 'consult' }) => void;
}

export default function ProjectsView({ navigate, setPreFilledForm }: ProjectsViewProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Update active main view image whenever selected project changes
  useEffect(() => {
    if (selectedProject) {
      setActiveImage(selectedProject.image);
    }
  }, [selectedProject]);

  const handleSimulateClick = (projectTitle: string) => {
    setPreFilledForm({
      service: projectTitle,
      requestType: 'quote'
    });
    navigate('/nhan-bao-gia');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectProject = (project: ProjectItem) => {
    setSelectedProject(project);
    setActiveImage(project.image);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBack = () => {
    setSelectedProject(null);
    setActiveImage(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // If a project is selected render the subpage
  if (selectedProject) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-12" id="project-detail-subpage">
        {/* Back navigation panel */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#1E73FF] text-xs font-semibold bg-transparent border-0 cursor-pointer p-0 select-none group"
            id="back-to-projects-list-btn"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
            Quay lại danh sách dự án
          </button>

          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
            CASE STUDY DETAILED
          </span>
        </div>

        {/* Hero title & main summary specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1E73FF]/10 text-[#1E73FF] border border-[#1E73FF]/15 uppercase tracking-wide">
              {selectedProject.category}
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight leading-tight">
              {selectedProject.title}
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
              {selectedProject.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {selectedProject.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-mono rounded border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {selectedProject.websiteUrl && (
              <div className="pt-2">
                <a
                  href={selectedProject.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  referrerPolicy="no-referrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1E73FF] hover:bg-blue-600 transition-colors shadow-sm cursor-pointer border-0"
                >
                  Ghé thăm website thực tế
                  <ExternalLink size={13} />
                </a>
              </div>
            )}
          </div>

          {/* Results check card */}
          {selectedProject.results && (
            <div className="lg:col-span-12 xl:col-span-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/10 text-emerald-600 rounded">
                  <ShieldCheck size={16} />
                </div>
                <h3 className="font-display font-bold text-emerald-800 text-sm">
                  Hiệu quả đo lượng thực tế
                </h3>
              </div>
              <ul className="space-y-3">
                {selectedProject.results.map((res, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="p-0.5 bg-emerald-500 text-white rounded-full mt-0.5 shrink-0 flex items-center justify-center">
                      <Check size={8} />
                    </span>
                    <span className="font-medium">{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Gallery interactive showcase: Around 5 images customizable previewer */}
        <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm" id="interactive-photos-gallery">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-display font-bold text-slate-900 text-sm flex items-center gap-1.5 justify-center sm:justify-start">
              📸 Thư viện ảnh chi tiết giao diện & tư liệu tham khảo
            </h3>
            <p className="text-slate-500 text-[11px]">
              Dự án sở hữu 5 ảnh minh họa cụ thể. Nhấp vào ảnh thumbnail nhỏ để chuyển tầm xem kích thước lớn bên trái.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Enlarged dynamic photo view */}
            <div className="md:col-span-9 aspect-video relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
              <img
                src={activeImage || selectedProject.image || undefined}
                alt={selectedProject.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-1 rounded">
                Giao diện thực tế của dự án
              </div>
            </div>

            {/* Alternating choice gallery */}
            <div className="md:col-span-3 flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-none md:max-h-[360px] pb-2 md:pb-0 scrollbar-thin">
              {selectedProject.gallery?.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative flex-shrink-0 w-24 h-16 md:w-full md:h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                    activeImage === imgUrl ? 'border-[#1E73FF] scale-102 shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Show image ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`Preview catalog ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-slate-900/90 text-white text-[8px] font-semibold px-1 py-0.5 rounded">
                     Ảnh #{idx + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Challenge, solution, execution metrics blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          {/* Challenge detailed panel */}
          {selectedProject.challenge && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500" />
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-500/10 text-rose-600 rounded-xl">
                  <Target size={18} />
                </div>
                <h2 className="font-display font-extrabold text-[#1E73FF] text-base uppercase">
                  1. Thách thức cốt lõi ban đầu
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {selectedProject.challenge}
              </p>
            </div>
          )}

          {/* Solution detailed panel */}
          {selectedProject.solution && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                  <Sparkles size={18} />
                </div>
                <h2 className="font-display font-extrabold text-[#1E73FF] text-base uppercase">
                  2. Giải pháp may đo từ Whale
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {selectedProject.solution}
              </p>
            </div>
          )}
        </div>

        {/* Detailed implementation report */}
        {selectedProject.details && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm relative">
            <h3 className="font-display font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Code size={18} className="text-[#1E73FF]" />
              Chi tiết triển khai kỹ thuật & Vận hành:
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {selectedProject.details}
            </p>
          </div>
        )}

        {/* Subpage CTA banner */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-[radial-gradient(circle_at_top_right,rgba(30,115,255,0.15),transparent_40%)] pointer-events-none" />
          <h2 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl max-w-2xl mx-auto leading-tight">
            Bạn muốn thiết lập hệ thống chuyển đổi tương tự dự án này?
          </h2>
          <p className="text-slate-350 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Chúng tôi sẵn sàng điều chỉnh, thiết lập và tích hợp theo đặc thù sản phẩm kinh doanh của riêng bạn nhằm tối thiểu hóa chi phí vận hành mà vẫn thu được data lượng lead cực kỳ dồi dào.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <button
              onClick={() => handleSimulateClick(selectedProject.title)}
              className="px-6 py-3 rounded-xl text-xs font-bold bg-[#1E73FF] hover:bg-blue-600 text-white transition-all hover:scale-103 shadow-lg shadow-blue-500/25 border-0 cursor-pointer text-center w-full sm:w-auto"
            >
              Tôi muốn làm dự án tương tự
            </button>
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 cursor-pointer text-center w-full sm:w-auto"
            >
              Xem các dự án mẫu khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render full Projects list overview
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-16">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#1E73FF]/10 text-[#1E73FF] border border-[#1E73FF]/15">
          HỒ SƠ KHÁCH HÀNG
        </span>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight">
          Các Dự Án Mẫu Đã Triển Khai
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
          Được thiết kế tinh tế riêng cho doanh nghiệp nhỏ và cá nhân kinh doanh để tối ưu hóa tỷ lệ chuyển đổi, nâng cao doanh thu. Hãy nhấp chọn xem chi tiết từng trang dự án để tham khảo trực quan!
        </p>
      </div>

      {/* Grid Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PORTFOLIO_PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-slate-350 transition-all flex flex-col md:flex-row group shadow-sm"
          >
            {/* Image banner covers */}
            <div
              onClick={() => handleSelectProject(proj)}
              className="relative w-full md:w-2/5 aspect-square md:aspect-auto min-h-[220px] overflow-hidden cursor-pointer"
            >
              <img
                referrerPolicy="no-referrer"
                src={proj.image}
                alt={proj.title}
                className="object-cover w-full h-full group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-slate-900/95 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded font-mono">
                MẪU THỰC TẾ
              </div>
              <div className="absolute bottom-3 left-3 bg-[#1E73FF] text-white text-[9px] font-bold px-2 py-1 rounded shadow-md opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Xem chi tiết
                <ArrowUpRight size={10} />
              </div>
            </div>

            {/* Information overview summaries */}
            <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <button
                  onClick={() => handleSelectProject(proj)}
                  className="text-[10px] mt-0 text-left bg-transparent border-0 cursor-pointer p-0 block"
                >
                  <span className="inline-block uppercase font-bold tracking-wider font-sans text-[#1E73FF] bg-[#1E73FF]/5 border border-[#1E73FF]/15 px-2 py-0.5 rounded">
                    {proj.category}
                  </span>
                </button>
                
                <h3
                  onClick={() => handleSelectProject(proj)}
                  className="font-display font-bold text-slate-900 text-base sm:text-lg group-hover:text-[#1E73FF] transition-colors leading-snug cursor-pointer text-left"
                >
                  {proj.title}
                </h3>
                
                <p className="text-slate-500 text-xs leading-relaxed">
                  {proj.description}
                </p>
              </div>

              {/* Badges footer tags & micro CTAs buttons */}
              <div className="space-y-4 pt-3 border-t border-slate-100">
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-mono rounded border border-slate-100">
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSelectProject(proj)}
                    className="py-2.5 rounded-xl text-[11px] font-bold text-center text-[#1E73FF] bg-[#1E73FF]/5 hover:bg-[#1E73FF] hover:text-white transition-all cursor-pointer border-0"
                  >
                    Xem chi tiết
                  </button>
                  
                  <button
                    onClick={() => handleSimulateClick(proj.title)}
                    className="py-2.5 rounded-xl text-[11px] font-bold text-center text-slate-700 bg-slate-50 border border-slate-200 hover:bg-[#1E73FF]/5 hover:text-[#1E73FF] hover:border-[#1E73FF]/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    Làm tương tự
                    <ArrowUpRight size={11} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Quote informational block */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center max-w-3xl mx-auto space-y-4 shadow-sm" id="custom-consulting-request-block">
        <h3 className="font-display font-bold text-slate-900 text-sm">
          💡 Bạn muốn sở hữu giải pháp thiết kế riêng biệt và hiệu chuẩn đo lường tối ưu nhất?
        </h3>
        <p className="text-slate-600 text-xs leading-relaxed max-w-xl mx-auto">
          Mỗi doanh nghiệp đều có đặc tính sản phẩm và nhóm khách hàng mục tiêu riêng biệt. Hãy chia sẻ sơ khai dự án, chúng tôi sẽ phác thảo giải pháp và báo phí chi li nhất phù hợp ngân sách của bạn.
        </p>
        <button
          onClick={() => {
            navigate('/nhan-bao-gia');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
          className="text-[#1E73FF] hover:text-blue-700 text-xs font-semibold inline-flex items-center gap-1 bg-transparent border-0 cursor-pointer transition-colors p-0"
        >
          Nhận biểu mẫu khảo sát dự án thiết kế riêng
          <ArrowUpRight size={12} className="ml-1" />
        </button>
      </div>
    </div>
  );
}
