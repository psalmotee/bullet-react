import { useState } from 'react';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

const CommentForm = ({ onSubmit, onCancel, loading = false }) => {
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    onSubmit({ body });
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        label="Comment"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your comment..."
        required
        rows={4}
      />
      
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Post Comment
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;