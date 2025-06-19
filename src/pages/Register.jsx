import reactLogo from "@/assets/react.svg";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Switch } from "@headlessui/react";
import { collection, getDocs } from "firebase/firestore";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [teamName, setTeamName] = useState("");
  const [enabled, setEnabled] = useState(false);
  const navigate = useNavigate();
  const [existingTeams, setExistingTeams] = useState([]);

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
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          teamName: teamName,
          role: enabled ? "Member" : "Admin",
          teamId: enabled ? teamName : user.uid,
          createdAt: new Date(),
        });
      }
      console.log("User registered successfully:");
      console.log("Registering with:", {
        email,
        firstName: fname,
        lastName: lname,
        teamName,
        role: enabled ? "Member" : "Admin",
        teamId: enabled ? teamName : user.uid,
      });

      toast.success("User registered successfully!!", {
        position: "top-right",
        autoClose: 2000,
      });
      // Redirect to login or dashboard page
      navigate("/dashboard");
    } catch (error) {
      console.log(error.message);
      toast.error("Error registering user!!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen sm:px-6 lg:px-8 py-16">
        {" "}
        <div className=" w-full max-w-md ">
          {" "}
          <div className="flex items-center justify-center">
            {" "}
            <a href="/" className="flex items-center">
              {" "}
              <img
                src={reactLogo}
                className="h-18 w-auto"
                alt="React logo"
              />{" "}
            </a>{" "}
          </div>{" "}
          <h2 className="text-3xl font-extrabold text-black mt-6 text-center">
            {" "}
            Register your account{" "}
          </h2>{" "}
        </div>
        <div className="bg-white shadow-md rounded-lg mt-8 py-9 px-10 w-112">
          <form
            onSubmit={handleRegister}
            className="flex flex-col items-center"
          >
            <div className="mb-6 grid grid-cols-1 gap-1 w-full ">
              <label htmlFor="first-name" className="font-medium text-sm">
                <span class="after:ml-0.5 after:text-red-500 after:content-['*']">
                  First Name
                </span>
              </label>
              <input
                type="text"
                required
                onChange={(e) => setFname(e.target.value)}
                className="border border-gray-300 focus:outline-none text-black rounded-md px-3 py-1 flex h-9 w-full focus:border-sky-500 focus:outline focus:outline-sky-500"
              />
            </div>

            <div className="mb-6 grid grid-cols-1 gap-1 w-full">
              <label htmlFor="last-name" className="font-medium text-sm">
                <span class="text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']">
                  Last Name
                </span>
              </label>
              <input
                type="text"
                required
                onChange={(e) => setLname(e.target.value)}
                className="border border-gray-300 focus:outline-none text-black rounded-md px-3 py-1 flex h-9 w-full focus:border-sky-500 focus:outline focus:outline-sky-500"
              />
            </div>

            <div className="mb-6 grid grid-cols-1 gap-1 w-full">
              <label htmlFor="email" className="font-medium text-sm">
                <span class="after:ml-0.5 after:text-red-500 after:content-['*']">
                  Email Address
                </span>
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 focus:outline-none text-black rounded-md px-3 py-1 flex h-9 w-full focus:border-sky-500 focus:outline focus:outline-sky-500"
              />
            </div>

            <div className="mb-5 grid grid-cols-1 gap-1 w-full">
              <label htmlFor="password" className="font-medium text-sm">
                <span class="after:ml-0.5 after:text-red-500 after:content-['*']">
                  Password
                </span>
              </label>
              <input
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 focus:outline-none text-black rounded-md px-3 py-1 flex h-9 w-full focus:border-sky-500 focus:outline focus:outline-sky-500"
              />
            </div>

            <div className="flex items-center space-x-1 w-full">
              {/* Toggle */}
              <div className="rounded-full p-1 focus-within:border-gray-300 focus-within:ring-2 focus-within:ring-black transition">
                <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  className="group relative flex h-6 w-12 cursor-pointer rounded-full bg-gray-300 p-1 ease-in-out focus:not-data-focus:outline-none data-checked:bg-black/100 data-focus:outline data-focus:outline-white/10"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-4 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-6"
                  />
                </Switch>
              </div>

              <span className="text-sm font-medium text-gray-900">
                Join Existing Team
              </span>
            </div>

            <div className="mt-6 w-full">
              {enabled ? (
                <div className="grid grid-cols-1 gap-1 w-full">
                  <label htmlFor="team-name" className="font-medium text-sm">
                    <span class="after:ml-0.5 after:text-red-500 after:content-['*']">
                      Team
                    </span>
                  </label>
                  <select
                    className="border border-gray-300 focus:outline-none focus:ring-1 focus:ring-black text-black rounded-md w-full h-9 px-3 py-1"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
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
                <div className="grid grid-cols-1 gap-1 w-full">
                  <label htmlFor="team-name" className="font-medium text-sm">
                    <span class="after:ml-0.5 after:text-red-500 after:content-['*']">
                      Team Name
                    </span>
                  </label>
                  <input
                    type="text"
                    required
                    onChange={(e) => setTeamName(e.target.value)}
                    className="border border-gray-300 focus:outline-none text-black rounded-md px-3 py-1 flex h-9 w-full focus:border-sky-500 focus:outline focus:outline-sky-500"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-gray-900 text-white font-medium rounded-md w-full px-4 py-1 cursor-pointer mt-6 hover:bg-gray-800 transition duration-300 ease-in-out"
            >
              Register
            </button>
          </form>
          <p className="mt-2 text-sm text-end">
            Already have an account?{" "}
            <a href="/login" className="text-blue-700 hover:text-blue-900">
              Log in
            </a>
          </p>
        </div>
      </div>{" "}
    </>
  );
}
export default Register;
