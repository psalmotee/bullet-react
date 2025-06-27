import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import GoogleImage from "../../assets/images/GoogleImage.png";
import Button from "../ui/Button";

const GoogleSignIn = () => {
  const navigate = useNavigate();

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
          lastName: user.displayName?.split(" ")[1] || "",
          teamName: "",
          role: "Admin",
          teamId: user.uid,
          createdAt: new Date(),
        },
        { merge: true }
      );

      toast.success("Signed up with Google!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(`Google signup failed!: ${error.message}`);
    }
  };

  return (
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
  );
};

export default GoogleSignIn;
