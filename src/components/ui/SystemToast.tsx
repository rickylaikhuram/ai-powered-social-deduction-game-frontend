// src/components/ui/SystemToast.tsx
export const SystemToast: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600/90 text-white px-6 py-3 rounded-lg z-50 shadow-lg border border-blue-400">
      {message}
    </div>
  );
};