import React from 'react';

export const TextInput = ({ 
  label, 
  id, 
  value, 
  onChange, 
  type = "text",
  className = "" 
}) => (
  <div>
    <label htmlFor={id} className="text-md font-semibold">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className={`mt-1 block w-full h-9 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 ${className}`}
    />
  </div>
);

export const TextArea = ({ 
  label, 
  id, 
  value, 
  onChange, 
  rows = 4,
  className = "" 
}) => (
  <div>
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`mt-1 block w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 ${className}`}
    />
  </div>
);