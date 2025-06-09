import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineDelete } from 'react-icons/ai';
import { DangerButton } from '../common/Button';
import { formatDate } from '../../utils/dateFormatter';

export const DiscussionTable = ({ discussions, onDelete }) => {
  const navigate = useNavigate();

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          <th className="text-left text-sm font-medium text-gray-500">Author</th>
          <th className="text-left text-sm font-medium text-gray-500">Title</th>
          <th className="px-2 py-2 text-left text-sm font-medium text-gray-500">Created At</th>
          <th className="text-left text-sm font-medium text-gray-500">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out">
        {discussions.map((d) => (
          <tr key={d.id}>
            <td className="text-sm text-gray-700">{d.authorName || "Unknown"}</td>
            <td className="whitespace-nowrap">{d.title}</td>
            <td className="px-2 whitespace-nowrap">{formatDate(d.createdAt)}</td>
            <td className="flex px-2 py-2 whitespace-nowrap space-x-10">
              <button 
                onClick={() => navigate(`/dashboard/discussions/${d.id}`)}
                className="h-9 px-3 text-gray-600 hover:text-gray-900 transition duration-300 ease-in-out"
              >
                <span className="flex text-sm items-center gap-2">View</span>
              </button>
              <DangerButton
                onClick={() => onDelete(d.id)}
                icon={<AiOutlineDelete size="1rem" />}
              >
                Delete Discussion
              </DangerButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};