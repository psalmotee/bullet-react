import { Pen } from "lucide-react";
import { useProfile, useProfileActions } from "../../hooks/useProfile";
import { useModal } from "../../hooks/useModal";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import ProfileForm from "./profileForm";
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
  const {
    isOpen: isDrawerOpen,
    open: openDrawer,
    close: closeDrawer,
  } = useModal();

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
      <div className="space-y-6 flex flex-col w-full">
        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-6">
          <div className="flex justify-end">
            <Button size="sm" onClick={openDrawer} variant="primary">
              <Pen size={16} />
              <span className="sr-only">Update Profile</span>
              <span className="mx-2">Update Profile</span>
            </Button>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
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
            <div className="px-4 py-5 sm:p-0 text-sm">
              <div className="grid border-b border-gray-200 px-4 md:px-6 py-5">
                <h3 className="text-lg font-medium text-gray-900">
                  User Information
                </h3>
                <p className="text-sm text-gray-500">
                  Personal details of the user.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 sm:gap-4 sm:px-6 py-5 sm:border-b border-gray-200">
                <span className="text-gray-500 font-semibold">First Name</span>
                <span className="text-gray-900 col-span-2">
                  {userDetails.firstName}
                </span>
              </div>
              <div className="grid sm:grid-cols-3 sm:gap-4 sm:px-6 py-5 sm:border-b border-gray-200">
                <span className="text-gray-500 font-semibold">Last Name</span>
                <span className="text-gray-900 col-span-2">
                  {userDetails.lastName}
                </span>
              </div>
              <div className="grid sm:grid-cols-3 sm:gap-4 sm:px-6 py-5 sm:border-b border-gray-200">
                <span className="text-gray-500 font-semibold">
                  Email Address
                </span>
                <span className="text-gray-900 col-span-2">
                  {userDetails.email}
                </span>
              </div>
              <div className="grid sm:grid-cols-3 sm:gap-4 sm:px-6 py-5 gap-4 sm:border-b border-gray-200">
                <span className="text-gray-500 font-semibold">Role</span>
                <span className="text-gray-900 col-span-2">
                  {userDetails.role}
                </span>
              </div>
              <div className="grid sm:grid-cols-3  sm:gap-4 sm:px-6 py-5 sm:border-b border-gray-200">
                <span className="text-gray-500 font-semibold">Bio</span>
                <span className="text-gray-900 col-span-2">
                  {userDetails.bio || "–"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title="Update Profile"
      >
        <ProfileForm
          initialData={userDetails}
          onSubmit={handleUpdateProfile}
          onCancel={closeDrawer}
          loading={updating}
          submitText="Update Profile"
        />
      </Drawer>
    </>
  );
};

export default ProfilePage;
