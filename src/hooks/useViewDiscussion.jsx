import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export const useViewDiscussion = (id) => {
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDiscussion = async () => {
    if (!id) return;
    
    try {
      const docRef = doc(db, "discussions", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDiscussion({ id: docSnap.id, ...data });
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

  return { discussion, loading, refetch: fetchDiscussion, setDiscussion };
};

export const useViewDiscussionActions = () => {
  const [updating, setUpdating] = useState(false);

  const updateDiscussion = async (id, formData) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, "discussions", id), {
        title: formData.title,
        content: formData.content,
      });
      toast.success("Discussion updated successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to update discussion.");
      console.error("Update error:", error);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return { updateDiscussion, updating };
};