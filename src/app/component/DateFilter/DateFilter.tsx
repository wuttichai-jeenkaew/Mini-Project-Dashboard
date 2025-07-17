import React, { useState, useRef, useEffect } from 'react';

interface DateFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyFilter,
  onClearFilter,
}) => {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const dateFilterRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
        setShowDateFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleApplyDateFilter = () => {
    setShowDateFilter(false);
    onApplyFilter();
  };

  const handleClearDateFilter = () => {
    onClearFilter();
    setShowDateFilter(false);
  };

  return (
    <div className="relative" ref={dateFilterRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering sort
          setShowDateFilter(!showDateFilter);
        }}
        className={`p-1 rounded transition-colors ${
          startDate || endDate
            ? 'text-blue-400 hover:text-blue-300'
            : 'text-gray-400 hover:text-gray-300'
        }`}
        title="กรองตามวันที่"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {(startDate || endDate) && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
        )}
      </button>

      {/* Date Filter Popup */}
      {showDateFilter && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl z-50">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">กรองตามวันที่</h3>
              <button
                type="button"
                onClick={() => setShowDateFilter(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  วันที่เริ่มต้น
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={onStartDateChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  วันที่สิ้นสุด
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={onEndDateChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleApplyDateFilter}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded transition-colors"
              >
                ใช้งาน
              </button>
              <button
                type="button"
                onClick={handleClearDateFilter}
                className="px-3 py-1.5 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded transition-colors"
              >
                ล้าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
