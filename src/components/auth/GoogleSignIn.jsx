import {
  signInWithPopup,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  linkWithCredential,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import GoogleImage from "../../assets/images/GoogleImage.png";
import Button from "../ui/Button";
import { useState } from "react";
import ProviderConflictModal from "./ProviderConflictModal";

const GoogleSignIn = () => {
  const navigate = useNavigate();

  const [conflict, setConflict] = useState({
    show: false,
    provider: null,
    credential: null,
    email: null,
  });

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "Users", user.uid),
        {
          email: user.email,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
          teamName: "",
          role: "Admin",
          teamId: user.uid,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast.success("Signed up with Google!");
      navigate("/dashboard");
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        const pendingCred = GoogleAuthProvider.credentialFromError(error);
        const email = error.customData?.email;

        if (!email || !pendingCred) {
          toast.error("Could not resolve sign-in conflict.");
          return;
        }

        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.length > 0) {
          setConflict({
            show: true,
            provider: methods[0],
            credential: pendingCred,
            email,
          });
        }
      } else {
        toast.error(`Google signup failed: ${error.message}`);
        console.error("Google Sign In Error:", error);
      }
    }
  };

  const handleResolveConflict = async () => {
    setConflict((prev) => ({ ...prev, show: false }));

    try {
      if (conflict.provider === "github.com") {
        const { GithubAuthProvider, signInWithPopup, linkWithCredential } =
          await import("firebase/auth");
        const githubProvider = new GithubAuthProvider();
        const result = await signInWithPopup(auth, githubProvider);
        await linkWithCredential(result.user, conflict.credential);
        toast.success("Google linked to GitHub account!");
        navigate("/dashboard");
      } else if (conflict.provider === "password") {
        const password = prompt("Enter your password to link Google:");
        const userCred = await signInWithEmailAndPassword(
          auth,
          conflict.email,
          password
        );
        await linkWithCredential(userCred.user, conflict.credential);
        toast.success("Google linked to email account!");
        navigate("/dashboard");
      } else {
        toast.error("Cannot resolve conflict with unknown provider.");
      }
    } catch (err) {
      console.error("Conflict resolution failed:", err);
      toast.error("Failed to link account.");
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        onClick={handleGoogleSignup}
        className="w-full justify-center"
      >
        <span className="mr-2">
          <img src={GoogleImage} alt="Google logo" className="w-5 h-5" />
        </span>
        Sign up with Google
      </Button>

      {/* Modal for account conflict */}
      <ProviderConflictModal
        isOpen={conflict.show}
        provider={conflict.provider}
        onClose={() => setConflict((prev) => ({ ...prev, show: false }))}
        onResolve={handleResolveConflict}
      />
    </>
  );
};

export default GoogleSignIn;
