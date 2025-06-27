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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const newData = { title, content };
    const hasChanged = Object.keys(newData).some(
      (key) => newData[key] !== initialData[key]
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
          required
          placeholder="Enter discussion title"
        />

        <Textarea
          label="Body"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
