import React, { useState, useEffect } from 'react';
import { Sparkles, Check, AlertCircle, ArrowRight, Heart, HelpCircle, ChevronDown, Plus, Trash2, ExternalLink, ArrowUpRight, Folder, Image as ImageIcon, Save, PlusCircle, Sparkle, ArrowLeft, Send, CheckCircle2, Award, Calendar, Globe2, User } from 'lucide-react';
import { SERVICE_GROUPS } from '../data';
import { ServiceStatus, ServiceItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesViewProps {
  navigate: (path: string) => void;
  setPreFilledForm: (data: { service: string; requestType: 'quote' | 'interest' | 'consult' }) => void;
}

interface CustomProject {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  image: string;
  websiteUrl: string;
  results: string[];
  clientName: string;
  year: string;
  status: string;
}

const IMAGE_PRESETS = [
  { name: 'Website', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80' },
  { name: 'Landing Page', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80' },
  { name: 'Đo lường / GTM', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80' },
  { name: 'Quảng cáo / Cafe', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=500&q=80' }
];

const initialCustomProjects: CustomProject[] = [
  {
    id: 'seed-1',
    serviceId: 'web-1', // WordPress
    title: 'Website Giới Thiệu Nha Khoa Minh Khai',
    description: 'Thiết kế giao diện WordPress hiện đại, chuẩn SEO với tính năng đăng ký lịch hẹn khám thông minh, tối ưu tốc độ tải trang.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=500&q=80',
    websiteUrl: 'https://nhakhoaminhkhai.vn',
    clientName: 'Nha khoa Quốc tế Minh Khai',
    year: '2023',
    status: 'Hoàn thành',
    results: [
      'Tải trang cải thiện vượt trội (Speed Index từ 8s xuống 1.8s)',
      'Tăng trưởng 75% lượng biểu mẫu đặt lịch thành công',
      'Tăng lượng hiển thị tìm kiếm tự nhiên thêm 45%'
    ]
  },
  {
    id: 'seed-2',
    serviceId: 'web-4', // Landing Page
    title: 'Landing Page Sách Hack Não Tiếng Anh',
    description: 'Trang landing page bán hàng áp dụng cấu trúc tâm lý học hành vi giúp thu hút leads đăng ký đột phá.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
    websiteUrl: 'https://hacknaotienganh-demo.whale.agency',
    clientName: 'Công ty Cổ phần Sách Ngoại Ngữ',
    year: '2023',
    status: 'Hoàn thành',
    results: [
      'Thu về hơn 3.200 số điện thoại và email chỉ trong 28 ngày',
      'Tăng tỷ lệ mua sách trực tiếp (CR đạt mức 8.5% so với 3.2% cũ)',
      'Gắn thẻ Pixel đo lường chi tiết hành vi cuộn trang'
    ]
  },
  {
    id: 'seed-3',
    serviceId: 'web-7', // Google Analytics
    title: 'Hệ Thống Đo Lường Cho Thời Trang Z-Studio',
    description: 'Cài đặt thẻ GTM và sửa lỗi lệch liên kết tracking GA4 cho thương hiệu dệt may Z-Studio.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
    websiteUrl: 'https://zstudio-fashion.vn',
    clientName: 'Xưởng may & Thiết kế Z-Studio',
    year: '2024',
    status: 'Hoàn thành',
    results: [
      'Khắc phục triệt để lỗi lệch dữ liệu, đưa sai số về dưới 3%',
      'Cấu hình phễu sự kiện thanh toán chi tiết từng bước',
      'Định vị thành công tệp khách sỉ có thời gian tương tác tốt'
    ]
  },
  {
    id: 'seed-4',
    serviceId: 'web-8', // Microsoft Clarity
    title: 'Phát hiện lỗi giỏ hàng Z-Studio qua nhiệt vi',
    description: 'Sử dụng công cụ Microsoft Clarity ghi hình thao tác nhiệt giúp phát hiện lỗi chết cản trở thanh toán.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80',
    websiteUrl: 'https://zstudio-fashion.vn',
    clientName: 'Z-Studio Brand',
    year: '2024',
    status: 'Hoàn thành',
    results: [
      'Phát hiện và loại bỏ 2 lỗi chết tải nút mua trên giao diện Safari',
      'Cải thiện hiệu quả thanh toán trực tiếp thêm 12%'
    ]
  },
  {
    id: 'seed-5',
    serviceId: 'web-9', // Meta Pixel
    title: 'Cấu hình Facebook Conversion API Z-Studio',
    description: 'Gắn tracking Meta Pixel đo lường sự kiện nâng cao cuộn trang và ghim nút CTA bám đuổi chân màn hình.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80',
    websiteUrl: 'https://zstudio-fashion.vn',
    clientName: 'Z-Studio Fashion Outlet',
    year: '2024',
    status: 'Hoàn thành',
    results: [
      'Tiết kiệm khoảng 15% chi phí thô bằng cách loại trừ leads ảo',
      'Đồng bộ hoàn chỉnh Conversion API từ máy chủ'
    ]
  },
  {
    id: 'seed-6',
    serviceId: 'mkt-3', // Quản lý fanpage
    title: 'Content & Ads Cho Chuỗi Cafe Vintage',
    description: 'Kế hoạch content hoài cổ retro đồng bộ kết hợp chụp góc cà phê mộc mạc làm chất liệu truyền thông.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=500&q=80',
    websiteUrl: 'https://vintagecafe.whale.agency',
    clientName: 'Xưởng Cafe Hoài Cổ Vintage',
    year: '2023',
    status: 'Hoàn thành',
    results: [
      'Số lượng tương tác tự nhiên (Organic Reach) tăng vọt 210%',
      'Tiết kiệm 35% chi phí quảng cáo hiển thị nhờ điểm tương tác cao',
      'Quán luôn chật kín bàn vào dịp cuối tuần bằng tối ưu Maps'
    ]
  },
  {
    id: 'seed-7',
    serviceId: 'mkt-9', // Facebook Ads
    title: 'Setup quảng cáo Cafe Vintage target bán kính',
    description: 'Setup chiến dịch ads định vị chuẩn khách quanh bán kính 3km của cơ sở, tối ưu ngân sách tối đa.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80',
    websiteUrl: 'https://vintagecafe.whale.agency',
    clientName: 'Chủ chuỗi Cafe Vintage',
    year: '2023',
    status: 'Hoàn thành',
    results: [
      'Định hướng tỷ lệ click chuột (CTR) đạt mốc ngất ngưởng 6.8%',
      'Quán hoạt động đầy tải công suất bàn ngoài giờ hành chính'
    ]
  },
  {
    id: 'seed-8',
    serviceId: 'sol-11', // Zalo Mini App
    title: 'Zalo Mini App & Loyalty Nhà Hàng Sen Vàng',
    description: 'Ứng dụng mini app tích hợp quét mã QR tại bàn, tự động hóa thăng hạng thành viên và tích điểm ZNS.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80',
    websiteUrl: 'https://sen-vang-restaurant.whale.agency',
    clientName: 'Nhà hàng Ẩm thực Sen Vàng',
    year: '2024',
    status: 'Hoàn thành',
    results: [
      'Thu hút hơn 4.200 thực khách kích hoạt làm hội viên',
      'Đóng góp nâng tỷ lệ thực khách quay lại nhà hàng thêm 42%',
      'Cắt giảm đến 85% chi phí gửi tin chăm sóc truyền thống'
    ]
  }
];

export default function ServicesView({ navigate, setPreFilledForm }: ServicesViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'coming_soon'>('all');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  const [serviceGroups, setServiceGroups] = useState(SERVICE_GROUPS);

  // Fetch updated services list from dynamic backend API
  useEffect(() => {
    fetch('/api/public/services')
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setServiceGroups(res.data);
        }
      })
      .catch(err => console.error('Error fetching public services in ServicesView:', err));
  }, []);
  
  // Custom projects list (loaded from localStorage or seeded)
  const [customProjects, setCustomProjects] = useState<CustomProject[]>(() => {
    const saved = localStorage.getItem('whale_services_completed_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing projects', e);
      }
    }
    return initialCustomProjects;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('whale_services_completed_projects', JSON.stringify(customProjects));
  }, [customProjects]);

  // Form fields state for adding a project
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjImage, setNewProjImage] = useState('');
  const [newProjUrl, setNewProjUrl] = useState('');
  const [newProjResult, setNewProjResult] = useState('');
  const [newProjClient, setNewProjClient] = useState('');
  const [newProjYear, setNewProjYear] = useState('2026');
  const [newProjStatus, setNewProjStatus] = useState('Hoàn thành');

  const resetForm = () => {
    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjImage('');
    setNewProjUrl('');
    setNewProjResult('');
    setNewProjClient('');
    setNewProjYear('2026');
    setNewProjStatus('Hoàn thành');
  };

  // Save new custom projects
  const handleSaveProject = (serviceId: string) => {
    if (!newProjTitle.trim() || !newProjDesc.trim()) {
      alert('Vui lòng điền đủ Tên dự án và Mô tả.');
      return;
    }

    const splitResults = newProjResult
      ? newProjResult.split(',').map((res) => res.trim()).filter(Boolean)
      : [];

    const newProject: CustomProject = {
      id: `custom-${Date.now()}`,
      serviceId,
      title: newProjTitle.trim(),
      description: newProjDesc.trim(),
      image: newProjImage.trim() || IMAGE_PRESETS[0].url,
      websiteUrl: newProjUrl.trim(),
      results: splitResults,
      clientName: newProjClient.trim() || 'Khách hàng ẩn danh',
      year: newProjYear || '2026',
      status: newProjStatus || 'Hoàn thành'
    };

    setCustomProjects((prev) => [newProject, ...prev]);
    setShowAddForm(false);
    resetForm();
  };

  // Delete a project
  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc muốn xóa dự án này khỏi danh mục mẫu không?')) {
      setCustomProjects((prev) => prev.filter((p) => p.id !== projectId));
    }
  };

  // Flat list of services mapped to parents
  const allServicesWithParent = serviceGroups.flatMap(group => {
    return (group.services || []).map(srv => {
      const isGrpComingSoon = group.status === 'coming_soon';
      const actualStatus = srv.status === 'coming_soon' || isGrpComingSoon ? 'coming_soon' : 'available';
      
      // Compute "Phù hợp với ai" based on groups
      let targetAudience = 'Doanh nghiệp nhỏ, cửa hàng kinh doanh';
      if (group.id === 'group-1') {
        targetAudience = 'Cửa hàng, startup cần bộ mặt trực tuyến chuẩn SEO';
      } else if (group.id === 'group-2') {
        targetAudience = 'Hộ kinh doanh muốn tìm kiếm leads số điện thoại chất lượng';
      } else if (group.id === 'group-3') {
        targetAudience = 'Chủ shop bận rộn không có thời gian viết bài hoặc biên tập';
      } else if (group.id === 'group-4') {
        targetAudience = 'Cá nhân muốn tự động hóa, tăng 3-5 lần hiệu quả năng suất';
      } else if (group.id === 'group-5') {
        targetAudience = 'SME muốn quản trị vận hành, check-in, lưu trữ data an toàn';
      } else if (group.id === 'group-6') {
        targetAudience = 'Hộ cá thể, sinh viên, nhân viên cần bổ sung kỹ năng thực chiến';
      } else if (group.id === 'group-7') {
        targetAudience = 'Chủ nhà hàng, shop thời trang, sự kiện bán lẻ';
      } else if (group.id === 'group-8') {
        targetAudience = 'Doanh nghiệp khai trương cơ sở, ra mắt kỉ niệm hoặc tri ân';
      } else if (group.id === 'group-9') {
        targetAudience = 'Doanh nghiệp nhỏ cần đồng bộ quy tắc và chiến lược lâu dài';
      }

      // Compute description if empty
      let computedDesc = srv.description || `Đóng gói dịch vụ thuộc phân hệ ${group.title}.`;
      if (srv.status === 'coming_soon') {
        computedDesc = srv.isComingSoonNote || group.note || 'Dịch vụ này đang được whale sea phát triển và sẽ mở nhận trong thời gian tới. Bạn có thể đăng ký quan tâm để được thông báo khi ra mắt.';
      }

      return {
        ...srv,
        status: actualStatus as ServiceStatus,
        groupTitle: group.title,
        groupId: group.id,
        targetAudience,
        description: computedDesc
      };
    });
  });

  // Filter based on selected tab
  const filteredServices = allServicesWithParent.filter(srv => {
    if (activeTab === 'all') return true;
    return srv.status === activeTab;
  });

  const handleAction = (serviceName: string, status: ServiceStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPreFilledForm({
      service: serviceName,
      requestType: status === 'available' ? 'quote' : 'interest'
    });
    navigate('/nhan-bao-gia');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenSubPage = (srvId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedServiceId(srvId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find currently selected service details for the sub-page
  const selectedService = allServicesWithParent.find(s => s.id === selectedServiceId);
  const selectedServiceProjects = selectedService && selectedService.status === 'available'
    ? customProjects.filter(p => p.serviceId === selectedService.id)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 space-y-12">
      <AnimatePresence mode="wait">
        {!selectedService ? (
          /* ================== MAIN GRID VIEW ================== */
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-12"
          >
            {/* Page Title */}
            <div className="text-center space-y-4 animate-fade-in">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-[#1E73FF]/10 text-[#1E73FF] border border-[#1E73FF]/15">
                ⭐ DANH MỤC GIẢI PHÁP SỐ
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight leading-tight">
                Danh Sách Dịch Vụ Đầy Đủ
              </h1>
              <p className="text-slate-605 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Khám phá hệ thống giải pháp của whale sea. Click nút <b>"Hồ sơ dự án"</b> bên cạnh nút nhận giá để xem chi tiết dự án thực tế & số liệu kiểm định tương ứng!
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex justify-center border-b border-slate-200 pb-1 max-w-md mx-auto">
              <div className="grid grid-cols-3 gap-1 bg-slate-100/85 p-1 rounded-xl border border-slate-200/60 w-full animate-fade-in">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'available', label: 'Đang nhận' },
                  { id: 'coming_soon', label: 'Sắp ra mắt' }
                ].map((tab) => {
                  const isTabActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-0 ${
                        isTabActive
                          ? 'bg-gradient-to-r from-[#1E73FF] to-[#22C7F5] text-white shadow-sm'
                          : 'text-slate-550 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Services Grid Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((srv) => {
                const isAvailable = srv.status === 'available';
                const srvProjects = isAvailable ? customProjects.filter((p) => p.serviceId === srv.id) : [];
                const hasProjects = srvProjects.length > 0;

                return (
                  <div
                    key={srv.id}
                    onClick={(e) => handleOpenSubPage(srv.id, e)}
                    className="group bg-white border border-slate-250/80 rounded-3xl overflow-hidden hover:border-[#1E73FF]/40 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer hover:-translate-y-0.5"
                  >
                    <div className="p-6 space-y-4 flex-grow">
                      {/* Badge Header status */}
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[10px] font-bold text-[#1E73FF] bg-[#1E73FF]/5 border border-[#1E73FF]/15 px-2.5 py-0.5 rounded">
                          {srv.groupTitle}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* Projects counter indicator badge */}
                          {isAvailable && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                              hasProjects
                                ? 'bg-blue-50 text-[#1E73FF] border-[#1E73FF]/20'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}>
                              📂 {srvProjects.length} dự án
                            </span>
                          )}
                          
                          {isAvailable ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-250/30 flex-shrink-0">
                              Đang nhận
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-50 text-amber-700 border border-amber-250/30 flex-shrink-0">
                              Sắp ra mắt
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Service Name & click guide */}
                      <div className="space-y-1">
                        <h3 className="font-display font-black text-slate-900 text-base group-hover:text-[#1E73FF] transition-colors leading-snug">
                          {srv.name}
                        </h3>
                        <span className="text-[10px] font-mono font-medium tracking-wide text-slate-400 block group-hover:text-slate-600 transition-colors uppercase">
                          ➔ Click xem chi tiết & dự án liên quan
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                        {srv.description}
                      </p>

                      {/* Suitability indicator */}
                      <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                        <span className="font-bold text-slate-700">Phù hợp: </span>
                        {srv.targetAudience}
                      </div>
                    </div>

                    {/* Action buttons side-by-side in footer as requested */}
                    <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50 flex gap-2" onClick={(e) => e.stopPropagation()}>
                      {isAvailable ? (
                        <>
                          <button
                            onClick={() => handleAction(srv.name, 'available')}
                            className="flex-1 py-2.5 rounded-xl text-[11px] font-bold text-center text-white bg-[#1E73FF] shadow-sm shadow-blue-500/10 hover:bg-blue-600 transition-colors cursor-pointer border-0 p-0 flex items-center justify-center gap-1"
                          >
                            Báo giá
                          </button>
                          
                          <button
                            onClick={(e) => handleOpenSubPage(srv.id, e)}
                            className="flex-1 py-2.5 rounded-xl text-[11px] font-bold text-center text-slate-700 bg-white border border-slate-250 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer p-0 flex items-center justify-center gap-1"
                          >
                            Dự án mẫu ({srvProjects.length})
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleAction(srv.name, 'coming_soon')}
                          className="w-full py-2.5 rounded-xl text-[11px] font-bold text-center text-amber-800 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 transition-colors cursor-pointer p-0 flex items-center justify-center gap-1"
                        >
                          Đăng ký nhận thông tin khi ra mắt
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12 text-slate-500 font-medium">
                Chưa tìm thấy giải pháp nào khớp với bộ lọc này.
              </div>
            )}
          </motion.div>
        ) : (
          /* ================== DETAILED SUB-PAGE VIEW ================== */
          <motion.div
            key="subpage"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-8 max-w-5xl mx-auto"
          >
            {/* Header Back bar similar to screenshot */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <button
                onClick={() => setSelectedServiceId(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors border-0 bg-transparent cursor-pointer p-0"
              >
                <ArrowLeft size={14} />
                Trở về danh sách dịch vụ
              </button>

              <span className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">
                Giải pháp: {selectedService.groupTitle}
              </span>
            </div>

            {/* Premium service title display */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-[#1E73FF] tracking-wider">
                  {selectedService.groupTitle}
                </span>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-500 tracking-wider">
                  QUY CHUẨN TỪ 2023
                </span>
                
                {selectedService.status === 'available' ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 tracking-wider">
                    ● Đang nhận dịch vụ
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 tracking-wider">
                    ● Đang thử nghiệm / Sắp ra mắt
                  </span>
                )}
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 tracking-tight leading-none leading-tight">
                {selectedService.name}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-4xl">
                {selectedService.description}
              </p>
            </div>

            {/* Quick Metadata Table like screenshot */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-250/60 text-slate-800">
              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Đơn vị cung cấp</p>
                <p className="text-xs font-black text-slate-950">whale sea Freelance Studio</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Danh mục kỹ thuật</p>
                <p className="text-xs font-black text-slate-950">{selectedService.groupTitle}</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Chu kỳ tối ưu</p>
                <p className="text-xs font-black text-slate-950">Tích hợp kiểm định bám sát</p>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Mức độ phù hợp</p>
                <p className="text-xs font-black text-slate-950">{selectedService.targetAudience}</p>
              </div>
            </div>

            {/* Actions sub-bar next to each other as requested */}
            <div className="flex flex-col sm:flex-row gap-3 bg-slate-900 text-white p-6 rounded-2xl sm:rounded-3xl shadow-lg items-center justify-between">
              <div className="space-y-1 flex-grow text-center sm:text-left">
                <h4 className="font-display font-bold text-sm text-amber-400 flex items-center justify-center sm:justify-start gap-1">
                  <Sparkles size={14} />
                  Nhận Tài liệu & File Giải Trình Phương Án
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed max-w-xl">
                  Để lại thông tin phác thảo ngắn gọn, whale sea cam kết phản hồi chi phí đúc kết giải pháp đầy đủ trong vòng tối đa 4 tiếng làm việc.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  onClick={() => handleAction(selectedService.name, selectedService.status)}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-center text-[#1E73FF] bg-white hover:bg-slate-50 transition-all cursor-pointer border-0 shadow-sm"
                >
                  YÊU CẦU BÁO GIÁ CHI TIẾT
                </button>

                {selectedService.status === 'available' && (
                  <button
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      if (!showAddForm) setNewProjImage(IMAGE_PRESETS[0].url);
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-center text-white bg-white/10 hover:bg-white/20 transition-all cursor-pointer border border-white/20"
                  >
                    {showAddForm ? 'HỦY BIỂU MẪU' : '➕ ĐÍNH KÈM SẢN PHẨM MẪU'}
                  </button>
                )}
              </div>
            </div>

            {/* Inline Project Addition Form if toggled */}
            {showAddForm && (
              <div className="bg-slate-50 border border-slate-250 p-6 rounded-2xl space-y-4 max-w-3xl mx-auto animate-fade-in shadow-inner">
                <div className="border-b border-slate-200 pb-2 flex items-center gap-2">
                  <PlusCircle size={16} className="text-emerald-500" />
                  <h5 className="font-display font-bold text-xs text-slate-800 uppercase tracking-widest text-[#1E73FF]">
                    Thêm Hồ Sơ Dự Án Do Bạn Đính Kèm Riêng
                  </h5>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Tên dự án *</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Landing page dịch vụ spa Thụy Sĩ"
                        value={newProjTitle}
                        onChange={(e) => setNewProjTitle(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Tên khách hàng / Đối tác</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Spa Minh Vy Thụy Sĩ"
                        value={newProjClient}
                        onChange={(e) => setNewProjClient(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Năm thực hiện</label>
                      <input
                        type="text"
                        placeholder="2026"
                        value={newProjYear}
                        onChange={(e) => setNewProjYear(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Đường dẫn website / demo link</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: https://spathuysi.example.com"
                        value={newProjUrl}
                        onChange={(e) => setNewProjUrl(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Mô tả ngắn gọn sản phẩm hoặc thách thức *</label>
                    <textarea
                      placeholder="Thiết kế chuẩn hành vi đột phá, ghim cụm nút CTA kết hợp biểu mẫu đổ dữ liệu về Google Sheets..."
                      rows={2}
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <p className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Ảnh dự án (Bấm để chọn ảnh mẫu hoặc tự điền liên kết ảnh)</p>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {IMAGE_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewProjImage(p.url)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            newProjImage === p.url ? 'border-[#1E73FF] scale-[1.02]' : 'border-slate-150 hover:border-slate-350'
                          }`}
                        >
                          <img src={p.url} className="w-full h-full object-cover" alt="" />
                          <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center py-0.5 leading-none font-bold">
                            {p.name}
                          </span>
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Hoặc dán URL liên kết ảnh của bạn vào đây..."
                      value={newProjImage}
                      onChange={(e) => setNewProjImage(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Tỷ lệ chuyển đổi / Kết quả đạt được (Cách nhau bởi dấu phẩy)</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Tăng 210% khách hàng mới, Đo lường chuyển đổi chính xác 100%, Giảm 35% chi phí Ads"
                      value={newProjResult}
                      onChange={(e) => setNewProjResult(e.target.value)}
                      className="w-full mt-1.5 px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveProject(selectedService.id)}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl transition-colors border-0 cursor-pointer flex items-center justify-center gap-1.5 select-none"
                >
                  <Save size={14} />
                  LƯU CHỨNG THỰC DỰ ÁN MẪU
                </button>
              </div>
            )}

            {/* List of completed projects in matching Screenshot style */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="font-display font-black text-slate-900 text-xl flex items-center gap-2">
                  <Folder size={20} className="text-[#1E73FF]" />
                  Dự án đã bàn giao & Hồ sơ thực nghiệm ({selectedServiceProjects.length})
                </h3>
                <p className="text-slate-500 text-xs mt-1">
                  Đồng bộ các số liệu và hình thái thực thi thuộc kỹ thuật: {selectedService.name}
                </p>
              </div>

              {selectedService.status === 'available' ? (
                selectedServiceProjects.length > 0 ? (
                  <div className="space-y-12">
                    {selectedServiceProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className="bg-white border border-slate-250 p-6 rounded-3xl block relative overflow-hidden shadow-sm hover:border-slate-300 transition-all duration-300 gap-6"
                      >
                        {/* Trash action button if custom added */}
                        {proj.id.startsWith('custom-') && (
                          <button
                            onClick={(e) => handleDeleteProject(proj.id, e)}
                            title="Xóa dự án"
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl border-y border-x border-transparent hover:border-slate-100 cursor-pointer transition-colors bg-white z-10"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}

                        {/* Split layout: Info details Left vs image card Right */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          {/* Information body logic */}
                          <div className="lg:col-span-8 space-y-4">
                            <div className="space-y-2">
                              {/* Badges */}
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[9px] font-extrabold uppercase bg-blue-50 text-[#1E73FF] px-2 py-0.5 rounded tracking-wide">
                                  {selectedService.groupTitle}
                                </span>
                                
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                                  Theo dõi từ năm {proj.year}
                                </span>
                              </div>

                              {/* Project Title */}
                              <h4 className="font-display font-black text-2xl text-slate-900 leading-tight">
                                {proj.title}
                              </h4>
                            </div>

                            {/* Horizontal Specific Metadata - matches exact screenshot layout labels */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3.5 border-y border-slate-100 text-slate-800">
                              <div>
                                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Khách hàng</p>
                                <p className="text-xs font-bold text-slate-900 mt-1">{proj.clientName || 'Nha khoa Minh Khai'}</p>
                              </div>

                              <div>
                                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Dịch vụ</p>
                                <p className="text-xs font-bold text-slate-900 mt-1">{selectedService.name}</p>
                              </div>

                              <div>
                                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Năm thực hiện</p>
                                <p className="text-xs font-bold text-slate-900 mt-1">{proj.year}</p>
                              </div>

                              <div>
                                <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Trạng thái</p>
                                <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                                  <CheckCircle2 size={12} className="text-emerald-500 fill-emerald-500/10 shrink-0" />
                                  {proj.status}
                                </p>
                              </div>
                            </div>

                            {/* Overview section matches Screenshot */}
                            <div className="space-y-2">
                              <h5 className="font-display font-extrabold text-[#1E73FF] text-[11px] uppercase tracking-widest font-mono">
                                Tổng quan dự án / Thách thức
                              </h5>
                              <p className="text-slate-600 text-xs leading-relaxed">
                                {proj.description}
                              </p>
                            </div>

                            {/* Numerical metrics achievement results */}
                            {proj.results && proj.results.length > 0 && (
                              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-2.5">
                                <h5 className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest font-mono flex items-center gap-1.5">
                                  <Sparkle size={10} className="text-emerald-600 shrink-0" />
                                  Hiệu quả đo lường thực tế đạt được:
                                </h5>
                                <ul className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {(proj.results || []).map((res, index) => (
                                    <li key={index} className="flex items-start gap-2 text-xs text-slate-800 font-medium font-sans">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                      <span>{res}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {proj.websiteUrl && (
                              <div className="pt-2">
                                <a
                                  href={proj.websiteUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  referrerPolicy="no-referrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-black text-[#1E73FF] hover:underline"
                                >
                                  Thao tác Website Demo thực tế
                                  <ExternalLink size={12} />
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Image asset card Right */}
                          <div className="lg:col-span-4 w-full h-44 sm:h-56 rounded-2xl overflow-hidden border border-slate-200">
                            <img
                              src={proj.image}
                              alt={proj.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover select-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                    Chưa có sản phẩm mẫu thuộc phân hệ này được đưa lên trực tiếp. Hãy nhấp "➕ Đính kèm sản phẩm mẫu" để tự đính kèm dự án demo!
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                  Dịch vụ này đang trong lộ trình phát triển và kiểm định chất lượng, sẽ sớm ra mắt tới quý khách hàng. Hồ sơ dự án mẫu và số liệu kiểm định thực tế sẽ được đăng tải ngay khi dự án chính thức hoạt động.
                </div>
              )}
            </div>

            {/* Quick footer action back inside subpage */}
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => setSelectedServiceId(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors border-0 bg-transparent cursor-pointer p-0"
              >
                <ArrowLeft size={14} />
                Quay lại danh mục đầy đủ
              </button>

              <button
                onClick={() => handleAction(selectedService.name, selectedService.status)}
                className="py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-[#1E73FF] hover:bg-blue-600 transition-colors cursor-pointer border-0 shadow-md"
              >
                Nhận báo giá giải pháp này
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
