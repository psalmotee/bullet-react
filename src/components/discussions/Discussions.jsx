import React, { useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { HiMiniPlus } from "react-icons/hi2";
import { PrimaryButton } from "../common/Button";
import { EmptyState } from "../common/EmptyState";
import { Pagination } from "../common/Pagination";
import { DeleteConfirmationModal } from "../common/Modal";
import { CreateDiscussionDrawer } from "./CreateDiscussionDrawer";
import { DiscussionTable } from "./DiscussionTable";
import { useDiscussions } from "../../hooks/useDiscussions";

function Discussions() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [discussionToDelete, setDiscussionToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { discussions, loading, createDiscussion, deleteDiscussion } = useDiscussions();

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = discussions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(discussions.length / itemsPerPage);

  const handleCreateDiscussion = async (title, content) => {
    await createDiscussion(title, content);
    setDrawerOpen(false);
  };

  const handleDeleteClick = (id) => {
    setDiscussionToDelete(id);
    setModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!discussionToDelete) return;
    
    setDeleteLoading(true);
    await deleteDiscussion(discussionToDelete);
    setDeleteLoading(false);
    setModalOpen(false);
    setDiscussionToDelete(null);
  };

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-2xl font-medium text-black">Discussions</h2>
      
      <div className="mt-6 ml-1 w-full">
        <div className="flex justify-end">
          <PrimaryButton
            onClick={() => setDrawerOpen(true)}
            icon={<HiMiniPlus size="1.13rem" color="white" />}
          >
            Create Discussion
          </PrimaryButton>

          <CreateDiscussionDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onSubmit={handleCreateDiscussion}
            loading={loading}
          />
        </div>

        <div className="mt-4 w-full overflow-x-auto">
          {loading ? (
            <div className="bg-white shadow-md rounded-lg flex justify-center items-center w-full h-85">
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
          ) : discussions.length === 0 ? (
            <EmptyState />
          ) : (
            <DiscussionTable 
              discussions={currentItems} 
              onDelete={handleDeleteClick}
            />
          )}

          <DeleteConfirmationModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            loading={deleteLoading}
            title="Delete Discussion"
            message="Are you sure you want to delete this discussion?"
          />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default Discussions;