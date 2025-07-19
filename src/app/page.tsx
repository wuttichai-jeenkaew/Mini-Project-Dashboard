'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/useAuth";
import Navbar from "@/app/component/Navbar/Navbar";
import { useRouter } from "next/navigation";
import axios from "axios";

// Configure axios to include credentials (cookies) with all requests
axios.defaults.withCredentials = true;

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalTopics: 0,
    totalRecords: 0,
    recentActivity: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Animated counter hook
  const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      let startTime: number;
      let animationFrame: number;
      
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };
      
      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);
    
    return count;
  };

  const topicsCount = useCountUp(stats.totalTopics);
  const recordsCount = useCountUp(stats.totalRecords);
  const activityCount = useCountUp(stats.recentActivity);

  // Fetch real data from APIs
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Fetch topics count
        const topicsResponse = await axios.get("/api/topic");
        const totalTopics = topicsResponse.data.data?.length || 0;

        // Fetch total records count (sum of all records from all topics)
        let totalRecords = 0;
        if (totalTopics > 0) {
          const recordsPromises = topicsResponse.data.data.map(async (topic: any) => {
            try {
              const recordsResponse = await axios.get(`/api/form?topic=${topic.id}&pageSize=1`);
              return recordsResponse.data.total || 0;
            } catch {
              return 0;
            }
          });
          
          const recordsCounts = await Promise.all(recordsPromises);
          totalRecords = recordsCounts.reduce((sum, count) => sum + count, 0);
        }

        // Calculate recent activity (records created in last 7 days)
        let recentActivity = 0;
        if (totalTopics > 0) {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          const dateFilter = sevenDaysAgo.toISOString().split('T')[0];

          const recentPromises = topicsResponse.data.data.map(async (topic: any) => {
            try {
              const recentResponse = await axios.get(`/api/form?topic=${topic.id}&startDate=${dateFilter}&pageSize=1000`);
              return recentResponse.data.data?.length || 0;
            } catch {
              return 0;
            }
          });
          
          const recentCounts = await Promise.all(recentPromises);
          recentActivity = recentCounts.reduce((sum, count) => sum + count, 0);
        }

        setStats({
          totalTopics,
          totalRecords,
          recentActivity
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Keep default values (0) if error occurs
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      // If logged in, redirect to dashboard (existing page)
      window.location.href = '/pages/dashboard';
    } else {
      // If not logged in, redirect to register
      router.push('/pages/dashboard'); // Changed to register page
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Main heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Mini Project
              </span>
              <br />
              <span className="text-gray-200">Web Application</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              ระบบจัดการข้อมูลที่ทันสมัย ใช้งานง่าย และมีประสิทธิภาพสูง
              <br className="hidden sm:block" />
              เพื่อการทำงานที่ราบรื่นและมีระเบียบ
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {user ? 'เข้าสู่แดชบอร์ด' : 'เริ่มต้นใช้งาน'}
              </button>
              
              <button
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-gray-800/50"
              >
                เรียนรู้เพิ่มเติม
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800/30 backdrop-blur-sm border-y border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-600 h-12 w-16 mx-auto rounded"></div>
                ) : (
                  `${topicsCount}+`
                )}
              </div>
              <div className="text-gray-300 text-lg">หัวข้อทั้งหมด</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-600 h-12 w-20 mx-auto rounded"></div>
                ) : (
                  `${recordsCount}+`
                )}
              </div>
              <div className="text-gray-300 text-lg">รายการข้อมูล</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-600 h-12 w-16 mx-auto rounded"></div>
                ) : (
                  `${activityCount}+`
                )}
              </div>
              <div className="text-gray-300 text-lg">กิจกรรมล่าสุด</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ฟีเจอร์เด่น
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              เครื่องมือที่จำเป็นสำหรับการจัดการข้อมูลอย่างมีประสิทธิภาพ
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">จัดการข้อมูล</h3>
              <p className="text-gray-400">เพิ่ม แก้ไข และลบข้อมูลได้อย่างง่ายดาย พร้อมระบบตรวจสอบความถูกต้อง</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">ค้นหาและกรอง</h3>
              <p className="text-gray-400">ค้นหาข้อมูลได้อย่างรวดเร็ว พร้อมการกรองตามวันที่และหมวดหมู่</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">ความปลอดภัย</h3>
              <p className="text-gray-400">ระบบยืนยันตัวตนที่ปลอดภัย พร้อมการควบคุมสิทธิ์การเข้าถึง</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4h10m-9 4h10m-9 4h10m-9 4h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">เรียงลำดับ</h3>
              <p className="text-gray-400">เรียงลำดับข้อมูลตามคอลัมน์ต่างๆ ได้อย่างยืดหยุ่น</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Responsive Design</h3>
              <p className="text-gray-400">ใช้งานได้บนทุกอุปกรณ์ ทั้ง Desktop, Tablet และ Mobile</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">ประสิทธิภาพสูง</h3>
              <p className="text-gray-400">โหลดเร็ว ทำงานราบรื่น พร้อม Real-time Updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            พร้อมเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            เข้าร่วมกับเราวันนี้ และสัมผัสประสบการณ์การจัดการข้อมูลที่ไม่เหมือนใคร
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {user ? 'เข้าสู่แดชบอร์ด' : 'สมัครสมาชิกฟรี'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Mini Project Web Application. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

