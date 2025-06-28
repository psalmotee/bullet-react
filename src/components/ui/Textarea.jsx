import { forwardRef } from 'react';

const Textarea = forwardRef(({ 
  label, 
  error, 
  required = false,
  className = '',
  rows = 4,
  ...props 
}, ref) => {
  const baseClasses = 'block w-full min-h-[60px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-50 disabled:text-gray-500 resize-vertical';
  
  return (
    <div className="grid grid-cols-1 gap-1 w-full">
      {label && (
        <label className="text-sm font-medium">
          <span className={required ? "after:ml-0.5 after:text-red-500 after:content-['*']" : ""}>
            {label}
          </span>
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`${baseClasses} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;