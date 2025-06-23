import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { ConfirmModal } from '../ui/Modal';

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discussions.map((discussion) => (
                <tr key={discussion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {discussion.authorName || "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {discussion.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discussion.createdAt
                      ? discussion.createdAt.toDate().toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button
                      onClick={() => navigate(`/dashboard/discussions/${discussion.id}`)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors"
                    >
                      View
                    </button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(discussion.id)}
                    >
                      <Trash2 size={16} />
                      Delete
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
        message="Are you sure you want to delete this discussion? This action cannot be undone."
        confirmText="Delete"
        loading={deleteLoading}
      />
    </>
  );
};

export default DiscussionList;