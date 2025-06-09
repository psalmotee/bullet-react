import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { auth } from '../firebase/firebase';
import { userService } from '../services/userService';

export const useProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async (user) => {
    try {
      const data = await userService.getById(user.uid);
      if (data) {
        setUserDetails(data);
        toast.success("User details fetched successfully.");
      } else {
        console.log("User details not found in database.");
        toast.error("User details not found in database.");
      }
    } catch (error) {
      toast.error("Error fetching user details.");
      console.error("Error fetching user details:", error);
    }
  };

  const updateProfile = async (updates) => {
    const user = auth.currentUser;
    if (!user) return toast.error("User not authenticated.");

    try {
      await userService.update(user.uid, updates);
      toast.success("Profile updated successfully!");
      setUserDetails(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchUserDetails(user);
      } else {
        toast.info("No user signed in.");
        setUserDetails(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    userDetails,
    loading,
    updateProfile
  };
};