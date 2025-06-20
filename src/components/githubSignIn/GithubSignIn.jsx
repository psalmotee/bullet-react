import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";


function GithubSignIn() {
  const navigate = useNavigate();
  // Github signup
  const handleGithubSignup = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await setDoc(
        doc(db, "Users", user.uid),
        {
          email: user.email,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          teamName: "",
          role: "Admin",
          teamId: user.uid,
          createdAt: new Date(),
        },
        { merge: true }
      );
      toast.success("Signed up with GitHub!", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/dashboard");
    } catch (error) {
      toast.error("GitHub signup failed!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  

  return (
    <>
      <button
        onClick={handleGithubSignup}
        className="flex items-center justify-center gap-2 bg-white border border-gray-300 focus:outline-none text-black rounded-md px-4 py-2 flex h-8 w-full focus:border-sky-500 focus:outline focus:outline-sky-500 cursor-pointer hover:bg-gray-100 transition"
        type="button"
      >
        <span>
          <FaGithub size="20" />
        </span>
        Sign up with GitHub
      </button>
    </>
  );
};
export default GithubSignIn;