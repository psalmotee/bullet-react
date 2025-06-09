import React, { useState, useEffect } from 'react';
import { CustomDrawer } from '../common/CustomDrawer';
import { TextInput, TextArea } from '../common/FormField';

export const UpdateProfileDrawer = ({ 
  open, 
  onClose, 
  onSubmit, 
  loading, 
  userDetails 
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (userDetails) {
      setFirstName(userDetails.firstName || "");
      setLastName(userDetails.lastName || "");
      setEmail(userDetails.email || "");
      setBio(userDetails.bio || "");
    }
  }, [userDetails]);

  const handleSubmit = async () => {
    await onSubmit({ firstName, lastName, email, bio });
  };

  return (
    <CustomDrawer
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Update Profile"
      loading={loading}
    >
      <TextInput
        label="First Name"
        id="first-name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextInput
        label="Last Name"
        id="last-name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <TextInput
        label="Email Address"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextArea
        label="Bio"
        id="bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={4}
      />
    </CustomDrawer>
  );
};