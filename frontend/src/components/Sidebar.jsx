import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-500 text-white shadow-xl min-h-screen">
      <h2 className="text-3xl font-bold p-6 border-b border-gray-300 text-center">Dashboard</h2>
      <nav className="flex flex-col p-6 space-y-6">
        <Link to="/dashboard/activity" className="hover:text-blue-300 transition-colors duration-200">Activity</Link>
        <Link to="/dashboard/livefeed" className="hover:text-blue-300 transition-colors duration-200">Live Feed</Link>
        <Link to="/dashboard/addperson" className="hover:text-blue-300 transition-colors duration-200">Add Person</Link>
        <Link to="/dashboard/removeperson" className="hover:text-blue-300 transition-colors duration-200">Remove Person</Link>
        <Link to="/dashboard/notifications" className="hover:text-blue-300 transition-colors duration-200">Notifications</Link>
        <Link to="/dashboard/Recognize" className="hover:text-blue-300 transition-colors duration-200"> Manual Recognition </Link>
        <Link to="/dashboard/RetrainModel" className="hover:text-blue-300 transition-colors duration-200"> Retrain Model</Link>
        
      </nav>
    </div>
  );
};

export default Sidebar;
