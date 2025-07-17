"use client";

import React, { ReactNode } from "react";

interface FormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: () => void;
  submitText?: string;
  cancelText?: string;
  submitButtonColor?: "blue" | "green" | "red";
  isLoading?: boolean;
}

export default function FormPopup({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitText = "บันทึก",
  cancelText = "ยกเลิก",
  submitButtonColor = "green",
  isLoading = false,
}: FormPopupProps) {
  if (!isOpen) return null;

  const submitColorClasses = {
    blue: "from-blue-600/80 to-blue-700/80 hover:from-blue-600 hover:to-blue-700",
    green: "from-green-600/80 to-green-700/80 hover:from-green-600 hover:to-green-700",
    red: "from-red-600/80 to-red-700/80 hover:from-red-600 hover:to-red-700",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg bg-black/40 animate-in fade-in duration-300">
      <div className="bg-gray-900/90 border border-gray-600/50 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-6 animate-in slide-in-from-top-2 duration-300 delay-100">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors hover:scale-110 active:scale-95 transform duration-200"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6 animate-in slide-in-from-bottom-2 duration-300 delay-200">{children}</div>

        <div className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300 delay-300">
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className={`flex-1 bg-gradient-to-r ${submitColorClasses[submitButtonColor]} text-white py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md backdrop-blur-sm ${
              isLoading ? "opacity-75 cursor-not-allowed scale-95" : "hover:scale-105"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-5 h-5 rounded-full border-2 border-white/20"></div>
                  <div className="absolute inset-0 w-5 h-5 rounded-full border-2 border-transparent border-t-white border-r-white/70 animate-spin"></div>
                  <div className="absolute inset-0.5 w-4 h-4 rounded-full border border-transparent border-b-white/50 animate-spin animate-reverse"></div>
                  <div className="absolute inset-1.5 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            ) : (
              <>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {submitText}
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-gray-600/80 to-gray-700/80 text-white py-2 px-4 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md backdrop-blur-sm hover:scale-105 active:scale-95 transform hover:shadow-lg"
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
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
