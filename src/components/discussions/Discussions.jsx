import { Plus } from "lucide-react";
import { useDiscussions, useDiscussionActions } from "../../hooks/useDiscussions";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import DiscussionForm from "./DiscussionForm";
import DiscussionList from "./DiscussionList";

const Discussions = () => {
  const { discussions, loading, refetch } = useDiscussions();
  const { createDiscussion, deleteDiscussion, createLoading } = useDiscussionActions();
  const { isOpen: isDrawerOpen, open: openDrawer, close: closeDrawer } = useModal();

  const handleCreateDiscussion = async (formData) => {
    const success = await createDiscussion(formData);
    if (success) {
      await refetch();
      closeDrawer();
    }
  };

  const handleDeleteDiscussion = async (discussionId) => {
    const success = await deleteDiscussion(discussionId);
    if (success) {
      await refetch();
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Discussions</h1>
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-6">
        {/* Create Discussion Button */}
        <div className="flex justify-end">
          <Button size="sm" onClick={openDrawer}>
            <Plus size={16} />
            <span className="mx-2">Create Discussion</span>
          </Button>
        </div>

        {/* Discussion List */}
        <div className="mt-2">
          <DiscussionList
            discussions={discussions}
            loading={loading}
            onDelete={handleDeleteDiscussion}
          />

          {/* Create Discussion Drawer */}
          <Drawer
            isOpen={isDrawerOpen}
            onClose={closeDrawer}
            title="Create Discussion"
          >
            <DiscussionForm
              onSubmit={handleCreateDiscussion}
              onCancel={closeDrawer}
              loading={createLoading}
              submitText="Submit"
            />
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default Discussions;