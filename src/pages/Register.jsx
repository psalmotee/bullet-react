import { useState } from "react";
import { useNavigate } from "react-router-dom";
import reactLogo from "../assets/icons/reactLogo.svg";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import GoogleSignIn from "../components/auth/GoogleSignIn";
import GithubSignIn from "../components/auth/GithubSignIn";
import { useTeams } from "../hooks/useTeams";
import { useRegister } from "../hooks/useRegister";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    teamName: "",
  });

  const [errors, setErrors] = useState({});
  const [isJoiningTeam, setIsJoiningTeam] = useState(false);
  const { teams: existingTeams, loading: teamsLoading } = useTeams();
  const { registerUser, loading } = useRegister();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

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

    if (!formData.teamName.trim()) {
      newErrors.teamName = isJoiningTeam
        ? "Please select a team"
        : "Team name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    await registerUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      teamName: formData.teamName,
      isJoiningTeam,
    });
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
          Register your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <form onSubmit={handleRegister} className="space-y-6">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required
              error={errors.firstName}
            />

            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              required
              error={errors.lastName}
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              error={errors.email}
              autoComplete="email"
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              error={errors.password}
            />

            <div className="flex items-center gap-3">
              <div className="rounded-full p-1 focus-within:ring-2">
                <input
                  checked={isJoiningTeam}
                  onChange={(e) => setIsJoiningTeam(e.target.checked)}
                  type="checkbox"
                  className="toggle toggle-md border-none bg-gray-300 text-white checked:bg-black checked:text-white"
                />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Join Existing Team
              </span>
            </div>

            {isJoiningTeam ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Team <span className="text-red-500">*</span>
                </label>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  value={formData.teamName}
                  onChange={(e) =>
                    handleInputChange("teamName", e.target.value)
                  }
                  required
                >
                  <option value="">Select a team</option>
                  {teamsLoading && <option disabled>Loading teams...</option>}
                  {existingTeams.map((team, index) => (
                    <option key={index} value={team}>
                      {team}
                    </option>
                  ))}
                </select>
                {errors.teamName && (
                  <p className="text-sm text-red-600 mt-1">{errors.teamName}</p>
                )}
              </div>
            ) : (
              <Input
                label="Team Name"
                value={formData.teamName}
                onChange={(e) => handleInputChange("teamName", e.target.value)}
                placeholder="Enter your team name"
                required
                error={errors.teamName}
              />
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full justify-center"
            >
              Register
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
            Already have an account?{" "}
            <a
              href="/login"
              className="ml-1 font-medium text-blue-600 hover:text-blue-500"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
