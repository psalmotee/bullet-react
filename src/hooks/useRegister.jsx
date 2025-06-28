import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async ({
    firstName,
    lastName,
    email,
    password,
    teamName,
    isJoiningTeam,
  }) => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      const teamId = isJoiningTeam ? teamName : teamName;

      if (!user) throw new Error("No authenticated user found.");

      // Save team (if new admin creating it)
      if (!isJoiningTeam && teamName) {
        await setDoc(doc(db, "Teams", teamId), {
          name: teamName,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        });
      }

      // Save user
      await setDoc(doc(db, "Users", user.uid), {
        email,
        firstName,
        lastName,
        teamName: teamName,
        teamId: teamId,
        role: isJoiningTeam ? "Member" : "Admin",
        createdAt: serverTimestamp(),
      });

      toast.success("User registered successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return { registerUser, loading };
};
