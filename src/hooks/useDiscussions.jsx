import { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

export const useDiscussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDiscussions = async (currentUser) => {
    try {
      setLoading(true);
      if (!currentUser) {
        toast.error("Not authenticated.");
        setDiscussions([]);
        return;
      }

      const userSnap = await getDoc(doc(db, "Users", currentUser.uid));
      const userData = userSnap.data();

      if (!userData) {
        toast.error("User data not found.");
        setDiscussions([]);
        return;
      }

      let q;

      if (userData.role === "Admin") {
        // 🔐 Admin sees all team discussions
        q = query(
          collection(db, "discussions"),
          where("teamId", "==", userData.teamId),
          orderBy("createdAt", "desc")
        );
      } else {
        // 🙋‍♂️ Member sees only their own
        q = query(
          collection(db, "discussions"),
          where("createdBy", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
      }

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchDiscussions(user);
      } else {
        setDiscussions([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    discussions,
    loading,
    refetch: () => fetchDiscussions(auth.currentUser),
  };
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
        teamId: userData.teamId,
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
