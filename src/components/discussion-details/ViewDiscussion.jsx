import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pen } from "lucide-react";
import { db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import DiscussionForm from "../discussions/DiscussionForm";
import Comments from "../comments/Comments";
import { LoadingScreen } from "../ui/LoadingSpinner";

const ViewDiscussion = () => {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchDiscussion = async () => {
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

  const handleUpdateDiscussion = async (formData) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, "discussions", id), {
        title: formData.title,
        content: formData.content,
      });
      toast.success("Discussion updated successfully!");
      setDiscussion((prev) => ({
        ...prev,
        title: formData.title,
        content: formData.content,
      }));
      setIsDrawerOpen(false);
    } catch (error) {
      toast.error("Failed to update discussion.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDiscussion();
    }
  }, [id]);

  if (loading) {
    return <LoadingScreen message="Loading discussion..." />;
  }

  if (!discussion) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Discussion Not Found
        </h2>
        <p className="text-gray-600">
          The discussion you are looking for does not exist.
        </p>
      </div>
    );
  }

  const formattedDate = discussion.createdAt?.toDate().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Discussion Header */}
      <div className="px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {discussion.title}
        </h1>
      </div>

      <div className="px-4 sm:px-6 md:px-8">
        <p className="text-xs font-bold text-gray-600">
          {formattedDate} by{" "}
          <span className="text-sm font-medium">
            {discussion.authorName || "Unknown"}
          </span>
        </p>

        <div className="flex flex-col mt-6 space-y-16">
          <div className="flex justify-end ">
            <Button size="sm" onClick={() => setIsDrawerOpen(true)}>
              <Pen size={16} />
              <span className="sr-only">Update Discussion</span>
              <span className="mx-2">Update Discussion</span>
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 sm:px-6 py-5">
            {/* Discussion Content */}
            {discussion.content && (
              <div className="prose max-w-none p-2">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {discussion.content}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="">
          <Comments />
        </div>

        {/* Update Discussion Drawer */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Update Discussion"
        >
          <DiscussionForm
            initialData={{
              title: discussion.title,
              content: discussion.content,
            }}
            onSubmit={handleUpdateDiscussion}
            onCancel={() => setIsDrawerOpen(false)}
            loading={updating}
            submitText="Submit"
          />
        </Drawer>
      </div>
    </div>
  );
};

export default ViewDiscussion;
