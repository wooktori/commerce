export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-5">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
};
