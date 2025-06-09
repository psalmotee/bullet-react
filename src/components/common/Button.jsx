import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export const PrimaryButton = ({ 
  children, 
  onClick, 
  loading = false, 
  disabled = false, 
  className = "",
  icon = null 
}) => (
  <button
    onClick={onClick}
    disabled={loading || disabled}
    className={`h-8 px-3 gap-2 bg-gray-900 font-medium text-xs text-white rounded-md inline-flex items-center hover:bg-gray-700 transition duration-300 ease-all cursor-pointer ${className}`}
  >
    {loading ? (
      <Spin indicator={<LoadingOutlined spin />} size="small" />
    ) : icon && (
      <span className="mr-2">{icon}</span>
    )}
    {children}
  </button>
);

export const SecondaryButton = ({ 
  children, 
  onClick, 
  className = "" 
}) => (
  <button
    onClick={onClick}
    className={`h-9 px-5 bg-white text-black rounded-md text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer ${className}`}
  >
    {children}
  </button>
);

export const DangerButton = ({ 
  children, 
  onClick, 
  loading = false, 
  icon = null 
}) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="h-8 px-3 bg-red-400 text-white rounded-md text-xs font-medium flex items-center justify-center gap-2 hover:bg-red-300 transition duration-300 ease-in-out cursor-pointer"
  >
    {loading ? (
      <Spin indicator={<LoadingOutlined spin />} size="small" />
    ) : icon && (
      <span className="mr-2">{icon}</span>
    )}
    {children}
  </button>
);

export const SubmitButton = ({ 
  children, 
  onClick, 
  loading = false 
}) => (
  <button
    type="submit"
    onClick={onClick}
    disabled={loading}
    className="h-9 px-5 bg-gray-900 text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer"
  >
    {loading && (
      <Spin indicator={<LoadingOutlined spin />} size="small" />
    )}
    {children}
  </button>
);