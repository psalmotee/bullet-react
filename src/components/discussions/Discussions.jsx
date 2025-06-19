import React, { useState, useEffect } from "react";
import { HiMiniPlus } from "react-icons/hi2";
import { LuArchiveX, LuCircleAlert } from "react-icons/lu";
import { IoIosClose } from "react-icons/io";
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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discussionToDelete, setDiscussionToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

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
      setDiscussionToDelete(null);
    }
  };

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
      document.getElementById("create-discussion-drawer").checked = false;
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

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = discussions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(discussions.length / itemsPerPage);

  const handleOpenDrawer = () => {
    document.getElementById("create-discussion-drawer").checked = true;
  };

  const handleCloseDrawer = () => {
    document.getElementById("create-discussion-drawer").checked = false;
  };

  const handleOpenModal = () => {
    document.getElementById("delete-modal").showModal();
  };

  const handleCloseModal = () => {
    document.getElementById("delete-modal").close();
  };

  return (
    <div className="flex flex-col w-full py-6 sm:py-0">
      <div className="px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl font-medium text-black">Discussions</h2>
      </div>

      <div className="px-4 sm:px-6 md:px-8 py-6 w-full">
        <div className="flex justify-end">
          <button
            htmlFor="create-discussion-drawer"
            onClick={handleOpenDrawer}
            className="btn drawer-button h-8 px-3 gap-4 bg-gray-900 font-medium text-xs text-white rounded-md inline-flex items-center hover:bg-gray-700 transition duration-300 ease-all"
          >
            <span className="">
              <HiMiniPlus size="1.13rem" color="white" />
            </span>
            <span>Create Discussion</span>
          </button>
        </div>

        {/* Create Discussion Button + Right side Drawer */}
        <div className="drawer drawer-end">
          <input
            id="create-discussion-drawer"
            type="checkbox"
            className="drawer-toggle"
          />
          <div className="drawer-side">
            <button
              onClick={handleCloseDrawer}
              htmlFor="create-discussion-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></button>

            <div className="menu py-6 pl-6 pr-2 w-3/4 sm:max-w-[525px] max-w-[800px] min-h-full bg-base-200 text-base-content flex flex-col justify-between">
              {/* Close Button */}
              <div className="absolute top-3 right-[-4px]">
                <button
                  onClick={handleCloseDrawer}
                  htmlFor="create-discussion-drawer"
                  aria-label="Close"
                  className="text-gray-500 hover:text-black transition duration-300 ease-in-out cursor-pointer"
                >
                  <IoIosClose size="1.5rem" />
                </button>
              </div>

              <div>
                {/* <!-- Header --> */}
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-black">
                    Create Discussion
                  </h2>
                </div>

                {/* <!-- Body --> */}
                <div className="flex- flex-col">
                  <form action="">
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
                    <div className="mt-6">
                      <label
                        htmlFor="discussion-body"
                        className="text-sm font-medium"
                      >
                        Body
                      </label>
                      <textarea
                        id="discussion-body"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-1 block w-full h-16 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                      ></textarea>
                    </div>
                  </form>
                </div>
              </div>
              {/* <!-- Footer --> */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCloseDrawer}
                  htmlFor="create-discussion-drawer"
                  className="btn h-9 px-5 bg-white text-black rounded-md text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  onClick={handleCreateDiscussion}
                  className="btn h-9 px-5 bg-gray-900 text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition duration-300 ease-in-out"
                >
                  {loading && (
                    <span className="loading loading-spinner loading-xs text-white/50"></span>
                  )}
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table and Modal */}
        <div className="w-full overflow-x-auto mt-4">
          {loading ? (
            <div className="bg-white shadow-md rounded-lg flex justify-center items-center w-full h-85">
              <span className="loading loading-ring loading-xl"></span>
            </div>
          ) : discussions.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 bg-white shadow-md rounded-lg">
              <LuArchiveX size="4rem" color="gray" />
              <h4 className="text-gray-500 text-lg">No Entries Found</h4>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="h-10 px-2 text-left font-medium">Author</th>
                  <th className="h-10 px-2 text-left font-medium">Title</th>
                  <th className="h-10 px-2 text-left font-medium">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out">
                {currentItems.map((d) => (
                  <tr
                    key={d.id}
                    className="text-sm text-gray-700 odd:bg-white even:bg-gray-200"
                  >
                    <td className="p-2 ">{d.authorName || "Unknown"}</td>
                    <td className="p-2 whitespace-nowrap">{d.title}</td>
                    <td className="p-2 whitespace-nowrap">
                      {d.createdAt
                        ? d.createdAt.toDate().toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "N/A"}
                    </td>
                    <td className="p-2 whitespace-nowrap font-bold">
                      <a
                        onClick={() =>
                          navigate(`/dashboard/discussions/${d.id}`)
                        }
                        className="text-sm font-bold text-gray-600 hover:text-gray-900 transition duration-300 ease-in-out cursor-pointer"
                      >
                        View
                      </a>
                    </td>
                    <td className="p-2 whitespace-nowrap space-x-10">
                      <button
                        onClick={() => {
                          handleOpenModal();
                          setDiscussionToDelete(d.id);
                        }}
                        className="h-9 px-4 py-2 bg-red-400 text-white rounded-md font-medium flex items-center justify-center gap-4 hover:bg-red-300 transition duration-300 ease-in-out cursor-pointer"
                      >
                        <span>
                          <AiOutlineDelete size="1.2rem" />
                        </span>
                        <span>Delete Discussion</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Delete Discussion Modal */}
          <dialog id="delete-modal" className="modal">
            <div className="modal-box max-w-[425px]">
              <div className="modal-action absolute top-[-12px] right-3">
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-black transition cursor-pointer"
                >
                  <IoIosClose size="1.6rem" />
                </button>
              </div>
              <div className="grid gap-4">
                <div className="flex items-center">
                  <span className="inline-block mr-2 text-red-600">
                    <LuCircleAlert size="1.5rem" />
                  </span>
                  <h2 className="text-lg font-semibold">Delete Discussion</h2>
                </div>
                <div>
                  <p className="ml-4 text-[16px]">
                    Are you sure you want to delete this discussion?
                  </p>
                </div>
                <div className="flex justify-end gap-2 mb-1 mt-2 pr-2">
                  <button
                    onClick={handleDeleteDiscussion}
                    disabled={deleteLoading}
                    className="h-9 px-5 bg-red-500 text-white rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-red-400 transition ease-all duration-300 cursor-pointer"
                  >
                    {deleteLoading && (
                      <span className="loading loading-spinner loading-xs text-white/50"></span>
                    )}
                    Delete
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="h-9 px-5 bg-white text-black rounded-md text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition duration-300 ease-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button></button>
            </form>
          </dialog>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end py-8 space-x-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 text-sm rounded cursor-pointer ${
                    currentPage === i + 1
                      ? "bg-gray-900 hover:bg-gray-700 text-white"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Discussions;
