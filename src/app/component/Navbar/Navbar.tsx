"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/useAuth";
import ThemeToggle from "@/app/component/ThemeToggle/ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return (
      <nav className="bg-white dark:bg-gray-900 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-lg sticky top-0 z-50 animate-fade-in transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="ml-3 text-gray-800 dark:text-white text-2xl font-bold tracking-wide transition-colors duration-300">MiniProject</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-gray-800 dark:text-white text-sm transition-colors duration-300">กำลังโหลด...</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="light:bg-gray-100 dark:bg-gray-900/70 backdrop-blur-xl border-b-2 border-blue-200/60 dark:border-blue-800/40 shadow-xl sticky top-0 z-50 animate-fade-in transition-all duration-300 lightmode-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-600 dark:from-blue-700 dark:via-blue-900 dark:to-purple-900 rounded-full shadow-lg hover:scale-110 transition-transform border-2 border-blue-400/30 dark:border-blue-800/30 "
              aria-label="Home"
            >
              <svg className="w-7 h-7 text-gray-100  drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
            <span className="text-3xl font-extrabold tracking-wide select-none drop-shadow-lg bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent animate-gradient-x">MiniProject</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => router.push("/pages/dashboard")}
              className="flex items-center gap-2 text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-lg text-base font-bold transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-400/10 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3V3zm3 3v12h12V6H6z" /></svg>
              Dashboard
            </button>
            <button
              onClick={() => router.push("/pages/dashboard/graph")}
              className="flex items-center gap-2 text-gray-800 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-4 py-2 rounded-lg text-base font-bold transition-all duration-200 hover:bg-purple-50 dark:hover:bg-purple-400/10 shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 9V7a5 5 0 0110 0v2" /></svg>
              Graph
            </button>
            {!user ? (
              <>
                <ThemeToggle />
                <button
                  onClick={() => router.push("/pages/register")}
                  className="text-gray-800 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Register
                </button>
                <button
                  onClick={() => router.push("/pages/login")}
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-colors"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <ThemeToggle />
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-base font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-800 dark:text-white font-semibold text-sm truncate max-w-[120px]" title={user.name || user.email}>
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="text-gray-600 dark:text-gray-400 lightmode-text hover:text-gray-800 dark:hover:text-white hover:bg-blue-100/40 dark:hover:bg-blue-900/40 lightmode-hover p-2 rounded-lg shadow-md border border-blue-300/50 dark:border-blue-500/30 lightmode-border transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 lightmode-mobile-menu backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 lightmode-border shadow-xl animate-fade-in transition-all duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => {
                router.push("/");
                setIsMenuOpen(false);
              }}
              className="text-gray-600 dark:text-gray-300 lightmode-text hover:text-blue-600 dark:hover:text-blue-400 lightmode-hover block px-3 py-2 rounded-md text-base font-semibold w-full text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 lightmode-bg-hover"
            >
              Home
            </button>
            <button
              onClick={() => {
                router.push("/dashboard");
                setIsMenuOpen(false);
              }}
              className="text-gray-800 dark:text-gray-300 lightmode-text hover:text-blue-600 dark:hover:text-blue-400 lightmode-hover block px-3 py-2 rounded-md text-base font-semibold w-full text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 lightmode-bg-hover"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                router.push("/dashboard/graph");
                setIsMenuOpen(false);
              }}
              className="text-gray-800 dark:text-gray-300 lightmode-text hover:text-purple-600 dark:hover:text-purple-400 lightmode-hover block px-3 py-2 rounded-md text-base font-semibold w-full text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 lightmode-bg-hover"
            >
              Graph
            </button>
            {!user ? (
              <>
                <button
                  onClick={() => {
                    router.push("/pages/register");
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-800 dark:text-gray-300 lightmode-text hover:text-emerald-600 dark:hover:text-emerald-400 lightmode-hover block px-3 py-2 rounded-md text-base font-semibold w-full text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 lightmode-bg-hover"
                >
                  Register
                </button>
                <button
                  onClick={() => {
                    router.push("/pages/login");
                    setIsMenuOpen(false);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 lightmode-button text-white block px-3 py-2 rounded-md text-base font-semibold w-full text-left shadow-md transition-colors"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-base font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-800 dark:text-white lightmode-text font-semibold text-base truncate max-w-[120px] transition-colors duration-300" title={user.name || user.email}>
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 lightmode-button-danger text-white block px-3 py-2 rounded-md text-base font-semibold w-full text-left shadow-md transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
