import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { auth, db } from "../../firebase/firebase";
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
} from "firebase/firestore";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const Comments = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "comments"),
        where("discussionId", "==", id)
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

  const handleCreateComment = async (formData) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Not signed in.");
      return;
    }

    setCommentLoading(true);
    try {
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists()
        ? userSnap.data()
        : { firstName: "Anonymous", lastName: "" };
      const fullName = `${userData.firstName} ${userData.lastName}`;

      await addDoc(collection(db, "comments"), {
        discussionId: id,
        body: formData.body,
        createdAt: Timestamp.now(),
        authorName: fullName,
      });

      toast.success("Comment created successfully");
      await fetchComments();
      setIsDrawerOpen(false);
    } catch (error) {
      toast.error("Failed to create comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteDoc(doc(db, "comments", commentId));
      toast.success("Comment deleted successfully");
      await fetchComments();
    } catch (error) {
      toast.error("Failed to delete comment");
      throw error;
    }
  };

  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id]);

  return (
    <div className="flex flex-col w-full py-6 sm:py-0">
      {/* Header */}
      <div className="flex justify-between  mt-8 mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Comments</h3>
        <Button size="sm" onClick={() => setIsDrawerOpen(true)}>
          <Plus size={16} />
          <span className="sr-only">Create Comment</span>
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
        onClose={() => setIsDrawerOpen(false)}
        title="Create Comment"
      >
        <CommentForm
          onSubmit={handleCreateComment}
          onCancel={() => setIsDrawerOpen(false)}
          loading={commentLoading}
          submitText="Submit"
        />
      </Drawer>
    </div>
  );
};

export default Comments;