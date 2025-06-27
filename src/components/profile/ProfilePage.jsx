import { Edit, Pen } from "lucide-react";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import Drawer from "../ui/Drawer";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import { LoadingScreen } from "../ui/LoadingSpinner";
import Avater from "../../../public/images/avater.png";

const ProfilePage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [photo, setPhoto] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    setUpdating(true);
    try {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, formData);

      toast.success("Profile updated successfully!");
      setUserDetails((prev) => ({ ...prev, ...formData }));
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserDetails(data);
            setFormData({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || "",
              bio: data.bio || "",
            });

            const customPhoto = data.photoURL;
            const googlePhoto = user.photoURL;
            const localPhoto = localStorage.getItem("profilePhoto");
            setPhoto(customPhoto || googlePhoto || localPhoto || Avater);
          } else {
            toast.error("User details not found in database.");
          }
        } catch (error) {
          toast.error("Error fetching user details.");
          console.error("Error fetching user details:", error);
        }
      } else {
        toast.info("No user signed in.");
        setUserDetails(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            <Button size="sm" onClick={() => setIsDrawerOpen(true)}>
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
        onClose={() => setIsDrawerOpen(false)}
        title="Update Profile"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Close
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
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
          />

          <Input
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
          />

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />

          <Textarea
            label="Bio"
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>
      </Drawer>
    </>
  );
};

export default ProfilePage;
