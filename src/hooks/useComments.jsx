import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../firebase/firebase';
import { commentService } from '../services/commentService';
import { userService } from '../services/userService';

export const useComments = (discussionId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const data = await commentService.getByDiscussionId(discussionId);
      setComments(data);
    } catch (error) {
      toast.error("Failed to fetch comments.");
    }
  };

  const createComment = async (body) => {
    const user = auth.currentUser;
    if (!user) return toast.error("Not signed in.");

    try {
      const userData = await userService.getById(user.uid);
      const authorName = userData 
        ? `${userData.firstName} ${userData.lastName}` 
        : "Anonymous";

      await commentService.create({
        discussionId,
        body,
        authorName,
      });

      toast.success("Comment created.");
      await fetchComments();
    } catch (error) {
      toast.error("Failed to create comment.");
    }
  };

  const deleteComment = async (id) => {
    try {
      await commentService.delete(id);
      toast.success("Comment Deleted");
      await fetchComments();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete comment");
    }
  };

  useEffect(() => {
    if (discussionId) {
      fetchComments();
    }
  }, [discussionId]);

  return {
    comments,
    loading,
    createComment,
    deleteComment,
    fetchComments
  };
};