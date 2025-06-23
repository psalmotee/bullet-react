import { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

const DiscussionForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  loading = false,
  submitText = 'Submit'
}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Enter discussion title"
      />
      
      <Textarea
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter discussion content"
        rows={6}
      />
      
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {submitText}
        </Button>
      </div>
    </form>
  );
};

export default DiscussionForm;