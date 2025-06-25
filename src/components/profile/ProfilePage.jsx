import { Edit } from "lucide-react";
import { useProfile, useProfileActions } from "../../hooks/useProfile";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import { LoadingScreen } from "../ui/LoadingSpinner";

const ProfilePage = () => {
  const {
    userDetails,
    loading,
    photo,
    setPhoto,
    formData,
    updateFormData,
    setUserDetails,
  } = useProfile();
  const { updateProfile, updating } = useProfileActions();
  const { isOpen: isDrawerOpen, open: openDrawer, close: closeDrawer } = useModal();

  const handleUpdateProfile = async () => {
    const success = await updateProfile(formData);
    if (success) {
      setUserDetails((prev) => ({ ...prev, ...formData }));
      closeDrawer();
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  if (!userDetails) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">
          No user details available.{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-800">
            Login here
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <Button onClick={openDrawer}>
            <Edit size={16} />
            Edit Profile
          </Button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Profile Photo Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col items-center">
              <ProfilePhotoUpload
                onPhotoChange={(url) => setPhoto(url)}
                initialPhoto={photo}
              />
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              User Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">First Name</label>
                <p className="mt-1 text-gray-900">{userDetails.firstName || "—"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Last Name</label>
                <p className="mt-1 text-gray-900">{userDetails.lastName || "—"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email Address</label>
                <p className="mt-1 text-gray-900">{userDetails.email || "—"}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="mt-1 text-gray-900">{userDetails.role || "—"}</p>
              </div>
              
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Bio</label>
                <p className="mt-1 text-gray-900">{userDetails.bio || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title="Edit Profile"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={closeDrawer}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} loading={updating}>
              Save Changes
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <Input
            label="First Name"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            required
          />
          
          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            required
          />
          
          <Textarea
            label="Bio"
            value={formData.bio}
            onChange={(e) => updateFormData('bio', e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>
      </Drawer>
    </>
  );
};

export default ProfilePage;