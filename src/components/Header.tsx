import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export default function Header({ currentPath, navigate }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Giới thiệu', path: '/gioi-thieu' },
    { name: 'Dịch vụ', path: '/dich-vu' },
    { name: 'Bảng giá', path: '/bang-gia' },
    { name: 'Dự án', path: '/du-an' },
    { name: 'Giải pháp', path: '/giai-phap' },
    { name: 'Đào tạo', path: '/dao-tao' },
    { name: 'Blog', path: '/blog' },
    { name: 'Liên hệ', path: '/lien-he' }
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-3 shadow-lg shadow-slate-100/20'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-4 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('/')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 flex items-center justify-center bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group-hover:scale-105 transition-transform duration-300">
              {/* Premium exact Whale Sea representation */}
              <svg viewBox="0 0 100 100" className="w-9 h-9">
                <defs>
                  <linearGradient id="whaleSeaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="60%" stopColor="#0077FF" />
                    <stop offset="100%" stopColor="#0A2F8F" />
                  </linearGradient>
                </defs>
                {/* Whale sea beautiful dual fin cursive wings */}
                <path
                  d="M15,55 C25,58 38,55 45,45 C50,38 42,28 32,32 C22,35 12,48 15,55 Z"
                  fill="url(#whaleSeaGrad)"
                />
                <path
                  d="M48,45 C55,30 70,25 82,28 C88,30 82,45 70,52 C58,58 46,55 48,45 Z"
                  fill="url(#whaleSeaGrad)"
                  opacity="0.9"
                />
                <path
                  d="M25,58 C40,55 50,42 52,35 C58,45 70,55 85,50 C70,68 45,68 25,58 Z"
                  fill="url(#whaleSeaGrad)"
                  opacity="0.95"
                />
              </svg>
            </div>
            
            <div className="flex flex-col">
              <span className="font-sans font-extrabold text-xl font-black text-slate-900 tracking-tight leading-none flex items-center">
                whale <span className="text-[#1E73FF] ml-1">sea</span><span className="text-[10px] font-normal text-slate-400 self-start ml-0.5">™</span>
              </span>
              <span className="text-[8px] font-mono tracking-widest text-[#1E73FF] font-bold uppercase mt-0.5 whitespace-nowrap">
                FREELANCE • ADS • MARKETING
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                   key={item.path}
                   onClick={() => handleNavClick(item.path)}
                   className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                     isActive
                       ? 'text-[#1E73FF] font-semibold'
                       : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                   }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#1E73FF] to-[#22C7F5] rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* CTA Header */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={() => handleNavClick('/nhan-bao-gia')}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#1E73FF] shadow-lg shadow-[#1E73FF]/25 hover:bg-blue-600 hover:shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Nhận báo giá
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100/60 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-lg border-b border-slate-200 py-4 px-6 shadow-xl"
        >
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#1E73FF]/10 text-[#1E73FF] font-semibold border-l-4 border-[#1E73FF]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
            <div className="pt-4 border-t border-slate-200 flex flex-col space-y-2">
              <button
                onClick={() => handleNavClick('/nhan-bao-gia')}
                className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white bg-gradient-to-r from-[#1E73FF] to-[#22C7F5] shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                Nhận báo giá miễn phí
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
