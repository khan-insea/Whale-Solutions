import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Views
import HomeView from './views/HomeView';
import AboutView from './views/AboutView';
import ServicesView from './views/ServicesView';
import PricingView from './views/PricingView';
import ProjectsView from './views/ProjectsView';
import SolutionsView from './views/SolutionsView';
import TrainingView from './views/TrainingView';
import BlogView from './views/BlogView';
import ContactView from './views/ContactView';
import NhanBaoGiaView from './views/NhanBaoGiaView';
import AdminView from './views/AdminView';

// Icons for Floating buttons
import { Phone, MessageSquare, HelpCircle, ExternalLink, Calculator, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // Shared state to allow passing service choices to NhanBaoGiaView pre-fills
  const [preFilledForm, setPreFilledForm] = useState<{
    service: string;
    requestType: 'quote' | 'interest' | 'consult';
  }>({
    service: 'Website / Landing Page',
    requestType: 'quote'
  });

  // Simple and ultra-sturdy Router sync
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Soft navigation function
  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    // Custom triggering popstate
    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
    // Automatically reset scroll instantly
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Setup standard global intercept to handle plain <a> clicks with local relative paths!
  useEffect(() => {
    const handleAnchorLink = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (href && href.startsWith('/') && !href.startsWith('//')) {
          e.preventDefault();
          navigate(href);
        }
      }
    };
    document.addEventListener('click', handleAnchorLink);
    return () => document.removeEventListener('click', handleAnchorLink);
  }, []);

  const clearPreFilled = () => {
    setPreFilledForm({
      service: '',
      requestType: 'quote'
    });
  };

  // View Router Dispatcher
  const renderView = () => {
    const cleanPath = currentPath === '/index.html' ? '/' : currentPath;
    
    switch (cleanPath) {
      case '/':
        return <HomeView navigate={navigate} setPreFilledForm={setPreFilledForm} />;
      case '/gioi-thieu':
        return <AboutView navigate={navigate} />;
      case '/dich-vu':
        return <ServicesView navigate={navigate} setPreFilledForm={setPreFilledForm} />;
      case '/bang-gia':
        return <PricingView navigate={navigate} setPreFilledForm={setPreFilledForm} />;
      case '/du-an':
        return <ProjectsView navigate={navigate} setPreFilledForm={setPreFilledForm} />;
      case '/giai-phap':
        return <SolutionsView navigate={navigate} setPreFilledForm={setPreFilledForm} />;
      case '/dao-tao':
        return <TrainingView navigate={navigate} setPreFilledForm={setPreFilledForm} />;
      case '/blog':
        return <BlogView navigate={navigate} setPreFilledForm={setPreFilledForm} />;
      case '/lien-he':
        return <ContactView />;
      case '/nhan-bao-gia':
        return (
          <NhanBaoGiaView
            preFilledService={preFilledForm.service}
            preFilledRequestType={preFilledForm.requestType}
            clearPreFilled={clearPreFilled}
          />
        );
      case '/admin':
        return <AdminView />;
      default:
        // Friendly 404 Fallback
        return (
          <div className="max-w-md mx-auto text-center pt-48 pb-32 space-y-4" id="view-not-found">
            <h2 className="font-display font-bold text-6xl text-[#1E73FF]">404</h2>
            <h3 className="font-display font-medium text-xl text-slate-800">Trang Không Khả Dụng</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Trang bạn chọn truy vấn hiện không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống định tuyến whale sea.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1E73FF] hover:bg-blue-600 transition-colors cursor-pointer"
            >
              Về Trang Chủ
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-slate-800 overflow-x-hidden antialiased">
      {/* Dynamic Header */}
      <Header currentPath={currentPath} navigate={navigate} />

      {/* Main viewport Container */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dynamic Footer */}
      <Footer navigate={navigate} />

      {/* Floating Buttons: section 15 (Gọi điện, Zalo, Messenger, Nhận báo giá) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3" id="floating-conversion-widget">
        {/* Nhận báo giá floating circular button */}
        <button
          onClick={() => navigate('/nhan-bao-gia')}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1E73FF] to-[#22C7F5] text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Nhận báo giá ngay"
        >
          <Calculator size={20} className="group-hover:rotate-12 transition-transform" />
        </button>

        {/* Messenger/Facebook button link */}
        <a
          href="https://www.facebook.com/khan7th5.iam/"
          target="_blank"
          referrerPolicy="no-referrer"
          className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all group"
          title="Facebook Cá Nhân"
        >
          <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
        </a>

        {/* Zalo contact link */}
        <a
          href="https://zalo.me/0338808117"
          target="_blank"
          referrerPolicy="no-referrer"
          className="w-12 h-12 rounded-full bg-[#0068FF] text-white flex items-center justify-center font-display font-medium text-xs shadow-lg hover:scale-105 active:scale-95 transition-all border border-[#22C7F5]/20"
          title="Chat qua Zalo"
        >
          <span className="font-bold tracking-tight text-[11px] scale-95 select-none text-white">ZALO</span>
        </a>

        {/* Gọi điện button */}
        <a
          href="tel:0338808117"
          className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all animate-bounce"
          title="Gọi điện trực tiếp"
        >
          <Phone size={18} fill="currentColor" />
        </a>
      </div>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
