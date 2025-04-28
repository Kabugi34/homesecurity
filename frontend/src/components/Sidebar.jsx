import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg min-h-screen">
      <h2 className="text-2xl font-bold p-4 border-b">Dashboard</h2>
      <nav className="flex flex-col p-4 space-y-4">
        <Link to="/dashboard/activity" className="hover:text-blue-600">Activity</Link>
        <Link to="/dashboard/livefeed" className="hover:text-blue-600">Live Feed</Link>
        <Link to="/dashboard/addperson" className="hover:text-blue-600">Add Person</Link>
        <Link to="/dashboard/removeperson" className="hover:text-blue-600">Remove Person</Link>
        <Link to="/dashboard/notifications" className="hover:text-blue-600">Notifications</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
