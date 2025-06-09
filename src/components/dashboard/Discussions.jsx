import React, { useState, useEffect } from "react";
import { Drawer, Spin, Modal } from "antd";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { HiMiniPlus } from "react-icons/hi2";
import { LuArchiveX, LuCircleAlert } from "react-icons/lu";
import { db, auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
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
import { AiOutlineDelete } from "react-icons/ai";

function Discussions() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal for delete confirmation
  const [discussionToDelete, setDiscussionToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const showModal = () => {
    setOpenModal(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenModal(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handleCreateDiscussion = async () => {
    if (!title.trim()) return;
    setLoading(true);

    const user = auth.currentUser;
    if (!user) return toast.error("User not signed in.");

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
        title,
        content,
        createdBy: user.uid,
        authorName: fullName,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "discussions"), newDiscussion);
      fetchDiscussions();
      setTitle("");
      setContent("");
      setOpen(false);
      toast.success("Discussion Created");
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast.error("Failed to create discussion");
    } finally {
      setLoading(false);
    }
  };

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

  const handleDeleteDiscussion = async () => {
    if (!discussionToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, "discussions", discussionToDelete));
      toast.success("Discussion Deleted");
      fetchDiscussions();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete discussion");
    } finally {
      setDeleteLoading(false);
      setOpenModal(false);
      setDiscussionToDelete(null);
    }
  };
  

  useEffect(() => {
    fetchDiscussions();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = discussions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(discussions.length / itemsPerPage);

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-2xl font-medium text-black">Discussions</h2>
      {/* Create Discussion Button + Drawer */}
      <div className="mt-6 ml-1 w-full">
        <div className="flex justify-end">
          <button
            onClick={showDrawer}
            className="h-8 px-3 gap-2 bg-gray-900 font-medium text-xs text-white rounded-md inline-flex items-center hover:bg-gray-700 transition duration-300 ease-all cursor-pointer"
          >
            <span className="text-blue-500 mr-2">
              <HiMiniPlus size="1.13rem" color="white" />
            </span>
            Create Discussion
          </button>

          <Drawer
            placement="right"
            width={540}
            onClose={onClose}
            open={open}
            closable={false}
            headerStyle={{ paddingBottom: 0, borderBottom: "none" }}
            bodyStyle={{ padding: "12px 18px 0px 24px" }}
            footerStyle={{ borderTop: "none" }}
            footer={
              <div className="flex justify-end gap-3 mb-3 pr-2 pb-1">
                <button
                  onClick={onClose}
                  className="h-9 px-5 bg-white text-black rounded-md text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  onClick={handleCreateDiscussion}
                  className="h-9 px-5 bg-gray-900 text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer"
                >
                  {loading && (
                    <Spin indicator={<LoadingOutlined spin />} size="small" />
                  )}
                  Submit
                </button>
              </div>
            }
          >
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-lg font-medium text-black mt-3">
                Create Discussion
              </h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-gray-500 hover:text-black transition duration-300 ease-in-out cursor-pointer"
              >
                <CloseOutlined style={{ fontSize: "12px" }} />
              </button>
            </div>
            <div className="flex flex-col gap-6 pr-2">
              <div>
                <label
                  htmlFor="discussion-title"
                  className="text-md font-semibold"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="discussion-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full h-9 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                />
              </div>

              <div>
                <label
                  htmlFor="discussion-content"
                  className="text-sm font-medium"
                >
                  Body
                </label>
                <textarea
                  id="discussion-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 block w-full h-16 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                ></textarea>
              </div>
            </div>
          </Drawer>
        </div>

        {/* Discussion Table */}
        <div className="mt-4 w-full overflow-x-auto">
          {loading ? (
            <div className="bg-white shadow-md rounded-lg flex justify-center items-center w-full h-85">
              <Spin indicator={<LoadingOutlined spin />} size="large" />
            </div>
          ) : discussions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10">
              <LuArchiveX size="4rem" color="gray" />
              <h4 className="text-gray-500 text-lg">No Entries Found</h4>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="text-left text-sm font-medium text-gray-500">
                    Author
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500">
                    Title
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-medium text-gray-500">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out">
                {currentItems.map((d) => (
                  <tr key={d.id}>
                    <td className="text-sm text-gray-700">
                      {d.authorName || "Unknown"}
                    </td>
                    <td className="whitespace-nowrap">{d.title}</td>
                    <td className="px-2 whitespace-nowrap">
                      {d.createdAt
                        ? d.createdAt.toDate().toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "N/A"}
                    </td>
                    <td className="flex px-2 py-2 whitespace-nowrap space-x-10">
                      <button className="h-9 px-3 text-gray-600 hover:text-gray-900 transition duration-300 ease-in-out">
                        <a
                          onClick={() =>
                            navigate(`/dashboard/discussions/${d.id}`)
                          }
                          className="flex text-sm items-center gap-2"
                        >
                          View
                        </a>
                      </button>
                      <button
                        onClick={() => {
                          setOpenModal(true);
                          setDiscussionToDelete(d.id);
                        }}
                        className="h-8 px-3 bg-red-400 text-white rounded-md text-xs font-medium flex items-center justify-center gap-2 hover:bg-red-300 transition duration-300 ease-in-out cursor-pointer"
                      >
                        <span className="mr-2">
                          <AiOutlineDelete size="1rem" />
                        </span>
                        Delete Discussion
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Delete Confirmation */}
          <Modal
            open={openModal}
            closable={false}
            onOk={handleDeleteDiscussion}
            onCancel={() => setOpenModal(false)}
            footer={[
              <div className="flex justify-end gap-2 mb-1 pr-2" key="footer">
                <button
                  onClick={handleDeleteDiscussion}
                  disabled={deleteLoading}
                  className="h-9 px-5 bg-red-400 text-white rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-red-300 transition"
                >
                  {deleteLoading && (
                    <Spin indicator={<LoadingOutlined spin />} size="small" />
                  )}
                  Delete
                </button>
                <button
                  onClick={() => setOpenModal(false)}
                  className="h-9 px-5 bg-white text-black rounded-md text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </div>,
            ]}
          >
            <div className="flex items-start justify-between">
              <div className="inline-flex items-center justify-center mt-3">
                <span className="inline-block mr-2 text-red-600">
                  <LuCircleAlert size="1.5rem" />
                </span>
                <h2 className="text-lg font-semibold">Delete Discussion</h2>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                aria-label="Close"
                className="text-gray-500 hover:text-black transition cursor-pointer"
              >
                <CloseOutlined style={{ fontSize: "12px" }} />
              </button>
            </div>
            <p className="px-6 pt-6 pb-2 text-[16px]">
              Are you sure you want to delete this discussion?
            </p>
          </Modal>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === i + 1
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Discussions;
