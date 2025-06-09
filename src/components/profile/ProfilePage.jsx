import React, { useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { LuPen } from "react-icons/lu";
import { PrimaryButton } from "../common/Button";
import { UpdateProfileDrawer } from "./UpdateProfileDrawer";
import { useProfile } from "../../hooks/useProfile";

function ProfilePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  const { userDetails, loading, updateProfile } = useProfile();

  const handleUpdateProfile = async (updates) => {
    setUpdating(true);
    await updateProfile(updates);
    setUpdating(false);
    setDrawerOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>
          No user details available. Login{" "}
          <a href="/login" className="text-blue-500">here</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <h2 className="text-2xl font-medium text-black">Profile</h2>
      
      <div className="mt-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center px-6 pt-4 pb-2">
          <h3 className="text-lg font-medium">User Information</h3>
          <PrimaryButton
            onClick={() => setDrawerOpen(true)}
            icon={<LuPen size="1rem" />}
          >
            Update Profile
          </PrimaryButton>

          <UpdateProfileDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onSubmit={handleUpdateProfile}
            loading={updating}
            userDetails={userDetails}
          />
        </div>
        
        <p className="text-lg text-sm text-gray-700 px-6 pb-5 border-b border-gray-200">
          Personal details of the user.
        </p>

        <div className="text-sm text-gray-800">
          <div className="grid grid-cols-3 px-6 py-5 border-b border-gray-200">
            <span className="text-gray-500 font-semibold">First Name</span>
            <span className="text-gray-900">{userDetails.firstName}</span>
          </div>
          <div className="grid grid-cols-3 px-6 py-5 border-b border-gray-200">
            <span className="text-gray-500 font-semibold">Last Name</span>
            <span className="text-gray-900">{userDetails.lastName}</span>
          </div>
          <div className="grid grid-cols-3 px-6 py-5 border-b border-gray-200">
            <span className="text-gray-500 font-semibold">Email Address</span>
            <span className="text-gray-900">{userDetails.email}</span>
          </div>
          <div className="grid grid-cols-3 px-6 py-5 border-b border-gray-200">
            <span className="text-gray-500 font-semibold">Role</span>
            <span className="text-gray-900">{userDetails.role}</span>
          </div>
          <div className="grid grid-cols-3 px-6 py-5 border-b border-gray-200">
            <span className="text-gray-500 font-semibold">Bio</span>
            <span className="text-gray-900">{userDetails.bio || "–"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;