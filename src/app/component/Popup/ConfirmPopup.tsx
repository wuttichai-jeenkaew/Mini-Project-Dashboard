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
    blue: "from-blue-500/90 to-blue-600/90 hover:from-blue-600 hover:to-blue-700 light:from-blue-100 light:to-blue-200 light:hover:from-blue-200 light:hover:to-blue-300 light:text-blue-900",
    red: "from-red-500/90 to-red-600/90 hover:from-red-600 hover:to-red-700 light:from-red-100 light:to-red-200 light:hover:from-red-200 light:hover:to-red-300 light:text-red-900",
    green: "from-emerald-500/90 to-emerald-600/90 hover:from-emerald-600 hover:to-emerald-700 light:from-emerald-100 light:to-emerald-200 light:hover:from-emerald-200 light:hover:to-emerald-300 light:text-emerald-900",
    orange: "from-orange-500/90 to-orange-600/90 hover:from-orange-600 hover:to-orange-700 light:from-orange-100 light:to-orange-200 light:hover:from-orange-200 light:hover:to-orange-300 light:text-orange-900",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg bg-black/40 animate-in fade-in duration-300">
      <div className="bg-gray-900/90 border border-gray-600/50 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center backdrop-blur-xl mx-4 animate-in slide-in-from-bottom-4 duration-300 lightmode-popup-bg">
        <div className="flex flex-col items-center gap-4 mb-6">
          {icon && (
            <div className="bg-gradient-to-tr from-gray-600 via-gray-500 to-gray-400 rounded-full p-4 shadow-lg animate-in zoom-in duration-500">
              {icon}
            </div>
          )}
          <h2 className="text-2xl font-bold text-white drop-shadow animate-in slide-in-from-top-2 duration-300 delay-100 light:text-gray-900">{title}</h2>
          <div className="text-gray-300 light:text-gray-600 text-base leading-relaxed animate-in slide-in-from-top-2 duration-300 delay-200">
            {message}
          </div>
        </div>
        <div className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300 delay-300">
          {cancelText && (
            <button
              onClick={handleClose}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-500/80 to-gray-600/80 hover:from-gray-600 hover:to-gray-700 light:from-gray-100 light:to-gray-200 light:hover:from-gray-200 light:hover:to-gray-300 light:text-gray-900 text-white rounded-xl font-semibold transition-all duration-200 shadow-md backdrop-blur-md hover:scale-105 active:scale-95 transform lightmode-popup-btn"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`flex-1 px-6 py-3 bg-gradient-to-r ${confirmColorClasses[confirmButtonColor]} text-white rounded-xl font-semibold transition-all duration-200 shadow-md backdrop-blur-md hover:scale-105 active:scale-95 transform hover:shadow-lg lightmode-popup-btn`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
