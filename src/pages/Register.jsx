import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { setDoc, doc, collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Switch } from "@headlessui/react";
import reactLogo from "../assets/react.svg";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import GoogleSignIn from "../components/auth/GoogleSignIn";
import GithubSignIn from "../components/auth/GithubSignIn";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    teamName: "",
  });
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingTeams, setExistingTeams] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const teams = new Set();
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.teamName) {
            teams.add(data.teamName);
          }
        });
        setExistingTeams(Array.from(teams));
      } catch (error) {
        console.error("Error fetching team names: ", error);
      }
    };

    fetchTeams();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = auth.currentUser;
      
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          teamName: formData.teamName,
          role: isJoiningTeam ? "Member" : "Admin",
          teamId: isJoiningTeam ? formData.teamName : user.uid,
          createdAt: new Date(),
        });
      }
      
      toast.success("User registered successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error registering user!", {
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
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
              
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
            
            <Input
              label="Email Address"
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

            {/* Team Toggle */}
            <div className="flex items-center gap-3">
              <Switch
                checked={isJoiningTeam}
                onChange={setIsJoiningTeam}
                className="group relative flex h-6 w-12 cursor-pointer rounded-full bg-gray-300 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[checked]:bg-gray-900"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-4 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-6"
                />
              </Switch>
              <span className="text-sm font-medium text-gray-900">
                Join Existing Team
              </span>
            </div>

            {/* Team Selection/Input */}
            {isJoiningTeam ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="after:ml-0.5 after:text-red-500 after:content-['*']">
                    Select Team
                  </span>
                </label>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                  value={formData.teamName}
                  onChange={(e) => handleInputChange('teamName', e.target.value)}
                  required
                >
                  <option value="">Select a team</option>
                  {existingTeams.map((team, index) => (
                    <option key={index} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <Input
                label="Team Name"
                value={formData.teamName}
                onChange={(e) => handleInputChange('teamName', e.target.value)}
                placeholder="Enter your team name"
                required
              />
            )}
            
            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center"
            >
              Create Account
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

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;