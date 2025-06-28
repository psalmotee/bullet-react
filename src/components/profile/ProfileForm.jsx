import { useState } from "react";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
import { toast } from "react-toastify";

const ProfileForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Submit",
}) => {
  const [firstName, setFirstName] = useState(initialData.firstName || "");
  const [lastName, setLastName] = useState(initialData.lastName || "");
  const [email, setEmail] = useState(initialData.email || "");
  const [bio, setBio] = useState(initialData.bio || "");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const validate = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newData = { firstName, lastName, email, bio };
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
          label="First Name"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            setErrors((prev) => ({ ...prev, firstName: "" }));
          }}
          error={errors.firstName}
          required
          placeholder="Enter first name"
        />

        <Input
          label="Last Name"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setErrors((prev) => ({ ...prev, lastName: "" }));
          }}
          error={errors.lastName}
          required
          placeholder="Enter last name"
        />

        <Input
          label="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          error={errors.email}
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
          <span className="mx-2">{submitText}</span>
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
