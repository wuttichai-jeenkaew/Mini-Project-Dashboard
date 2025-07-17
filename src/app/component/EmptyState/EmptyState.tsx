interface EmptyStateProps {
  onAddData: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddData }) => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
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
      <p className="text-white text-lg font-semibold mb-2">
        ไม่พบข้อมูล
      </p>
      <p className="text-gray-400 mb-6">ยังไม่มีข้อมูลในระบบ</p>
      
      {/* ปุ่มเพิ่มข้อมูลเมื่อไม่มีข้อมูล */}
      <button
        className="px-4 py-2 bg-gradient-to-r from-blue-600/80 to-blue-700/80 backdrop-blur-sm text-white rounded-lg font-semibold hover:from-blue-700/90 hover:to-blue-800/90 transition-all duration-200 shadow-lg hover:shadow-xl border border-blue-500/30 flex items-center gap-2 mx-auto"
        onClick={onAddData}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        เพิ่มข้อมูล
      </button>
    </div>
  );
};

export default EmptyState;
