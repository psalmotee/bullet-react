import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";

function GithubSignIn() {
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
    <button
      onClick={handleGithubSignup}
      className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-black rounded-md px-4 py-2 h-8 w-full hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
      type="button"
    >
      <FaGithub size={20} />
      Sign up with GitHub
    </button>
  );
}

export default GithubSignIn;
