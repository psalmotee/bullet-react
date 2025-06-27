import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/firebase';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

export const useComments = (discussionId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    if (!discussionId) return;
    
    try {
      setLoading(true);
      const q = query(
        collection(db, "comments"),
        where("discussionId", "==", discussionId)
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(results);
    } catch (error) {
      toast.error("Failed to fetch comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [discussionId]);

  return { comments, loading, refetch: fetchComments };
};

export const useCommentActions = () => {
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const createComment = async (discussionId, formData) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Not signed in.");
      return false;
    }

    setCreateLoading(true);
    try {
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists()
        ? userSnap.data()
        : { firstName: "Anonymous", lastName: "" };
      const fullName = `${userData.firstName} ${userData.lastName}`;

      await addDoc(collection(db, "comments"), {
        discussionId,
        body: formData.body,
        createdAt: Timestamp.now(),
        authorName: fullName,
      });

      toast.success("Comment created successfully");
      return true;
    } catch (error) {
      toast.error("Failed to create comment.");
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, "comments", commentId));
      toast.success("Comment deleted successfully");
      return true;
    } catch (error) {
      toast.error("Failed to delete comment");
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    createComment,
    deleteComment,
    createLoading,
    deleteLoading,
  };
};