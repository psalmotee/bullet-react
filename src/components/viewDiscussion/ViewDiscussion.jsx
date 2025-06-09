import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { LuPen } from "react-icons/lu";
import { HiMiniPlus } from "react-icons/hi2";
import { toast } from "react-toastify";
import { PrimaryButton } from "../common/Button";
import { DeleteConfirmationModal } from "../common/Modal";
import { UpdateDiscussionDrawer } from "./UpdateDiscussionDrawer";
import { CreateCommentDrawer } from "./CreateCommentDrawer";
import { CommentsList } from "./CommentsList";
import { discussionService } from "../../services/discussionService";
import { useComments } from "../../hooks/useComments";
import { formatDate } from "../../utils/dateFormatter";

function ViewDiscussionPage() {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateDrawerOpen, setUpdateDrawerOpen] = useState(false);
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { comments, createComment, deleteComment } = useComments(id);

  const fetchDiscussion = async () => {
    try {
      const data = await discussionService.getById(id);
      if (data) {
        setDiscussion(data);
      } else {
        toast.error("Discussion not found.");
      }
    } catch (error) {
      toast.error("Failed to fetch discussion.");
      console.error("Discussion fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const handleUpdateDiscussion = async (title, body) => {
    setUpdating(true);
    try {
      await discussionService.update(id, { title, body });
      toast.success("Updated successfully!");
      setDiscussion((prev) => ({ ...prev, title, body }));
      setUpdateDrawerOpen(false);
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateComment = async (body) => {
    await createComment(body);
    setCommentDrawerOpen(false);
  };

  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;

    setDeleteLoading(true);
    await deleteComment(commentToDelete);
    setDeleteLoading(false);
    setModalOpen(false);
    setCommentToDelete(null);
  };

  if (loading || !discussion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-semibold">{discussion.title}</h1>

      <div className="mt-8 w-full">
        <p className="text-xs font-bold">
          {formatDate(discussion.createdAt)}
          <span className="text-ms font-bold text-gray-800">
            {" "}
            by {discussion.authorName || "Unknown"}
          </span>
        </p>

        <div className="flex justify-end mt-6">
          <PrimaryButton
            onClick={() => setUpdateDrawerOpen(true)}
            icon={<LuPen size="1rem" />}
          >
            Update Discussion
          </PrimaryButton>

          <UpdateDiscussionDrawer
            open={updateDrawerOpen}
            onClose={() => setUpdateDrawerOpen(false)}
            onSubmit={handleUpdateDiscussion}
            loading={updating}
            discussion={discussion}
          />
        </div>

        <div className="px-4 py-5 mt-16 bg-white shadow-md rounded-lg w-full">
          <p className="text-gray-800 whitespace-pre-line px-4 py-4">
            {discussion.body}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-7 mb-4">
        <h3 className="text-xl font-bold">Comments</h3>
        <PrimaryButton
          onClick={() => setCommentDrawerOpen(true)}
          icon={<HiMiniPlus size="1rem" />}
        >
          Create Comment
        </PrimaryButton>

        <CreateCommentDrawer
          open={commentDrawerOpen}
          onClose={() => setCommentDrawerOpen(false)}
          onSubmit={handleCreateComment}
        />
      </div>

      <div className="mt-4 mb-8 w-full overflow-x-auto">
        <CommentsList comments={comments} onDelete={handleDeleteClick} />

        <DeleteConfirmationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
          title="Delete Comment"
          message="Are you sure you want to delete this comment?"
        />
      </div>
    </div>
  );
}

export default ViewDiscussionPage;
