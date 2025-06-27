import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'lucide-react';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { ConfirmModal } from '../ui/Modal';
import { LoadingScreen } from "../ui/LoadingSpinner";


const DiscussionList = ({ 
  discussions = [], 
  loading = false, 
  onDelete 
}) => {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, discussionId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteClick = (discussionId) => {
    setDeleteModal({ isOpen: true, discussionId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.discussionId) return;
    
    setDeleteLoading(true);
    try {
      await onDelete(deleteModal.discussionId);
      setDeleteModal({ isOpen: false, discussionId: null });
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg flex justify-center items-center h-64">
        <LoadingScreen message="Loading discussion..." />
      </div>
    );
  }

  if (discussions.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg">
        <EmptyState 
          title="No discussions found"
          description="Create your first discussion to get started"
        />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 ">
            <thead className="bg-gray-50">
              <tr>
                <th className="h-10 px-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Author
                </th>
                <th className="h-10 px-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Title
                </th>
                <th className="h-10 px-2 text-left text-sm font-medium text-gray-500 tracking-wider">
                  Created At
                </th>
                <th
                  colSpan="2"
                  className="h-10 px-2 text-left text-sm font-medium text-gray-500 tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discussions.map((discussion) => (
                <tr
                  key={discussion.id}
                  className="odd:bg-white even:bg-gray-200 hover:odd:bg-gray-100 hover:even:bg-gray-300"
                >
                  <td className="p-2 whitespace-nowrap text-sm text-gray-900">
                    {discussion.authorName || "Unknown"}
                  </td>
                  <td className="p-2 whitespace-nowrap text-sm text-gray-900">
                    {discussion.title}
                  </td>
                  <td className="p-2 whitespace-nowrap text-sm text-gray-500">
                    {discussion.createdAt
                      ? discussion.createdAt.toDate().toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "N/A"}
                  </td>
                  <td className="p-2 whitespace-nowrap text-xs font-medium">
                    <a
                      onClick={() =>
                        navigate(`/dashboard/discussions/${discussion.id}`)
                      }
                      className="text-sm font-normal text-gray-600 hover:text-gray-900 transition duration-300 ease-in-out cursor-pointer"
                    >
                      View
                    </a>
                  </td>
                  <td className="p-2 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(discussion.id)}
                    >
                      <Trash size={16} />
                      <span className="sr-only">Delete Discussion</span>
                      <span className="mx-2">Delete Discussion</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, discussionId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Discussion"
        message="Are you sure you want to delete this discussion?"
        confirmText="Delete Discussion"
        loading={deleteLoading}
      />
    </>
  );
};

export default DiscussionList;