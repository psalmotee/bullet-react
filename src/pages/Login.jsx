import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import reactLogo from "../assets/react.svg";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import GoogleSignIn from "../components/auth/GoogleSignIn";
import GithubSignIn from "../components/auth/GithubSignIn";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Error logging in!", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <a href="/" className="flex items-center">
            <img src={reactLogo} className="h-12 w-auto" alt="React logo" />
          </a>
        </div>
        
        {/* Header */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="you@example.com"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
            
            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center"
            >
              Sign In
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <GoogleSignIn />
            <GithubSignIn />
          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;