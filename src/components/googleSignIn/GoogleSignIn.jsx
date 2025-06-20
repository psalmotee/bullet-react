import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import GoogleImage from "../../../public/images/GoogleImage.png"

function GoogleSignIn() {
  const navigate = useNavigate();
  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // If user doc doesn't exist, create it
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
      toast.success("Signed up with Google!", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/dashboard");
    } catch (error) {
      toast.error("Google signup failed!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };  

return (
  <>
    <button
      onClick={handleGoogleSignup}
      className="flex items-center justify-center gap-2 bg-white border border-gray-300 focus:outline-none text-black rounded-md px-4 py-2 flex h-9 w-full focus:border-sky-500 focus:outline focus:outline-sky-500 cursor-pointer hover:bg-gray-100 transition"
      type="button"
    >
      <span>
        <img src={GoogleImage} alt="Google logo" className="w-5 h-5" />
      </span>
      Sign up with Google
    </button>
  </>
);
};

export default GoogleSignIn;