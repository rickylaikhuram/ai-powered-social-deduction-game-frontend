import React from "react";

interface ErrorToastProps {
  message: string;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({ message }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-lg z-50 shadow-lg">
      {message}
    </div>
  );
};
