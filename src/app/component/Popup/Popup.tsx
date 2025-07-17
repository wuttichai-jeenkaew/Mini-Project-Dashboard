"use client";

import React, { ReactNode } from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
  showCloseButton?: boolean;
}

export default function Popup({
  isOpen,
  onClose,
  title,
  children,
  actions,
  icon,
  size = "md",
  showCloseButton = true,
}: PopupProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg bg-black/40">
      <div
        className={`bg-gray-900/90 border border-gray-600/50 rounded-2xl shadow-2xl p-6 w-full ${sizeClasses[size]} mx-4 backdrop-blur-xl`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {icon && (
                <div className="bg-gradient-to-tr from-blue-600 via-blue-500 to-blue-400 rounded-full p-4 shadow-lg">
                  {icon}
                </div>
              )}
              {title && (
                <h2 className="text-xl font-bold text-white">{title}</h2>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
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
            )}
          </div>
        )}

        {/* Content */}
        <div className="mb-6">{children}</div>

        {/* Actions */}
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </div>
  );
}
