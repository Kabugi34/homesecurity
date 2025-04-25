import { Outlet, Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center text-blue-600">Management</h2>
          <nav className="flex flex-col space-y-4">
            <Link to="/dashboard/activity" className="hover:text-blue-500">
              Activity
            </Link>
            <Link to="/dashboard/livefeed" className="hover:text-blue-500">
              Live Feed
            </Link>
            <Link to="/dashboard/addperson" className="hover:text-blue-500">
              Add Person
            </Link>
            <Link to="/dashboard/removeperson" className="hover:text-blue-500">
              Remove Person
            </Link>
            <Link to="/dashboard/notifications" className="hover:text-blue-500">
              Notifications
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
