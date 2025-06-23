import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import EmptyState from '../ui/EmptyState';
import { ConfirmModal } from '../ui/Modal';

const CommentList = ({ comments = [], onDelete, loading = false }) => {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, commentId: null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteClick = (commentId) => {
    setDeleteModal({ isOpen: true, commentId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.commentId) return;
    
    setDeleteLoading(true);
    try {
      await onDelete(deleteModal.commentId);
      setDeleteModal({ isOpen: false, commentId: null });
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <EmptyState 
        title="No comments yet"
        description="Be the first to comment on this discussion"
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  {comment.authorName || "Unknown"}
                </span>
                <span className="mx-2">•</span>
                <span>
                  {comment.createdAt?.toDate().toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }) || "Unknown time"}
                </span>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteClick(comment.id)}
              >
                <Trash2 size={14} />
                Delete
              </Button>
            </div>
            <p className="text-gray-800">{comment.body}</p>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, commentId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        loading={deleteLoading}
      />
    </>
  );
};

export default CommentList;