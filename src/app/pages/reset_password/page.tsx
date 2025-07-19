"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import Navbar from "@/app/component/Navbar/Navbar";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState("");
  
  const router = useRouter();

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        // Get tokens from URL hash (Supabase redirects with tokens in hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const access_token = hashParams.get('access_token');
        const refresh_token = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (type === 'recovery' && access_token && refresh_token) {
          // Create client-side Supabase client
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );
          
          // Set session with the tokens to verify they're valid
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token
          });

          if (error) {
            setError("ลิงก์ไม่ถูกต้องหรือหมดอายุ");
          } else if (data.user) {
            setTokenValid(true);
            setEmail(data.user.email || "");
            // Store only access token for password update
            sessionStorage.setItem('reset_access_token', access_token);
          }
        } else {
          setError("ลิงก์ไม่ถูกต้องหรือไม่สมบูรณ์");
        }
      } catch (err) {
        console.error("Token verification error:", err);
        setError("เกิดข้อผิดพลาดในการตรวจสอบ Token");
      } finally {
        setVerifying(false);
      }
    };

    handlePasswordReset();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (!form.newPassword || form.newPassword.length < 6) return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    if (form.newPassword !== form.confirmPassword) return "รหัสผ่านไม่ตรงกัน";
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
      const access_token = sessionStorage.getItem('reset_access_token');

      if (!access_token) {
        throw new Error("ไม่พบ Token ที่จำเป็น");
      }

      // Call our Server-side API endpoint using axios
      const response = await axios.post('/api/auth/reset_password', {
        access_token,
        newPassword: form.newPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status !== 200) {
        throw new Error(response.data?.error || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน');
      }
      
      setSuccess("รีเซ็ตรหัสผ่านสำเร็จ! กำลังพาคุณไปหน้าเข้าสู่ระบบ...");
      setForm({ newPassword: "", confirmPassword: "" });
      
      // Clear stored token
      sessionStorage.removeItem('reset_access_token');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/pages/login");
      }, 2000);
    } catch (err: any) {
      // Handle axios errors
      const errorMessage = err.response?.data?.error || err.message || "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black lightmode-auth-bg">
        <Navbar />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full mb-4 shadow-lg lightmode-brand-icon">
              <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-white mb-2 lightmode-auth-title">กำลังตรวจสอบ Token</h1>
            <p className="text-gray-400 text-sm lightmode-auth-subtitle">กรุณารอสักครู่...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black lightmode-auth-bg">
        <Navbar />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-red-500 to-pink-500 rounded-full mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 lightmode-auth-title">ลิงก์ไม่ถูกต้อง</h1>
              <p className="text-gray-400 lightmode-auth-subtitle">{error}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl lightmode-auth-card">
              <p className="text-white text-center mb-4 lightmode-auth-text">
                กรุณาขอลิงก์รีเซ็ตรหัสผ่านใหม่
              </p>
              <button
                onClick={() => router.push("/pages/forgot_password")}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-medium py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-200 lightmode-auth-button"
              >
                ขอลิงก์ใหม่
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black lightmode-auth-bg">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>
      
      <Navbar />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full mb-4 shadow-lg lightmode-brand-icon animate-float">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 lightmode-auth-title">รีเซ็ตรหัสผ่าน</h1>
            <p className="text-gray-400 lightmode-auth-subtitle">
              กำหนดรหัสผ่านใหม่สำหรับ <span className="text-blue-400 font-medium">{email}</span>
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl lightmode-auth-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2 lightmode-auth-label">
                  รหัสผ่านใหม่
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="กรุณาใส่รหัสผ่านใหม่"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 lightmode-auth-input"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2 lightmode-auth-label">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="กรุณาใส่รหัสผ่านใหม่อีกครั้ง"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 lightmode-auth-input"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 backdrop-blur-sm lightmode-auth-error">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 backdrop-blur-sm lightmode-auth-success">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-400 text-sm">{success}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-medium py-3 px-4 rounded-lg hover:shadow-lg hover:from-blue-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed lightmode-auth-button"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังรีเซ็ตรหัสผ่าน...
                  </div>
                ) : (
                  'รีเซ็ตรหัสผ่าน'
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/pages/login")}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm lightmode-auth-link"
                >
                  กลับไปหน้าเข้าสู่ระบบ
                </button>
              </div>
            </form>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs lightmode-auth-note">
              🔒 รหัสผ่านจะถูกเข้ารหัสและเก็บรักษาอย่างปลอดภัย
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
