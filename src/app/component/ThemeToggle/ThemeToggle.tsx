'use client';

import { useTheme } from '@/app/context/useTheme';
import { useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative inline-flex items-center justify-center w-12 h-12 
        bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-800 dark:to-slate-900
        light:from-blue-50 light:to-blue-100 light:border-blue-200
        hover:from-slate-600 hover:to-slate-700 dark:hover:from-slate-700 dark:hover:to-slate-800
        light:hover:from-blue-100 light:hover:to-blue-200
        rounded-xl border border-slate-600 dark:border-slate-700 light:border-blue-300
        transition-all duration-300 ease-in-out
        shadow-lg hover:shadow-xl
        backdrop-blur-sm
        group
        ${isAnimating ? 'scale-95' : 'scale-100'}
      `}
      title={theme === 'dark' ? 'เปลี่ยนเป็นธีมสว่าง' : 'เปลี่ยนเป็นธีมมืด'}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon container */}
      <div className="relative z-10">
        {theme === 'dark' ? (
          // Sun icon for light mode
          <div className="relative">
            <svg
              className={`w-6 h-6 text-yellow-400 transform transition-all duration-300 ${
                isAnimating ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
            </svg>
            {/* Animated rays */}
            <div className="absolute inset-0 animate-pulse">
              <div className="absolute top-0 left-1/2 w-px h-2 bg-yellow-400 -translate-x-1/2 -translate-y-1"></div>
              <div className="absolute bottom-0 left-1/2 w-px h-2 bg-yellow-400 -translate-x-1/2 translate-y-1"></div>
              <div className="absolute left-0 top-1/2 w-2 h-px bg-yellow-400 -translate-y-1/2 -translate-x-1"></div>
              <div className="absolute right-0 top-1/2 w-2 h-px bg-yellow-400 -translate-y-1/2 translate-x-1"></div>
            </div>
          </div>
        ) : (
          // Moon icon for dark mode
          <div className="relative">
            <svg
              className={`w-6 h-6 text-blue-400 transform transition-all duration-300 ${
                isAnimating ? 'rotate-12 scale-110' : 'rotate-0 scale-100'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd"/>
            </svg>
            {/* Animated stars */}
            <div className="absolute -top-1 -right-1 w-1 h-1 bg-blue-300 rounded-full animate-pulse animation-delay-100"></div>
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-200 rounded-full animate-pulse animation-delay-200"></div>
            <div className="absolute top-1 -left-2 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse animation-delay-300"></div>
          </div>
        )}
      </div>

      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
      </div>
    </button>
  );
}
