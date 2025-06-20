import reactLogo from "@/assets/react.svg";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import GoogleSignIn from "../components/googleSignIn/GoogleSignIn";
import GithubSignIn from "../components/githubSignIn/GithubSignIn";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful!!", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Error logging in!!", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full min-h-screen sm:px-6 lg:px-8 py-16">
        <div className=" w-full max-w-md ">
          <div className="flex items-center justify-center">
            <a href="/" className="flex items-center">
              <img src={reactLogo} className="h-18 w-auto" alt="React logo" />
            </a>
          </div>
          <h2 className="text-3xl font-extrabold text-black mt-6 text-center">
            Log in to your account
          </h2>
        </div>

          <div className="bg-white shadow-md rounded-lg mt-8 px-4 py-8 sm:px-10 w-full">
            <form onSubmit={handleLogin} className="flex flex-col items-center">
              <div className="mb-6 grid grid-cols-1 gap-1 w-full">
                <label htmlFor="email" className="font-medium text-sm">
                  <span className="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="border border-gray-300 focus:outline-none text-black rounded-md px-3 py-1 flex h-9 w-full invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline focus:outline-sky-500 focus:invalid:border-pink-500 focus:invalid:outline-pink-500 disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20"
                />
              </div>
              <div className="mb-6 w-full grid grid-cols-1 gap-1">
                <label htmlFor="password" className="font-medium text-sm">
                  <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 focus:outline-none text-black rounded-md px-3 py-1 flex h-9 w-full focus:border-sky-500 focus:outline focus:outline-sky-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gray-900 text-white rounded-md w-full h-9 px-4 py-2 cursor-pointer mt-2 hover:bg-gray-800 transition duration-300 ease-in-out"
              >
                {loading && (
                  <span className="loading loading-spinner loading-xs text-white/50"></span>
                )}{" "}
                Login
              </button>
            </form>
            <div className="flex flex-col gap-2 mt-4">
              <GoogleSignIn />
              <GithubSignIn />
            </div>
            <p className="mt-4 text-sm text-end">
              <span>Don't have an account?</span>{" "}
              <a href="/register" className="text-blue-700 hover:text-blue-900">
                Register
              </a>
            </p>
          </div>
      </div>
    </>
  );
}
export default Login;
