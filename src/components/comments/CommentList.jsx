import { useState } from "react";
import { Trash } from "lucide-react";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import { ConfirmModal } from "../ui/Modal";
import { LoadingScreen } from "../ui/LoadingSpinner";

const CommentList = ({ comments = [], onDelete, loading = false }) => {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    commentId: null,
  });
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
      console.error("Delete error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingScreen message="Loading comments..." />
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
      <ul className="space-y-3 flex flex-col">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between mb-3">
              <div className="text-xs text-black">
                <span className="font-semibold">
                  {comment.createdAt?.toDate().toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }) || "Unknown time"}
                </span>
                <span className="font-bold">
                  {" by "}
                  {comment.authorName || "Unknown"}
                </span>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteClick(comment.id)}
              >
                <Trash size={16} />
                <span className="sr-only">Delete Comment</span>
                <span className="mx-2">Delete Comment</span>
              </Button>
            </div>
            <p className="text-gray-800">{comment.body}</p>
          </li>
        ))}
      </ul>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, commentId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        confirmText="Delete Comment"
        loading={deleteLoading}
      />
    </>
  );
};

export default CommentList;
