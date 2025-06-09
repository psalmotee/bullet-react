import React, { useState, useEffect } from "react";
import { CustomDrawer } from "../common/CustomDrawer";
import { TextInput, TextArea } from "../common/FormField";

export const UpdateDiscussionDrawer = ({
  open,
  onClose,
  onSubmit,
  loading,
  discussion,
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (discussion) {
      setTitle(discussion.title || "");
      setBody(discussion.body || "");
    }
  }, [discussion]);

  const handleSubmit = async () => {
    await onSubmit(title, body);
  };

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Update Discussion"
      loading={loading}
    >
      <TextInput
        label="Title"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextArea
        label="Body"
        id="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={8}
      />
    </CustomDrawer>
  );
};
