"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/useAuth";

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
      <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-black backdrop-blur-lg border-b border-gray-800 shadow-lg sticky top-0 z-50 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="ml-3 text-white text-2xl font-bold tracking-wide">MiniProject</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-blue-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-white text-sm">กำลังโหลด...</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-black backdrop-blur-lg border-b border-gray-800 shadow-lg sticky top-0 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full shadow-lg hover:scale-110 transition-transform"
                aria-label="Home"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              <span className="ml-3 text-white text-2xl font-bold tracking-wide select-none">MiniProject</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <button
                  onClick={() => router.push("/pages/register")}
                  className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors hover:bg-gray-800"
                >
                  Register
                </button>
                <button
                  onClick={() => router.push("/pages/login")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 shadow-md transition-colors"
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
                  <span className="text-white font-semibold text-sm truncate max-w-[120px]" title={user.name || user.email}>
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 shadow-md transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-md"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black border-t border-gray-800 shadow-xl animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => {
                router.push("/");
                setIsMenuOpen(false);
              }}
              className="text-gray-300 hover:text-blue-400 block px-3 py-2 rounded-md text-base font-semibold w-full text-left transition-colors hover:bg-gray-800"
            >
              Home
            </button>
            {!user ? (
              <>
                <button
                  onClick={() => {
                    router.push("/pages/register");
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-semibold w-full text-left transition-colors hover:bg-gray-800"
                >
                  Register
                </button>
                <button
                  onClick={() => {
                    router.push("/pages/login");
                    setIsMenuOpen(false);
                  }}
                  className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-semibold w-full text-left hover:bg-blue-700 shadow-md transition-colors"
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
                  <span className="text-white font-semibold text-base truncate max-w-[120px]" title={user.name || user.email}>
                    {user.name || user.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-600 text-white block px-3 py-2 rounded-md text-base font-semibold w-full text-left hover:bg-red-700 shadow-md transition-colors"
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
