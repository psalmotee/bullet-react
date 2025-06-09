import React, { useState } from "react";
import { CustomDrawer } from "../common/CustomDrawer";
import { TextArea } from "../common/FormField";

export const CreateCommentDrawer = ({ open, onClose, onSubmit, loading }) => {
  const [commentBody, setCommentBody] = useState("");

  const handleSubmit = async () => {
    await onSubmit(commentBody);
    setCommentBody("");
  };

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Create Comment"
      loading={loading}
    >
      <TextArea
        label="Body"
        id="comment-body"
        value={commentBody}
        onChange={(e) => setCommentBody(e.target.value)}
        rows={4}
      />
    </CustomDrawer>
  );
};
