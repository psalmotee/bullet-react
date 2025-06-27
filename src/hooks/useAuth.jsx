import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const docRef = doc(db, "Users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            toast.error("User details not found in database.");
            setUserDetails(null);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
          toast.error("Error fetching user details.");
          setUserDetails(null);
        }
      } else {
        setUserDetails(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, userDetails, loading };
};

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);

  const signOut = async () => {
    setLoading(true);
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      toast.success("Logged out successfully.");
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { signOut, loading };
};