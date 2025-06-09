import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../firebase/firebase';
import { discussionService } from '../services/discussionService';
import { userService } from '../services/userService';

export const useDiscussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const data = await discussionService.getAll();
      setDiscussions(data);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      toast.error("Failed to fetch discussions");
    } finally {
      setLoading(false);
    }
  };

  const createDiscussion = async (title, content) => {
    if (!title.trim()) return;

    const user = auth.currentUser;
    if (!user) return toast.error("User not signed in.");

    try {
      const userData = await userService.getById(user.uid);
      if (!userData) {
        toast.error("User details not found.");
        return;
      }

      const fullName = `${userData.firstName} ${userData.lastName}`;
      const newDiscussion = {
        title,
        content,
        createdBy: user.uid,
        authorName: fullName,
        createdAt: new Date(),
      };

      await discussionService.create(newDiscussion);
      await fetchDiscussions();
      toast.success("Discussion Created");
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast.error("Failed to create discussion");
    }
  };

  const deleteDiscussion = async (id) => {
    try {
      await discussionService.delete(id);
      toast.success("Discussion Deleted");
      await fetchDiscussions();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete discussion");
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  return {
    discussions,
    loading,
    createDiscussion,
    deleteDiscussion,
    fetchDiscussions
  };
};