import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import Button from "../ui/Button";

const GithubSignIn = () => {
  const navigate = useNavigate();

  const handleGithubSignup = async () => {
    const provider = new GithubAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const displayName = user.displayName || "";
      const [firstName = "", lastName = ""] = displayName.split(" ");

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

      toast.success("Signed up with GitHub!", {
        position: "top-right",
        autoClose: 2000,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("GitHub Sign In Error:", error);
      toast.error(`GitHub signup failed! ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
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
  );
};

export default GithubSignIn;
