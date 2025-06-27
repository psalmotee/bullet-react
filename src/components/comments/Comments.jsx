import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useComments, useCommentActions } from "../../hooks/useComments";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const Comments = () => {
  const { id } = useParams();
  const { comments, loading, refetch } = useComments(id);
  const { createComment, deleteComment, createLoading } = useCommentActions();
  const { isOpen: isDrawerOpen, open: openDrawer, close: closeDrawer } = useModal();

  const handleCreateComment = async (formData) => {
    const success = await createComment(id, formData);
    if (success) {
      await refetch();
      closeDrawer();
    }
  };

  const handleDeleteComment = async (commentId) => {
    const success = await deleteComment(commentId);
    if (success) {
      await refetch();
    }
  };

  return (
    <div className="flex flex-col w-full py-6 sm:py-0">
      {/* Header */}
      <div className="flex justify-between  mt-8 mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Comments</h3>
        <Button size="sm" onClick={openDrawer}>
          <Plus size={16} />
          <span className="mx-2">Create Comment</span>
        </Button>
      </div>

      {/* Comments List */}
      <CommentList
        comments={comments}
        onDelete={handleDeleteComment}
        loading={loading}
      />

      {/* Create Comment Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title="Create Comment"
      >
        <CommentForm
          onSubmit={handleCreateComment}
          onCancel={closeDrawer}
          loading={createLoading}
          submitText="Submit"
        />
      </Drawer>
    </div>
  );
};

export default Comments;