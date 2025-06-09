import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { DangerButton } from "../common/Button";
import { EmptyState } from "../common/EmptyState";
import { formatDate } from "../../utils/dateFormatter";

export const CommentsList = ({ comments, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="shadow-md rounded-lg flex justify-center items-center w-full h-85">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="bg-white flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
        <EmptyState message="No Comments Found" />
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <li key={c.id} className="bg-white rounded-md p-3">
          <div className="text-sm mt-1 flex justify-between">
            <div>
              <span className="text-xs font-semibold">
                {formatDate(c.createdAt)}
              </span>
              <span className="text-xs font-bold">
                {" "}
                by {c.authorName || "Unknown"}
              </span>
            </div>
            <DangerButton
              onClick={() => onDelete(c.id)}
              icon={<AiOutlineDelete size="1rem" />}
            >
              Delete Comment
            </DangerButton>
          </div>
          <p className="text-gray-800 font-bold text-2">{c.body}</p>
        </li>
      ))}
    </ul>
  );
};
