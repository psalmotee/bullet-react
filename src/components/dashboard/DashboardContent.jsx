import { auth } from "../../firebase/firebase";

function DashboardContent() {
  const user = auth.currentUser;
  return (
    <>
      <div className="min-h-screen px-16 py-25">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-medium text-black">
            Dashboard
          </h2>
        </div>

        <div className="mt-6">
          <h2 className="text-2xl text-black">
            Welcome <span className="font-semibold">{user?.email}</span>
          </h2>
          <h4 className="text-lg mt-4 text-black">
            Your role: <span className="font-semibold">{user?.role}</span>
          </h4>
          <p className="font-semibold mt-4 text-black">In this application you can:</p>
          <ul className="list-disc list-inside mt-4">
            <li>Create discussions</li>
            <li>Edit discussions</li>
            <li>Delete discussions</li>
            <li>Comment on discussions</li>
            <li>Delete all comments</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default DashboardContent;
