import React, { useState } from 'react';
import { CustomDrawer } from '../common/CustomDrawer';
import { TextInput, TextArea } from '../common/FormField';

export const CreateDiscussionDrawer = ({ open, onClose, onSubmit, loading }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    await onSubmit(title, content);
    setTitle("");
    setContent("");
  };

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Create Discussion"
      loading={loading}
    >
      <TextInput
        label="Title"
        id="discussion-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextArea
        label="Body"
        id="discussion-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
      />
    </CustomDrawer>
  );
};