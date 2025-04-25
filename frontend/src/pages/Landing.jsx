import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-indigo-200 text-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Intruder Detection System</h1>
      <p className="text-gray-600 mb-6 text-lg">
        Stay safe and secure with real-time facial recognition monitoring.
      </p>
      <div className="space-x-4">
        <Link to="/register">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md">
            Register
          </button>
        </Link>
        <Link to="/login">
          <button className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 rounded-xl hover:bg-indigo-50 transition-all shadow-md">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
