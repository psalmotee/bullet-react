import { AiOutlineDelete } from "react-icons/ai";
import { HiMiniPlus } from "react-icons/hi2";
import { LuArchiveX, LuCircleAlert } from "react-icons/lu";
import { IoIosClose } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import React from "react";

function Comments() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchComments = async () => {
    try {
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
    }
  };

  useEffect(() => {
    fetchComments();
    // setLoading(false);
  }, [id]);

  const handleCreateComment = async () => {
    const user = auth.currentUser;
    if (!user) return toast.error("Not signed in.");
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
        body: commentBody,
        createdAt: Timestamp.now(),
        authorName: fullName,
      });

      toast.success("Comment created.");
      setCommentBody("");
      fetchComments();
      document.getElementById("create-comment-drawer").checked = false;
    } catch (error) {
      toast.error("Failed to create comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, "comments", commentToDelete));
      toast.success("Comment Deleted");
      fetchComments();
    } catch (error) {
      toast.error("Failed to delete comment");
    } finally {
      setDeleteLoading(false);
      handleCloseModal(false);
      setCommentToDelete(null);
    }
  };

  // Comment Drawer
  const handleOpenCommentDrawer = () => {
    document.getElementById("create-comment-drawer").checked = true;
  };

  const handleCloseCommentDrawer = () => {
    document.getElementById("create-comment-drawer").checked = false;
  };

  // Delete Modal
  const handleOpenModal = () => {
    document.getElementById("delete-modal").showModal();
  };

  const handleCloseModal = () => {
    document.getElementById("delete-modal").close();
  };

  return (
    <div className="flex flex-col w-full py-6 sm:py-0 ">
      {/* Comment Section */}
      <div className="flex justify-between items-center mt-8 mb-4">
        <div>
          <h3 className="text-xl font-bold">Comments</h3>
        </div>
        <div className="flex justify-end">
          <button
            htmlFor="create-comment-drawer"
            onClick={handleOpenCommentDrawer}
            className="btn drawer-button  h-8 px-3 gap-4 bg-gray-900 font-medium text-xs text-white rounded-md inline-flex items-center hover:bg-gray-700 transition duration-300 ease-all"
          >
            <span className="">
              <HiMiniPlus size="1.13rem" color="white" />
            </span>
            <span>Create Comment</span>
          </button>
        </div>
      </div>

      {/* Create Comment Drawer */}
      <div className="drawer drawer-end">
        <input
          id="create-comment-drawer"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content">{/* Page content here */}</div>
        <div className="drawer-side">
          <button
            onClick={handleCloseCommentDrawer}
            htmlFor="create-comment-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></button>

          <div className="menu py-6 pl-6 pr-2 w-3/4 sm:max-w-[525px] max-w-[800px] min-h-full bg-base-200 text-base-content flex flex-col justify-between">
            {/* Close Button */}
            <div className="absolute top-3 right-[-4px]">
              <button
                onClick={handleCloseCommentDrawer}
                htmlFor="create-comment-drawer"
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
                  Create Comment
                </h2>
              </div>

              {/* <!-- Body --> */}
              <div className="flex- flex-col">
                <form action="">
                  <div>
                    <label
                      htmlFor="create-body"
                      className="text-sm font-medium"
                    >
                      Body
                    </label>
                    <textarea
                      id="comment-body"
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                      className="mt-1 block w-full h-16 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>
            {/* <!-- Footer --> */}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseCommentDrawer}
                htmlFor="create-comment-drawer"
                className="btn h-9 px-5 bg-white text-black rounded-md text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={commentLoading}
                onClick={handleCreateComment}
                className="btn h-9 px-5 bg-gray-900 text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition duration-300 ease-in-out"
              >
                {commentLoading && (
                  <span className="loading loading-spinner loading-xs text-white/50"></span>
                )}
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="w-full overflow-x-auto">
        {deleteLoading ? (
          <div className="flex justify-center items-center w-full h-85">
            <span className="loading loading-ring loading-xl"></span>
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <LuArchiveX size="2.5rem" color="gray" />
            <h4 className="text-gray-500 text-lg">No Comments Found</h4>
          </div>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li
                key={c.id}
                className="p-4 rounded-lg shadow-md odd:bg-white even:bg-gray-200"
              >
                <div className="text-sm mt-1 flex justify-between">
                  <div>
                    <span className="text-xs font-semibold">
                      {c.createdAt?.toDate().toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }) || "Unknown time"}
                    </span>
                    <span className="text-xs font-bold">
                      {" "}
                      by {c.authorName || "Unknown"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      handleOpenModal();
                      setCommentToDelete(c.id);
                    }}
                    className="h-9 px-4 py-2 bg-red-400 text-white rounded-md font-medium flex items-center justify-center gap-4 hover:bg-red-300 transition duration-300 ease-in-out cursor-pointer"
                  >
                    <AiOutlineDelete size="1rem" /> Delete Comment
                  </button>
                </div>
                <div className="text-gray-800 p-2">
                  <p>{c.body}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete Confirmation Modal */}
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
              <h2 className="text-lg font-semibold">Delete Comment</h2>
            </div>
            <div>
              <p className="ml-4 text-[16px]">
                Are you sure you want to delete this comment?
              </p>
            </div>
            <div className="flex justify-end gap-2 mb-1 mt-2 pr-2">
              <button
                onClick={handleDeleteComment}
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
    </div>
  );
}

export default Comments;
