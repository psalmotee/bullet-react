import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Avatar from "../assets/images/avatar.png";

import { toast } from 'react-toastify';

export const useProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
  });

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
            setPhoto(customPhoto || googlePhoto || localPhoto || Avatar);
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

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    userDetails,
    loading,
    photo,
    setPhoto,
    formData,
    updateFormData,
    setUserDetails,
  };
};

export const useProfileActions = () => {
  const [updating, setUpdating] = useState(false);

  const updateProfile = async (formData) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("User not authenticated.");
      return false;
    }

    setUpdating(true);
    try {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, formData);
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return { updateProfile, updating };
};