import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  required = false,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'block w-full px-3 py-1 h-9 border border-gray-300 rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-50 disabled:text-gray-500 input validator';
  
  return (
    <div className="grid grid-cols-1 gap-1 w-full">
      {label && (
        <label className="text-sm font-medium">
          <span className={required ? "after:ml-0.5 after:text-red-500 after:content-['*']" : ""}>
            {label}
          </span>
        </label>
      )}
      <input
        ref={ref}
        className={`${baseClasses} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;