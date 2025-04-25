import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login"); // After registering, go to login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
// This code is a React component for a registration page. It allows users to create an account using their email and password. Upon successful registration, the user is redirected to the login page. The component uses Firebase Authentication for user management.
