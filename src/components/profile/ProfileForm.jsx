import { useState } from 'react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';

const ProfileForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  loading = false,
  // submitText = 'Submit'
}) => {
  const [firstName, setFirstName] = useState(initialData.firstName || '');
  const [lastName, setLastName] = useState(initialData.lastName || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [bio, setBio] = useState(initialData.bio || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return;
    onSubmit({ firstName, lastName, email, bio });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col justify-between h-full">
      <div className='flex flex-col gap-4'>
      <Input
        label="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        placeholder="Enter first name"
      />

      <Input
        label="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        placeholder="Enter last name"
      />

      <Input
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Enter email"
      />

      <Textarea
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Enter bio"
        rows={6}
      />
      </div>
      
      <div className="flex justify-end gap-3">
        <Button variant="secondary" size="sm" onClick={onCancel}>
          <span className="mx-2">Close</span>
        </Button>
        <Button type="submit" size="sm" loading={loading}>
          <span className="mx-2">Submit</span>
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;