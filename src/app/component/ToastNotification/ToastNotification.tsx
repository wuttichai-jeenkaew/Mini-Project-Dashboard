import React from 'react';

interface ToastNotificationProps {
  show: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ 
  show, 
  type, 
  message, 
  onClose 
}) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in-right">
      <div
        className={`${
          type === "success"
            ? "bg-gradient-to-r from-green-500 to-emerald-600"
            : "bg-gradient-to-r from-red-500 to-red-600"
        } text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm`}
      >
        <div className="flex-shrink-0">
          {type === "success" ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>
        <div>
          <p className="font-semibold">
            {type === "success" ? "สำเร็จ!" : "เกิดข้อผิดพลาด!"}
          </p>
          <p
            className={`text-sm ${
              type === "success" ? "text-green-100" : "text-red-100"
            }`}
          >
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className={`ml-4 transition-colors ${
            type === "success"
              ? "text-green-100 hover:text-white"
              : "text-red-100 hover:text-white"
          }`}
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
