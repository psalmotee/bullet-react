import reactLogo from "@/assets/react.svg";
import { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Navigate } from "react-router-dom";
import { doSignInWithEmailAndPassword } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";

function Login() {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    setErrorMessage("");
    try {
      await doSignInWithEmailAndPassword(email, password);
      // navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSigningIn(false);
    }
  }

  // const handleGoogleSignIn = async () => {
  //   setIsSigningIn(true);
  //   setErrorMessage("");
  //   try {
  //     await doSignInWithGoogle();
  //     // navigate("/dashboard");
  //   } catch (error) {
  //     setErrorMessage(error.message);
  //   } finally {
  //     setIsSigningIn(false);
  //   }
  // }

  // const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await signInWithEmailAndPassword(auth, email, password);
  //     navigate("/dashboard");
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };
  return (
    <>
      {userLoggedIn && (<Navigate to="/dashboard" replace={true} />)}
      <div className="flex flex-col items-center justify-center h-screen">
        <img src={reactLogo} className="h-20 mb-6" alt="React logo" />
        <h2 className="text-3xl font-extrabold text-black mb-6">
          Log in to your account
        </h2>
        <div>
          <form
            onSubmit={onSubmit}
            className="flex flex-col items-center mt-4 "
          >
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 text-black rounded-md p-2 mb-4 w-64"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 text-black rounded-md p-2 mb-4 w-64"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md p-2 w-64 hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              Login
            </button>
          </form>
          <p className="mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
