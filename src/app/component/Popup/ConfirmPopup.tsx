"use client";

import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  confirmButtonColor?: "blue" | "red" | "green" | "orange";
  redirectToLogin?: boolean;
}

export default function ConfirmPopup({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  icon,
  confirmButtonColor = "blue",
  redirectToLogin = false,
}: ConfirmPopupProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (redirectToLogin) {
      router.push("/pages/login");
    } else {
      onConfirm();
    }
  };

  const handleClose = () => {
    onClose();
  };

  const confirmColorClasses = {
    blue: "from-blue-600/80 to-blue-700/80 hover:from-blue-600 hover:to-blue-700",
    red: "from-red-600/80 to-red-700/80 hover:from-red-600 hover:to-red-700",
    green: "from-green-600/80 to-green-700/80 hover:from-green-600 hover:to-green-700",
    orange: "from-orange-600/80 to-orange-700/80 hover:from-orange-600 hover:to-orange-700",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg bg-black/40 animate-in fade-in duration-300">
      <div className="bg-gray-900/90 border border-gray-600/50 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center backdrop-blur-xl mx-4 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col items-center gap-4 mb-6">
          {icon && (
            <div className="bg-gradient-to-tr from-gray-600 via-gray-500 to-gray-400 rounded-full p-4 shadow-lg animate-in zoom-in duration-500">
              {icon}
            </div>
          )}
          <h2 className="text-2xl font-bold text-white drop-shadow animate-in slide-in-from-top-2 duration-300 delay-100">{title}</h2>
          <div className="text-gray-300 text-base leading-relaxed animate-in slide-in-from-top-2 duration-300 delay-200">
            {message}
          </div>
        </div>
        <div className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300 delay-300">
          {cancelText && (
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600/80 to-gray-700/80 text-white rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-md backdrop-blur-sm hover:scale-105 active:scale-95 transform"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`flex-1 px-6 py-3 bg-gradient-to-r ${confirmColorClasses[confirmButtonColor]} text-white rounded-lg font-semibold transition-all duration-200 shadow-md backdrop-blur-sm hover:scale-105 active:scale-95 transform hover:shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
