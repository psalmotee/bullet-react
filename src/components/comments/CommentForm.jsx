import { useState } from "react";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

const CommentForm = ({
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Submit",
}) => {
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    onSubmit({ body });
    setBody("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" flex flex-col justify-between h-full"
    >
      <Textarea
        label="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your comment..."
        required
        rows={4}
      />

      <div className="flex justify-end gap-3">
        <Button size="sm" variant="secondary" onClick={onCancel}>
          <span className="mx-2">Close</span>
        </Button>
        <Button size="sm" type="submit" loading={loading}>
          <span className="mx-2">{submitText}</span>
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
