import React from "react";

function NetworkListnerToast() {
  return (
    <div
      className="
      fixed bottom-6 left-1/2 transform -translate-x-1/2
      bg-red-600/50 
      
      shadow-lg
      rounded-lg
      px-6 py-3
      min-w-[320px]
      max-w-sm
      flex items-center
      space-x-3
      z-[9999]
      animate-slideInUp
    "
      role="alert"
      aria-live="assertive"
    >
      <svg
        className="w-6 h-6 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
        ></path>
      </svg>
      <p className="text-sm font-medium text-white">
        You are offline. Please check your internet connection.
      </p>
    </div>
  );
}

export default NetworkListnerToast;
