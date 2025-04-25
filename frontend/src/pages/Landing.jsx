import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to Face Recognition App</h1>
      <div className="space-x-4">
        <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg">Login</Link>
        <Link to="/register" className="px-6 py-2 bg-green-600 text-white rounded-lg">Register</Link>
      </div>
    </div>
  );
}

export default Landing;
