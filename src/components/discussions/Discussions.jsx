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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold text-gray-900">Discussions</h1>
        <Button onClick={openDrawer}>
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
        onClose={closeDrawer}
        title="Create Discussion"
        size="lg"
      >
        <DiscussionForm
          onSubmit={handleCreateDiscussion}
          onCancel={closeDrawer}
          loading={createLoading}
          submitText="Create Discussion"
        />
      </Drawer>
    </div>
  );
};

export default Discussions;