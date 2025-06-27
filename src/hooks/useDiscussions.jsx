import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase';
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

export const useDiscussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "discussions"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDiscussions(data);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      toast.error("Failed to fetch discussions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  return { discussions, loading, refetch: fetchDiscussions };
};

export const useDiscussionActions = () => {
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const createDiscussion = async (formData) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("User not signed in.");
      return false;
    }

    setCreateLoading(true);
    try {
      const userDocRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        toast.error("User details not found.");
        return false;
      }

      const userData = userSnap.data();
      const fullName = `${userData.firstName} ${userData.lastName}`;

      const newDiscussion = {
        title: formData.title,
        content: formData.content,
        createdBy: user.uid,
        authorName: fullName,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "discussions"), newDiscussion);
      toast.success("Discussion created successfully");
      return true;
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast.error("Failed to create discussion");
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteDiscussion = async (discussionId) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, "discussions", discussionId));
      toast.success("Discussion deleted successfully");
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete discussion");
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    createDiscussion,
    deleteDiscussion,
    createLoading,
    deleteLoading,
  };
};