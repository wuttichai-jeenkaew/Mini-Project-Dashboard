"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../../component/Navbar/Navbar";

// Configure axios to include credentials (cookies) with all requests
axios.defaults.withCredentials = true;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const validate = () => {
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) return "กรุณากรอกอีเมลที่ถูกต้อง";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/forgot_password", {
        email: email.trim()
      });
      
      setSuccess("ลิงก์รีเซ็ตรหัสผ่านได้ถูกส่งไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบอีเมล");
      setEmail("");
      
      // Redirect to login after 5 seconds
      setTimeout(() => {
        router.push("/pages/login");
      }, 5000);
    } catch (err: any) {
      setError(err?.response?.data?.error || "เกิดข้อผิดพลาดในการส่งอีเมล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black lightmode-auth-bg">
      <Navbar />

      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-500 rounded-full opacity-30 animate-bounce lightmode-shape-blue"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-emerald-500 rounded-full opacity-40 animate-pulse lightmode-shape-emerald"></div>
        <div className="absolute bottom-32 left-16 w-3 h-3 bg-indigo-500 rounded-full opacity-35 animate-ping lightmode-shape-indigo"></div>
        <div className="absolute bottom-48 right-12 w-5 h-5 bg-cyan-500 rounded-full opacity-30 animate-bounce lightmode-shape-cyan" style={{animationDelay: '0.5s'}}></div>
        
        {/* Gradient orbs with better visibility */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full filter blur-3xl animate-pulse lightmode-orb-blue"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-gradient-to-r from-emerald-500/15 to-blue-500/15 rounded-full filter blur-3xl animate-pulse lightmode-orb-emerald" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full filter blur-3xl animate-pulse lightmode-orb-indigo" style={{animationDelay: '4s'}}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10 lightmode-grid-pattern">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping lightmode-particle" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping lightmode-particle" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping lightmode-particle" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-ping lightmode-particle" style={{animationDelay: '3.5s'}}></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand area */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full mb-4 shadow-lg lightmode-brand-icon">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 lightmode-auth-title">ลืมรหัสผ่าน</h1>
            <p className="text-gray-400 text-sm lightmode-auth-subtitle">
              กรอกอีเมลของคุณเพื่อรับลิงก์รีเซ็ตรหัสผ่าน
            </p>
          </div>

          {/* Main form card */}
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-700/50 p-8 transition-all duration-300 hover:shadow-blue-500/20 lightmode-auth-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200 lightmode-auth-label">
                  อีเมล
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500 lightmode-auth-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                      setSuccess("");
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 lightmode-auth-input"
                    placeholder="กรอกอีเมลของคุณ"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Error and Success messages */}
              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3 lightmode-auth-error">
                  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
              
              {success && (
                <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg p-3 lightmode-auth-success">
                  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {success}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-blue-500/25 lightmode-auth-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    กำลังส่งอีเมล...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    ส่งลิงก์รีเซ็ตรหัสผ่าน
                  </span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-gray-400 text-sm lightmode-auth-small-text">
                จำรหัสผ่านได้แล้ว?
                <a href="/pages/login" className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors lightmode-auth-link">
                  เข้าสู่ระบบ
                </a>
              </p>
              <p className="text-gray-400 text-sm lightmode-auth-small-text">
                ยังไม่มีบัญชี?
                <a href="/pages/register" className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition-colors lightmode-auth-link">
                  สมัครสมาชิก
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

