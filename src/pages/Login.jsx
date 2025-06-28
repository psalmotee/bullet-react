import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import reactLogo from "../assets/icons/reactLogo.svg";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import GoogleSignIn from "../components/auth/GoogleSignIn";
import GithubSignIn from "../components/auth/GithubSignIn";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      if (userCredential?.user) {
        localStorage.setItem("user", JSON.stringify(userCredential.user));
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("No user found with this email.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <a href="/" className="flex items-center">
            <img src={reactLogo} className="h-24 w-auto" alt="React logo" />
          </a>
        </div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900">
          Log in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
              required
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              error={errors.password}
              required
              minLength={6}
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center"
            >
              Log in
            </Button>
          </form>

          <div className="flex w-full flex-col space-y-3 mt-6">
            <div className="divider text-gray-500 text-sm">
              Or continue with
            </div>
            <GoogleSignIn />
            <GithubSignIn />
          </div>

          <p className="flex justify-end mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="ml-1 font-medium text-blue-600 hover:text-blue-500"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
