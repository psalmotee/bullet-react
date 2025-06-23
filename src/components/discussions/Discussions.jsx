import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { db, auth } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import DiscussionForm from "./DiscussionForm";
import DiscussionList from "./DiscussionList";

const Discussions = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const handleCreateDiscussion = async (formData) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("User not signed in.");
      return;
    }

    setCreateLoading(true);
    try {
      const userDocRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        toast.error("User details not found.");
        return;
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
      await fetchDiscussions();
      setIsDrawerOpen(false);
      toast.success("Discussion created successfully");
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast.error("Failed to create discussion");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteDiscussion = async (discussionId) => {
    try {
      await deleteDoc(doc(db, "discussions", discussionId));
      toast.success("Discussion deleted successfully");
      await fetchDiscussions();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete discussion");
      throw error;
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Discussions</h1>
        <Button onClick={() => setIsDrawerOpen(true)}>
          <Plus size={16} />
          Create Discussion
        </Button>
      </div>

      {/* Discussion List */}
      <DiscussionList
        discussions={discussions}
        loading={loading}
        onDelete={handleDeleteDiscussion}
      />

      {/* Create Discussion Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Create Discussion"
        size="lg"
      >
        <DiscussionForm
          onSubmit={handleCreateDiscussion}
          onCancel={() => setIsDrawerOpen(false)}
          loading={createLoading}
          submitText="Create Discussion"
        />
      </Drawer>
    </div>
  );
};

export default Discussions;