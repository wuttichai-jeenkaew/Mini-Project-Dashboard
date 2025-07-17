interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <button
        className="px-3 py-1.5 bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-blur-sm text-white rounded-lg font-semibold hover:from-gray-800/90 hover:to-gray-900/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-600/30 flex items-center gap-2 text-sm"
        onClick={handlePrevious}
        disabled={currentPage === 1}
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        ก่อนหน้า
      </button>
      <span className="text-white font-semibold">
        หน้า {currentPage} จาก {totalPages || 1}
      </span>
      <button
        className="px-3 py-1.5 bg-gradient-to-r from-gray-700/80 to-gray-800/80 backdrop-blur-sm text-white rounded-lg font-semibold hover:from-gray-800/90 hover:to-gray-900/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-600/30 flex items-center gap-2 text-sm"
        onClick={handleNext}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        ถัดไป
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
