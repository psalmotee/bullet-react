import {
  GithubAuthProvider,
  signInWithPopup,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  linkWithCredential,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import Button from "../ui/Button";
import { useState } from "react";
import ProviderConflictModal from "./ProviderConflictModal"; // DaisyUI modal

const GithubSignIn = () => {
  const navigate = useNavigate();

  const [conflict, setConflict] = useState({
    show: false,
    provider: null,
    credential: null,
    email: null,
  });

  const handleGithubSignup = async () => {
    const provider = new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const displayName = user.displayName || "";
      const [firstName = "", ...lastParts] = displayName.split(" ");
      const lastName = lastParts.join(" ") || "";

      // Create or merge Firestore user
      await setDoc(
        doc(db, "Users", user.uid),
        {
          email: user.email || "",
          firstName,
          lastName,
          teamName: "",
          role: "Admin",
          teamId: user.uid,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success("Signed in with GitHub!");
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const pendingCred = GithubAuthProvider.credentialFromError(error);
        const email = error.customData?.email;

        if (!email || !pendingCred) {
          toast.error("Unable to resolve GitHub sign-in conflict.");
          return;
        }

        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.length === 0) {
          const password = prompt(
            "We couldn't determine the original provider. Try entering your account password to proceed:"
          );

          try {
            const userCred = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            await linkWithCredential(userCred.user, pendingCred);
            toast.success("Linked account using password fallback.");
            navigate("/dashboard");
          } catch (err) {
            toast.error("Password login failed. Contact support.");
            console.error(err);
          }

          return;
        }
        setConflict({
          show: true,
          provider: methods[0],
          credential: pendingCred,
          email,
        });        
      }
    }
  };

  const handleResolveConflict = async () => {
    setConflict((prev) => ({ ...prev, show: false }));

    try {
      console.log("Conflict provider:", conflict.provider);

      if (conflict.provider?.includes("google.com")) {
        const { GoogleAuthProvider, signInWithPopup, linkWithCredential } =
          await import("firebase/auth");
        const googleProvider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, googleProvider);
        await linkWithCredential(result.user, conflict.credential);
        toast.success("GitHub linked to Google account!");
        navigate("/dashboard");
      } else if (
        conflict.provider?.includes("password") ||
        conflict.provider?.includes("email")
      ) {
        const password = prompt("Enter your password to link GitHub:");
        const userCred = await signInWithEmailAndPassword(
          auth,
          conflict.email,
          password
        );
        await linkWithCredential(userCred.user, conflict.credential);
        toast.success("GitHub linked to email account!");
        navigate("/dashboard");
      } else {
        toast.error(`Unsupported provider conflict: ${conflict.provider}`);
      }
    } catch (err) {
      console.error("Conflict resolution failed:", err);
      toast.error("Failed to link GitHub account.");
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleGithubSignup}
        className="w-full justify-center"
      >
        <span className="mr-2">
          <FaGithub size={24} />
        </span>
        Sign up with GitHub
      </Button>

      <ProviderConflictModal
        isOpen={conflict.show}
        provider={conflict.provider}
        onClose={() => setConflict((prev) => ({ ...prev, show: false }))}
        onResolve={handleResolveConflict}
      />
    </>
  );
};

export default GithubSignIn;
