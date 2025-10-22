import React from 'react';

const OverlaySpinner = ({ message = 'Caricamento...' }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white/95 rounded-lg p-6 flex flex-col items-center gap-3 shadow-lg max-w-xs">
        <svg className="animate-spin h-10 w-10 text-blue-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <div className="text-sm font-medium text-gray-800">{message}</div>
      </div>
    </div>
  );
};

export default OverlaySpinner;
