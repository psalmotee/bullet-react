import Sidebar from "./Sidebar";
function ProfilePage () {
  return (
    <>
      <div className="flex">
        <Sidebar />
      <div className="min-h-screen px-16 py-25">
        <h1>Profile</h1>
      </div>    
      </div>    
    </>
  );
}
export default ProfilePage;