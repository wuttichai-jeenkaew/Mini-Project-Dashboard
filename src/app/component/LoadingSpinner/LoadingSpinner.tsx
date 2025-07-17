import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-black/30">
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center w-20 h-20">
          {/* Outer rotating ring with gradient */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-600/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-emerald-500 animate-spin"></div>
          
          {/* Middle ring - counter rotating */}
          <div className="absolute inset-2 rounded-full border-2 border-gray-500/20"></div>
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-500 border-l-pink-500 animate-spin animate-reverse"></div>
          
          {/* Inner pulsing core */}
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 via-emerald-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
