import { LuPen } from "react-icons/lu";
import { IoIosClose } from "react-icons/io";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import Comments from "../comments/Comments";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import React from "react";

function ViewDiscussionPage() {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

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

  useEffect(() => {
    fetchDiscussion();
    setLoading(false);
  }, [id]);

  const handleUpdateDiscussion = async () => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, "discussions", id), { title, body });
      toast.success("Updated successfully!");
      setDiscussion((prev) => ({ ...prev, title, body }));
      document.getElementById("update-discussion-drawer").checked = false;
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !discussion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {loading ? (
          <span className="loading loading-ring loading-xl"></span>
        ) : (
          <div className="text-center">
            <h2 className="text-lg font-semibold">Discussion Not Found</h2>
            <p className="text-sm text-gray-500">
              The discussion you are looking for does not exist.
            </p>
          </div>
        )}
      </div>
    );
  }

  const formattedDate = discussion.createdAt?.toDate().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Update Drawer
  const handleOpenDrawer = () => {
    document.getElementById("update-discussion-drawer").checked = true;
  };

  const handleCloseDrawer = () => {
    document.getElementById("update-discussion-drawer").checked = false;
  };

  return (
    <div className="flex flex-col w-full py-6 sm:py-0 ">
      <div className="px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold">{discussion.title}</h1>
      </div>
      <div className="px-4 sm:px-6 md:px-8 py-6 w-full">
        <div className="w-full">
          <p className="text-xs font-bold">
            {formattedDate}{" "}
            <span className="text-ms font-bold text-gray-800">
              by {discussion.authorName || "Unknown"}
            </span>
          </p>

          <div className="mt-6 flex flex-col">
            <div className="flex justify-end">
              <button
                htmlFor="update-discussion-drawer"
                onClick={handleOpenDrawer}
                className="btn drawer-button  h-8 px-3 gap-4 bg-gray-900 font-medium text-xs text-white rounded-md inline-flex items-center hover:bg-gray-700 transition duration-300 ease-all"
              >
                <span className="">
                  <LuPen size="1.13rem" color="white" />
                </span>
                <span>Update Discussion</span>
              </button>
            </div>

            {/* Update Drawer Trigger */}
            <div className="drawer drawer-end">
              <input
                id="update-discussion-drawer"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="drawer-side">
                <button
                  onClick={handleCloseDrawer}
                  htmlFor="update-discussion-drawer"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></button>

                <div className="menu py-6 pl-6 pr-2 w-3/4 sm:max-w-[525px] max-w-[800px] min-h-full bg-base-200 text-base-content flex flex-col justify-between">
                  {/* Close Button */}
                  <div className="absolute top-3 right-[-4px]">
                    <button
                      onClick={handleCloseDrawer}
                      htmlFor="update-discussion-drawer"
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
                        Update Discussion
                      </h2>
                    </div>

                    {/* <!-- Body --> */}
                    <div className="flex- flex-col">
                      <form action="">
                        <div>
                          <label
                            htmlFor="update-discussion-title"
                            className="text-md font-semibold"
                          >
                            Title
                          </label>
                          <input
                            type="text"
                            id="update-discussion-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full h-9 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1"
                          />
                        </div>
                        <div className="mt-6">
                          <label
                            htmlFor="update-discussion-body"
                            className="text-sm font-medium"
                          >
                            Body
                          </label>
                          <textarea
                            id="update-discussion-body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
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
                      htmlFor="update-discussion-drawer"
                      className="btn h-9 px-5 bg-white text-black rounded-md text-sm font-semibold border border-gray-300 hover:bg-gray-100 transition duration-300 ease-in-out"
                    >
                      Close
                    </button>

                    <button
                      type="submit"
                      disabled={updating}
                      onClick={handleUpdateDiscussion}
                      className="btn h-9 px-5 bg-gray-900 text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition duration-300 ease-in-out"
                    >
                      {updating && (
                        <span className="loading loading-spinner loading-xs text-white/50"></span>
                      )}
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Discussion Body */}
            <div className="px-4 sm:px-6 py-5 mt-16 bg-white shadow-md rounded-lg w-full">
              <div className="mt-1">
                <div className="text-gray-800 p-2">
                  <p>{discussion.body}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <Comments />
      </div>
    </div>
  );
}

export default ViewDiscussionPage;
