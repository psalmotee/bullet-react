import { useState } from "react";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { toast } from "react-toastify";

const DiscussionForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Submit",
}) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  const validate = () => {
    let valid = true;

    if (!title.trim()) {
      setTitleError("Title is required.");
      valid = false;
    } else {
      setTitleError("");
    }

    if (!content.trim()) {
      setContentError("Content is required.");
      valid = false;
    } else {
      setContentError("");
    }

    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validate()) return;

    const newData = { title: title.trim(), content: content.trim() };

    // Prevent submit if nothing has changed
    const hasChanged = Object.keys(newData).some(
      (key) => newData[key] !== (initialData[key] || "")
    );

    if (!hasChanged) {
      toast.info("No changes made.");
      return;
    }

    onSubmit(newData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 flex flex-col justify-between h-full"
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={titleError}
          placeholder="Enter discussion title"
          required
        />

        <Textarea
          label="Body"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          error={contentError}
          placeholder="Enter discussion content"
          rows={6}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          <span className="mx-2">Close</span>
        </Button>
        <Button type="submit" size="sm" loading={loading}>
          <span className="mx-2">{submitText}</span>
        </Button>
      </div>
    </form>
  );
};

export default DiscussionForm;
