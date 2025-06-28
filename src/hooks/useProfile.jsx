import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Avatar from "../assets/images/avatar.png";
import { toast } from "react-toastify";

export const useProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(Avatar);
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

          // Split display name from GitHub or Google into first/last
          const fullName = user.displayName || "";
          const [firstName, ...lastParts] = fullName.split(" ");
          const fallbackData = {
            firstName: firstName || "",
            lastName: lastParts.join(" ") || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
            bio: "",
            role: "User", // fallback role
          };

          if (docSnap.exists()) {
            const dbData = docSnap.data();
            const merged = { ...fallbackData, ...dbData }; // prefer Firestore if present

            setUserDetails(merged);
            setFormData({
              firstName: merged.firstName || "",
              lastName: merged.lastName || "",
              email: merged.email || "",
              bio: merged.bio || "",
            });

            const customPhoto = dbData.photoURL;
            const providerPhoto = user.photoURL;
            const localPhoto = localStorage.getItem("profilePhoto");
            setPhoto(customPhoto || providerPhoto || localPhoto || Avatar);
          } else {
            toast.info("Using authentication provider info.");
            setUserDetails(fallbackData);
            setFormData({
              firstName: fallbackData.firstName,
              lastName: fallbackData.lastName,
              email: fallbackData.email,
              bio: fallbackData.bio,
            });

            const localPhoto = localStorage.getItem("profilePhoto");
            setPhoto(user.photoURL || localPhoto || Avatar);
          }
        } catch (error) {
          toast.error("Error fetching user details.");
          console.error("Error fetching user details:", error);
          setPhoto(Avatar);
        }
      } else {
        toast.info("No user signed in.");
        setUserDetails(null);
        setPhoto(Avatar);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
