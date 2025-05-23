import reactLogo from "@/assets/react.svg";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log(user);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful!!", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Error logging in!!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
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

        <div className="bg-white shadow-md rounded-lg mt-8 py-9 px-10 w-112">
          <form onSubmit={handleLogin} className="flex flex-col items-center">
            <div className="mb-6 grid grid-cols-1 gap-1 w-full">
              <label htmlFor="email" className="font-medium text-sm">
                Email
              </label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black text-black rounded-md px-3 py-1 flex h-9 w-full"
              />
            </div>
            <div className="mb-6 w-full grid grid-cols-1 gap-1">
              <label htmlFor="password" className="font-medium text-sm">
                Password
              </label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 text-black focus:outline-none focus:ring-1 focus:ring-black rounded-md w-full h-9 px-3 py-1"
              />
            </div>
            <button
              type="submit"
              className="bg-gray-900 text-white rounded-md w-full px-4 py-1 cursor-pointer mt-2 hover:bg-gray-800 transition duration-300 ease-in-out"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-sm text-end">
            {/* Don't have an account?{" "} */}
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
