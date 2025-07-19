import React from 'react';

interface StatsCardsProps {
  total: number;
  page: number;
  totalPages: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ total, page, totalPages }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* จำนวนรายการทั้งหมด */}
      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 light:from-blue-50/80 light:to-blue-100/60 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30 light:border-blue-200/70 shadow-xl transform transition-all duration-700 hover:scale-105 hover:shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-300 light:text-blue-800 text-sm font-medium">จำนวนรายการทั้งหมด</p>
            <p className="text-3xl font-bold text-white light:text-gray-900 mt-1 transition-all duration-300">
              {total}
            </p>
          </div>
          <div className="text-blue-400 light:text-blue-700 text-3xl animate-bounce">📄</div>
        </div>
      </div>

      {/* หน้าปัจจุบัน */}
      <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 light:from-green-50/80 light:to-green-100/60 backdrop-blur-md rounded-2xl p-6 border border-green-500/30 light:border-green-200/70 shadow-xl transform transition-all duration-700 hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-300 light:text-green-800 text-sm font-medium">หน้าปัจจุบัน</p>
            <p className="text-3xl font-bold text-white light:text-gray-900 mt-1 transition-all duration-300">
              {page}
            </p>
          </div>
          <div className="text-green-400 light:text-green-700 text-3xl animate-pulse">📖</div>
        </div>
      </div>

      {/* จำนวนหน้าทั้งหมด */}
      <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 light:from-purple-50/80 light:to-purple-100/60 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 light:border-purple-200/70 shadow-xl transform transition-all duration-700 hover:scale-105 hover:shadow-2xl animate-fade-in-up animation-delay-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-300 light:text-purple-800 text-sm font-medium">จำนวนหน้าทั้งหมด</p>
            <p className="text-3xl font-bold text-white light:text-gray-900 mt-1 transition-all duration-300">
              {totalPages}
            </p>
          </div>
          <div className="text-purple-400 light:text-purple-700 text-3xl animate-bounce animation-delay-100">📚</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
