'use client';

import Navbar from "@/app/component/Navbar/Navbar";
import LoadingSpinner from "@/app/component/LoadingSpinner/LoadingSpinner";
import { useEffect, useState } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

type ChartType = 'bar' | 'line' | 'pie' | 'doughnut';

// Counter Animation Hook
function useCountAnimation(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    if (end > 0) {
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);
  
  return count;
}

export default function GraphDashboard() {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: "จำนวนรายการข้อมูล",
        data: [],
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [topN, setTopN] = useState(10); // แสดงเฉพาะ Top N
  const [originalData, setOriginalData] = useState<any[]>([]); // เก็บข้อมูลต้นฉบับ
  const [searchTerm, setSearchTerm] = useState(''); // ค้นหา
  const [filteredData, setFilteredData] = useState<any[]>([]); // ข้อมูลที่ถูกกรอง

  // Animation values for stats cards
  const totalTopics = originalData.length; // ใช้ข้อมูลต้นฉบับ
  const totalItems = originalData.reduce((sum: number, item: any) => sum + item.count, 0);
  
  // คำนวณข้อมูลที่แสดงผล
  const getDisplayedData = () => {
    if (searchTerm.trim() === '') {
      // โหมดปกติ
      return {
        topics: Math.min(topN, originalData.length),
        items: originalData.slice(0, topN).reduce((sum: number, item: any) => sum + item.count, 0),
        mode: 'normal'
      };
    } else {
      // โหมดค้นหา
      return {
        topics: filteredData.length,
        items: filteredData.reduce((sum: number, item: any) => sum + item.count, 0),
        mode: 'search'
      };
    }
  };

  const displayedData = getDisplayedData();
  
  // ใช้ animation ที่เร็วขึ้นสำหรับการค้นหา
  const animationDuration = searchTerm.trim() !== '' ? 800 : 1500;
  
  const animatedTopics = useCountAnimation(totalTopics, 1200);
  const animatedItems = useCountAnimation(totalItems, 1500);
  const animatedDisplayedTopics = useCountAnimation(displayedData.topics, animationDuration);
  const animatedDisplayedItems = useCountAnimation(displayedData.items, animationDuration + 200);

  // ฟังก์ชันสำหรับเลือกประเภทกราฟ
  const getChartComponent = () => {
    const chartProps = {
      data: chartData,
      options: getChartOptions(),
      height: 400
    };

    switch (chartType) {
      case 'bar':
        return <Bar key={chartType} {...chartProps} />;
      case 'line':
        return <Line key={chartType} {...chartProps} />;
      case 'pie':
        return <Pie key={chartType} {...chartProps} />;
      case 'doughnut':
        return <Doughnut key={chartType} {...chartProps} />;
      default:
        return <Bar key={chartType} {...chartProps} />;
    }
  };

  // ฟังก์ชันสำหรับตั้งค่า options ตามประเภทกราฟ
  const getChartOptions = () => {
    // ใช้ animation ที่เร็วขึ้นสำหรับการค้นหา
    const animationDuration = searchTerm.trim() !== '' ? 800 : 1500;
    
    // ตรวจสอบธีมปัจจุบัน
    const isDark = !document.documentElement.classList.contains('light');
    
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: animationDuration,
        easing: 'easeOutQuart' as const,
        delay: (context: any) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default') {
            // ลด delay สำหรับโหมดค้นหา
            delay = searchTerm.trim() !== '' ? context.dataIndex * 50 : context.dataIndex * 100;
          }
          return delay;
        },
        onComplete: () => {
          setIsAnimating(false);
        },
        onProgress: () => {
          setIsAnimating(true);
        }
      },
      plugins: {
        legend: { 
          display: chartType === 'pie' || chartType === 'doughnut',
          position: 'right' as const,
          labels: {
            color: isDark ? '#cbd5e1' : '#475569',
            font: { size: 12 }
          }
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: isDark ? '#fff' : '#1e293b',
          bodyColor: isDark ? '#fff' : '#1e293b',
          borderColor: isDark ? 'rgba(99, 102, 241, 0.5)' : 'rgba(59, 130, 246, 0.5)',
          borderWidth: 1,
          cornerRadius: 12,
          displayColors: false,
          callbacks: {
            title: function(context: any) {
              return context[0].label;
            },
            label: function(context: any) {
              return `จำนวน: ${context.parsed.y || context.parsed} รายการ`;
            }
          }
        }
      }
    };

    // เพิ่ม scales สำหรับ bar และ line chart
    if (chartType === 'bar' || chartType === 'line') {
      return {
        ...baseOptions,
        scales: {
          x: { 
            ticks: { 
              color: isDark ? "#cbd5e1" : "#475569",
              font: { size: 12 }
            },
            grid: { 
              display: false 
            },
            border: {
              color: isDark ? 'rgba(203, 213, 225, 0.3)' : 'rgba(71, 85, 105, 0.3)'
            }
          },
          y: { 
            ticks: { 
              color: isDark ? "#cbd5e1" : "#475569",
              font: { size: 12 }
            },
            grid: { 
              color: isDark ? "rgba(203, 213, 225, 0.1)" : "rgba(71, 85, 105, 0.1)"
            },
            border: {
              display: false
            }
          },
        },
        elements: {
          bar: {
            borderRadius: 8,
            borderSkipped: false,
          },
          line: {
            tension: 0.4,
            borderWidth: 3,
          },
          point: {
            radius: 6,
            hoverRadius: 8,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.8)',
            borderWidth: 2,
          }
        }
      };
    }

    return baseOptions;
  };

  // ฟังก์ชันสำหรับสร้างข้อมูลกราฟตามประเภท
  const getChartData = (topicStats: any[], limitTopN: number = topN) => {
    const sortedStats = topicStats.sort((a: any, b: any) => b.count - a.count);
    
    // จำกัดจำนวนหัวข้อที่แสดง
    let displayData = sortedStats.slice(0, limitTopN);
    
    // ถ้ามีหัวข้อเหลือ ให้รวมเป็น "อื่นๆ"
    if (sortedStats.length > limitTopN) {
      const othersCount = sortedStats.slice(limitTopN).reduce((sum: number, item: any) => sum + item.count, 0);
      if (othersCount > 0) {
        displayData.push({
          name: `อื่นๆ (${sortedStats.length - limitTopN} หัวข้อ)`,
          count: othersCount
        });
      }
    }
    
    const colors = [
      "rgba(99, 102, 241, 0.8)",    // Blue
      "rgba(16, 185, 129, 0.8)",    // Green
      "rgba(245, 158, 11, 0.8)",    // Orange
      "rgba(239, 68, 68, 0.8)",     // Red
      "rgba(139, 92, 246, 0.8)",    // Purple
      "rgba(6, 182, 212, 0.8)",     // Cyan
      "rgba(236, 72, 153, 0.8)",    // Pink
      "rgba(34, 197, 94, 0.8)",     // Emerald
      "rgba(107, 114, 128, 0.8)",   // Gray for "อื่นๆ"
    ];

    const borderColors = [
      "rgba(99, 102, 241, 1)",      // Blue
      "rgba(16, 185, 129, 1)",      // Green
      "rgba(245, 158, 11, 1)",      // Orange
      "rgba(239, 68, 68, 1)",       // Red
      "rgba(139, 92, 246, 1)",      // Purple
      "rgba(6, 182, 212, 1)",       // Cyan
      "rgba(236, 72, 153, 1)",      // Pink
      "rgba(34, 197, 94, 1)",       // Emerald
      "rgba(107, 114, 128, 1)",     // Gray for "อื่นๆ"
    ];

    return {
      labels: displayData.map((item: any) => item.name),
      datasets: [
        {
          label: "จำนวนรายการข้อมูล",
          data: displayData.map((item: any) => item.count),
          backgroundColor: displayData.map((item: any, index: number) => colors[index % colors.length]),
          borderColor: displayData.map((item: any, index: number) => borderColors[index % borderColors.length]),
          borderWidth: 2,
        },
      ],
    };
  };

  // ฟังก์ชันสำหรับอัปเดตกราฟเมื่อเปลี่ยน topN
  const updateChartWithTopN = (newTopN: number) => {
    if (originalData.length > 0) {
      const dataToUse = searchTerm ? filteredData : originalData;
      setChartData(getChartData(dataToUse, searchTerm ? dataToUse.length : newTopN));
      setIsAnimating(true);
    }
  };

  // ฟังก์ชันสำหรับค้นหา
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      // รีเซ็ตกลับสู่โหมดปกติ (ใช้ animation เร็วขึ้น)
      setFilteredData([]);
      setChartData(getChartData(originalData, topN));
      setIsAnimating(true);
    } else {
      const filtered = originalData.filter(item => 
        item.name.toLowerCase().startsWith(term.toLowerCase())
      );
      setFilteredData(filtered);
      setChartData(getChartData(filtered, filtered.length));
      setIsAnimating(true);
    }
  };

  // ฟังก์ชันสำหรับล้างการค้นหา
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredData([]);
    setChartData(getChartData(originalData, topN));
    setIsAnimating(true);
  };

  // ดึงข้อมูลจริงจาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.data && result.data.topicStats) {
          const { topicStats } = result.data;
          
          // เก็บข้อมูลต้นฉบับและสร้างกราฟ
          setOriginalData(topicStats);
          setChartData(getChartData(topicStats));
          setIsAnimating(true);
        } else {
          setError("ไม่พบข้อมูลสถิติ");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 light:from-gray-100 light:via-gray-50 light:to-slate-100 transition-all duration-300">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-4xl">📊</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Dashboard Analytics
          </h1>
          <p className="text-slate-400 light:text-gray-700 text-xl max-w-2xl mx-auto transition-colors duration-300">
            ภาพรวมข้อมูลและสถิติการทำงาน พร้อมการวิเคราะห์แบบเรียลไทม์
          </p>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>
        </div>
        
        {loading && <LoadingSpinner />}
        
        {error && (
          <div className="bg-red-900/20 light:bg-red-50/70 backdrop-blur-md border border-red-500/50 light:border-red-300 rounded-2xl p-8 shadow-2xl text-center transition-all duration-300">
            <div className="text-red-400 light:text-red-600 text-6xl mb-4">⚠️</div>
            <p className="text-red-200 light:text-red-800 mb-6 text-lg">เกิดข้อผิดพลาด: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🔄 ลองใหม่อีกครั้ง
            </button>
          </div>
        )}
        
        {!loading && !error && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 light:from-blue-50/80 light:to-blue-100/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30 light:border-blue-200/70 shadow-xl transform transition-all duration-700 hover:scale-105 hover:shadow-2xl animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-300 light:text-blue-800 text-sm font-medium">จำนวนหัวข้อทั้งหมด</p>
                    <p className="text-3xl font-bold text-white light:text-gray-900 mt-1 transition-all duration-300">
                      {animatedTopics}
                    </p>
                  </div>
                  <div className="text-blue-400 light:text-blue-700 text-3xl animate-bounce">📂</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 light:from-green-50/80 light:to-green-100/60 backdrop-blur-md rounded-2xl p-6 border border-green-500/30 light:border-green-200/70 shadow-xl transform transition-all duration-700 hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 light:text-green-800 text-sm font-medium">รายการข้อมูลทั้งหมด</p>
                    <p className="text-3xl font-bold text-white light:text-gray-900 mt-1 transition-all duration-300">
                      {animatedItems}
                    </p>
                  </div>
                  <div className="text-green-400 light:text-green-700 text-3xl animate-pulse">📈</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 light:from-purple-50/80 light:to-purple-100/60 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 light:border-purple-200/70 shadow-xl transform transition-all duration-700 hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-400">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 light:text-purple-800 text-sm font-medium">หัวข้อยอดนิยม</p>
                    <p className="text-xl font-bold text-white light:text-gray-900 mt-1 truncate">
                      {originalData.length > 0 && originalData[0]?.name ? originalData[0].name : 'ไม่มีข้อมูล'}
                    </p>
                  </div>
                  <div className="text-purple-400 light:text-purple-700 text-3xl animate-bounce animation-delay-100">🏆</div>
                </div>
              </div>

              {/* Search Results Card */}
              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 light:from-cyan-50/80 light:to-cyan-100/60 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30 light:border-cyan-200/70 shadow-xl transform transition-all duration-700 hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-300 light:text-cyan-800 text-sm font-medium">
                      {displayedData.mode === 'search' ? 'ผลการค้นหา' : 'กำลังแสดง'}
                    </p>
                    <p className="text-3xl font-bold text-white light:text-gray-900 mt-1 transition-all duration-300">
                      {animatedDisplayedTopics}
                    </p>
                  </div>
                  <div className="text-cyan-400 light:text-cyan-700 text-3xl animate-pulse animation-delay-200">
                    {displayedData.mode === 'search' ? '🔍' : '👁️'}
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8 animate-fade-in-up animation-delay-800">
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ค้นหาหัวข้อ..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-slate-800/50 light:bg-gray-50/90 backdrop-blur-md border border-slate-600 light:border-gray-300 rounded-xl px-4 py-3 pl-12 pr-12 text-white light:text-gray-800 placeholder-slate-400 light:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <svg className="w-5 h-5 text-slate-400 light:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 light:text-gray-500 hover:text-white light:hover:text-gray-800 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Search Results Info */}
                {searchTerm.trim() !== '' && (
                  <div className="mt-3 text-center">
                    {/* <p className="text-sm text-slate-400">
                      {filteredData.length > 0 ? (
                        <span className="text-green-400">
                          🎯 พบ {filteredData.length} หัวข้อที่ตรงกับ "{searchTerm}"
                        </span>
                      ) : (
                        <span className="text-red-400">
                          ❌ ไม่พบหัวข้อที่ตรงกับ "{searchTerm}"
                        </span>
                      )}
                    </p> */}
                  </div>
                )}
              </div>
            </div>

            {/* Main Chart */}
            <div className="bg-slate-800/50 light:bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-slate-700 light:border-gray-200 animate-fade-in-up animation-delay-600 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white light:text-gray-900 flex items-center gap-3 transition-colors duration-300">
                  <span className="text-3xl animate-pulse">📊</span>
                  กราฟแสดงผลข้อมูล
                </h2>
                <div className="flex items-center gap-4">
                  {/* Chart Type Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400 light:text-gray-600">ประเภท:</span>
                    <div className="flex bg-slate-700/50 light:bg-gray-100/80 rounded-lg p-1 border border-slate-600 light:border-gray-300">
                      <button
                        onClick={() => setChartType('bar')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-110 ${
                          chartType === 'bar'
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'text-slate-300 light:text-gray-700 hover:text-white light:hover:text-gray-900 hover:bg-slate-600 light:hover:bg-gray-200'
                        }`}
                      >
                        📊 
                      </button>
                      <button
                        onClick={() => setChartType('line')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-110 ${
                          chartType === 'line'
                            ? 'bg-green-600 text-white shadow-lg scale-105'
                            : 'text-slate-300 light:text-gray-700 hover:text-white light:hover:text-gray-900 hover:bg-slate-600 light:hover:bg-gray-200'
                        }`}
                      >
                        📈 
                      </button>
                      <button
                        onClick={() => setChartType('pie')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-110 ${
                          chartType === 'pie'
                            ? 'bg-orange-600 text-white shadow-lg scale-105'
                            : 'text-slate-300 light:text-gray-700 hover:text-white light:hover:text-gray-900 hover:bg-slate-600 light:hover:bg-gray-200'
                        }`}
                      >
                        🥧 
                      </button>
                      <button
                        onClick={() => setChartType('doughnut')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-110 ${
                          chartType === 'doughnut'
                            ? 'bg-purple-600 text-white shadow-lg scale-105'
                            : 'text-slate-300 light:text-gray-700 hover:text-white light:hover:text-gray-900 hover:bg-slate-600 light:hover:bg-gray-200'
                        }`}
                      >
                        🍩 
                      </button>
                    </div>
                  </div>

                  {/* Top N Selector */}
                  {searchTerm.trim() === '' && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400 light:text-gray-600">แสดง:</span>
                      <select
                        value={topN}
                        onChange={(e) => {
                          const newTopN = parseInt(e.target.value);
                          setTopN(newTopN);
                          updateChartWithTopN(newTopN);
                        }}
                        className="bg-slate-700/50 light:bg-gray-100/80 border border-slate-600 light:border-gray-300 rounded-lg px-3 py-2 text-sm text-white light:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={5}>Top 5</option>
                        <option value={10}>Top 10</option>
                        <option value={15}>Top 15</option>
                        <option value={20}>Top 20</option>
                      </select>
                    </div>
                  )}

                  {/* Search Mode Indicator */}
                  {searchTerm.trim() !== '' && (
                    <div className="flex items-center gap-2 bg-cyan-600/20 light:bg-cyan-50/80 border border-cyan-500/30 light:border-cyan-200/70 rounded-lg px-3 py-2">
                      <span className="text-cyan-300 light:text-cyan-800 text-sm">🔍 โหมดค้นหา</span>
                      <button
                        onClick={clearSearch}
                        className="text-cyan-300 light:text-cyan-800 hover:text-white light:hover:text-cyan-900 transition-colors duration-200 text-sm"
                      >
                        ✕ ล้าง
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-slate-400 light:text-gray-600">
                    <span className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></span>
                    อัปเดตล่าสุด: {new Date().toLocaleString('th-TH')}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className={`transition-all duration-300 ${isAnimating ? 'opacity-90' : 'opacity-100'}`}>
                  {getChartComponent()}
                </div>
                
                {/* Info Card */}
                {searchTerm.trim() === '' && originalData.length > topN && (
                  <div className="mt-6 bg-slate-700/30 light:bg-gray-100/80 backdrop-blur-sm rounded-xl p-4 border border-slate-600/50 light:border-gray-200/70">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-500 light:bg-gray-600 rounded-full"></div>
                        <span className="text-slate-300 light:text-gray-800">
                          กำลังแสดง {Math.min(topN, originalData.length)} หัวข้อ จากทั้งหมด {originalData.length} หัวข้อ
                        </span>
                      </div>
                      <div className="text-slate-400 light:text-gray-700">
                        {originalData.length > topN && (
                          <span>
                            หัวข้อที่ไม่แสดง: {originalData.length - topN} หัวข้อ 
                            ({originalData.slice(topN).reduce((sum, item) => sum + item.count, 0)} รายการ)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Search Results Info */}
                {searchTerm.trim() !== '' && (
                  <div className="mt-6 bg-cyan-700/20 light:bg-cyan-50/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-600/50 light:border-cyan-200/70">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-cyan-500 light:bg-cyan-700 rounded-full animate-pulse"></div>
                        <span className="text-cyan-300 light:text-cyan-800">
                          ผลการค้นหา "{searchTerm}" {filteredData.length} หัวข้อ
                        </span>
                      </div>
                      <div className="text-cyan-400 light:text-cyan-700">
                        {filteredData.length > 0 && (
                          <span>
                            รายการทั้งหมด: {filteredData.reduce((sum, item) => sum + item.count, 0)} รายการ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
