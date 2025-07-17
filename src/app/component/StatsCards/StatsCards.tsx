import React from 'react';

interface StatsCardsProps {
  total: number;
  page: number;
  totalPages: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ total, page, totalPages }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* จำนวนรายการทั้งหมด */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-lg shadow-lg">
        <div className="flex items-center">
          <div className="p-2 bg-blue-500 rounded-full">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-blue-100 text-sm">
              จำนวนรายการทั้งหมด
            </p>
            <p className="text-white text-xl font-bold">{total}</p>
          </div>
        </div>
      </div>

      {/* หน้าปัจจุบัน */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 rounded-lg shadow-lg">
        <div className="flex items-center">
          <div className="p-2 bg-emerald-500 rounded-full">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-emerald-100 text-sm">หน้าปัจจุบัน</p>
            <p className="text-white text-xl font-bold">{page}</p>
          </div>
        </div>
      </div>

      {/* จำนวนหน้าทั้งหมด */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-lg shadow-lg">
        <div className="flex items-center">
          <div className="p-2 bg-purple-500 rounded-full">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-purple-100 text-sm">
              จำนวนหน้าทั้งหมด
            </p>
            <p className="text-white text-xl font-bold">
              {totalPages}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
