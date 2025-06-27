import { useParams } from "react-router-dom";
import { useState } from "react";
import { Pen } from "lucide-react";
import { useViewDiscussion, useViewDiscussionActions } from "../../hooks/useViewDiscussion";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import DiscussionForm from "../discussions/DiscussionForm";
import Comments from "../comments/Comments";
import { LoadingScreen } from "../ui/LoadingSpinner";

const ViewDiscussion = () => {
  const { id } = useParams();
  const { discussion, loading, setDiscussion } = useViewDiscussion(id);
  const { updateDiscussion, updating } = useViewDiscussionActions();
  const { isOpen: isDrawerOpen, open: openDrawer, close: closeDrawer } = useModal();

  const handleUpdateDiscussion = async (formData) => {
    const success = await updateDiscussion(id, formData);
    if (success) {
      setDiscussion((prev) => ({
        ...prev,
        title: formData.title,
        content: formData.content,
      }));
      closeDrawer();
    }
  };

  const handleCloseDrawer = () => {
    closeDrawer();
  };

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
            <Button size="sm" onClick={openDrawer}>
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
          onClose={handleCloseDrawer}
          title="Update Discussion"
        >
          <DiscussionForm
            initialData={{
              title: discussion.title,
              content: discussion.content,
            }}
            onSubmit={handleUpdateDiscussion}
            onCancel={handleCloseDrawer}
            loading={updating}
            submitText="Submit"
          />
        </Drawer>
      </div>
    </div>
  );
};

export default ViewDiscussion;