import { LuPen } from "react-icons/lu";
import { AiOutlineDelete } from "react-icons/ai";
import { HiMiniPlus } from "react-icons/hi2";
import { LuArchiveX, LuCircleAlert } from "react-icons/lu";
import { Drawer, Spin, Modal } from "antd";
import { LoadingOutlined, CloseOutlined } from "@ant-design/icons";
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
  updateDoc,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import React from "react";

function ViewDiscussionPage() {
  const { id } = useParams();

  const [open, setOpen] = useState(false);
  const [isCommentDrawer, setIsCommentDrawer] = useState(false);
  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

   // Modal for delete confirmation
    const [commentToDelete, setCommentToDelete] = useState(null);
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

  const fetchDiscussion = async () => {
    try {
      const docRef = doc(db, "discussions", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDiscussion({ id: docSnap.id, ...data });
        setTitle(data.title);
        setBody(data.body);
      } else {
        toast.error("Discussion not found.");
      }
    } catch (error) {
      toast.error("Failed to fetch discussion.");
      console.error("Discussion/user fetch error:", error);
    }
  };

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
    fetchDiscussion();
    fetchComments();
    setLoading(false);
  }, [id]);

  const handleUpdateDiscussion = async () => {
    setUpdating(true);
    try {
      const ref = doc(db, "discussions", id);
      await updateDoc(ref, {
        title,
        body,
      });
      toast.success("Updated successfully!");
      setDiscussion((prev) => ({
        ...prev,
        title,
        body,
      }));
      setOpen(false);
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setUpdating(false);
    }
  };

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
      setIsCommentDrawer(false);
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
       console.error("Delete error:", error);
       toast.error("Failed to delete comment");
     } finally {
       setDeleteLoading(false);
       setOpenModal(false);
       setCommentToDelete(null);
     }
  };
  
  if (loading || !discussion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  const formattedDate = discussion.createdAt?.toDate().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="fle flex-col w-full">
      <h1 className="text-2xl font-semibold">{discussion.title}</h1>
      <div className="mt-8 w-full">
        <p className="text-xs font-bold">
          {formattedDate}
          <span className="text-ms font-bold text-gray-800">
            {" "}
            by {discussion.authorName || "Unknown"}
          </span>
        </p>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => setOpen(true)}
            className="h-8 px-3 gap-2 bg-gray-900 font-medium text-xs text-white rounded-md inline-flex items-center hover:bg-gray-700 transition duration-300 ease-all cursor-pointer"
          >
            <span className="mr-2">
              <LuPen size="1rem" />
            </span>
            Update Discussion
          </button>
          {/* Update Drawer */}
          <Drawer
            placement="right"
            width={540}
            onClose={() => setOpen(false)}
            open={open}
            closable={false}
            headerStyle={{ paddingBottom: 0, borderBottom: "none" }}
            bodyStyle={{ padding: "12px 18px 0px 24px" }}
            footerStyle={{ borderTop: "none" }}
            footer={
              <div className="flex justify-end gap-3 mb-3 pr-2 pb-1">
                <button
                  onClick={() => setOpen(false)}
                  className="h-9 px-5 py-2 bg-white text-black rounded-md text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  onClick={handleUpdateDiscussion}
                  disabled={updating}
                  className="h-9 px-5 bg-gray-900 text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer"
                >
                  {updating && (
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
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-gray-500 hover:text-black transition duration-300 ease-in-out cursor-pointer"
              >
                <CloseOutlined style={{ fontSize: "12px" }} />
              </button>
            </div>
            <div className="flex flex-col gap-6 pr-2">
              <div>
                <label htmlFor="title" className="text-md font-semibold">
                  Title
                </label>
                <input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border px-3 py-2 mt-1 rounded"
                />
              </div>
              <div>
                <label htmlFor="body" className="text-md font-semibold">
                  Body
                </label>
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full border px-3 py-2 mt-1 rounded h-32"
                />
              </div>
            </div>
          </Drawer>
        </div>

        <div className="px-4 py-5 mt-16 bg-white shadow-md rounded-lg w-full h-">
          <p className="text-gray-800 whitespace-pre-line px-4 py-4">
            {discussion.body}
          </p>
        </div>
      </div>

      {/* Comment Section */}
      <div className="flex justify-between items-center mt-7 mb-4">
        <h3 className="text-xl font-bold">Comments</h3>
        <button
          onClick={() => setIsCommentDrawer(true)}
          className="h-8 px-3 gap-2 bg-gray-900 font-medium text-xs text-white rounded-md inline-flex items-center hover:bg-gray-700 transition duration-300 ease-all cursor-pointer"
        >
          <span className="mr-2">
            <HiMiniPlus size="1rem" />
          </span>
          Create Comment
        </button>
        {/* Create Comment Drawer */}
        <Drawer
          placement="right"
          width={540}
          onClose={() => setIsCommentDrawer(false)}
          open={isCommentDrawer}
          closable={false}
          headerStyle={{ paddingBottom: 0, borderBottom: "none" }}
          bodyStyle={{ padding: "12px 18px 0px 24px" }}
          footerStyle={{ borderTop: "none" }}
          footer={
            <div className="flex justify-end gap-3 mb-3 pr-2 pb-1">
              <button
                onClick={() => setIsCommentDrawer(false)}
                className="h-9 px-5 bg-white text-black rounded-md text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                onClick={handleCreateComment}
                disabled={commentLoading}
                className="h-9 px-5 bg-gray-900 text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer"
              >
                {commentLoading && (
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
              onClick={() => setIsCommentDrawer(false)}
              aria-label="Close"
              className="text-gray-500 hover:text-black transition cursor-pointer"
            >
              <CloseOutlined style={{ fontSize: "12px" }} />
            </button>
          </div>
          <div className="flex flex-col gap-6 pr-2">
            <div>
              <label htmlFor="comment-body" className="text-sm font-medium">
                Body
              </label>
              <textarea
                id="comment-body"
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                className="mt-1 block w-full h-16 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
              ></textarea>
            </div>
          </div>
        </Drawer>
      </div>

      <div className="mt-4 mb-8 w-full overflow-x-auto">
        {loading ? (
          <div className="shadow-md rounded-lg flex justify-center items-center w-full h-85">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        ) : comments.length === 0 ? (
          <div className="bg-white flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
            <LuArchiveX size="2.5rem" color="gray" />
            <h4 className="text-gray-500 text-lg">No Comments Found</h4>
          </div>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="bg-white rounded-md p-3">
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
                      setOpenModal(true);
                      setCommentToDelete(c.id);
                    }}
                    className="h-8 px-3 bg-red-400 text-white rounded-md text-xs font-medium flex items-center justify-center gap-2 hover:bg-red-300 transition duration-300 ease-in-out cursor-pointer"
                  >
                    <span className="mr-2">
                      <AiOutlineDelete size="1rem" />
                    </span>
                    Delete Comment
                  </button>
                </div>
                <p className="text-gray-800 font-bold text-2">{c.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete Confirmation */}
                <Modal
                  open={openModal}
                  closable={false}
                  onOk={handleDeleteComment}
                  onCancel={() => setOpenModal(false)}
                  footer={[
                    <div className="flex justify-end gap-2 mb-1 pr-2" key="footer">
                      <button
                        onClick={handleDeleteComment}
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
  );
}

export default ViewDiscussionPage;
