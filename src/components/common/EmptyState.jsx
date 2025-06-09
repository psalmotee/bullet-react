import React from 'react';
import { LuArchiveX } from 'react-icons/lu';

export const EmptyState = ({ 
  message = "No Entries Found",
  icon = <LuArchiveX size="4rem" color="gray" />,
  className = ""
}) => (
  <div className={`flex flex-col items-center justify-center p-10 ${className}`}>
    {icon}
    <h4 className="text-gray-500 text-lg">{message}</h4>
  </div>
);