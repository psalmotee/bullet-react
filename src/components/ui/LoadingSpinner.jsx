const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 ${sizes[size]} ${className}`} />
  );
};

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export { LoadingSpinner, LoadingScreen };
export default LoadingSpinner;