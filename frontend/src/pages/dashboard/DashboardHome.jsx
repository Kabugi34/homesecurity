// src/pages/dashboard/DashboardHome.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    total: 0,
    intruders: 0,
    known: 0,
    lastIntruderUrl: null,
    lastIntruderTime: null,
  });
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch summary from /activity or /reports
    axios.get("http://localhost:8000/activity")
      .then(res => {
        const logs = res.data;
        const total = logs.length;
        const intruders = logs.filter(e => e.type === "Intruder").length;
        const known = total - intruders;
        const lastIntruder = logs.find(e => e.type === "Intruder");
        setStats({
          total, intruders, known,
          lastIntruderUrl: lastIntruder?.image_url,
          lastIntruderTime: lastIntruder?.timestamp,
        });
      });
  }, []);

  // Theme toggle
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));


  const handleLogout = () => {
    // Clear user session or token if needed
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Banner */}
      <header className="bg-gradient-to-r from-teal-400 to-blue-500 p-6 rounded-b-lg shadow-md mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl text-amber-950 font-bold">Welcome Back!</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"
            >
              {theme === "dark" ? "" : ""}
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
        <p className="mt-2 text-lg text-amber-950">Ready to see who's been here?</p>
      </header>

      <main className="px-6 space-y-8">
        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col">
            <span className="text-sm">Today's Detections</span>
            <span className="mt-2 text-2xl font-bold">{stats.total}</span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col">
            <span className="text-sm">Intruders</span>
            <span className="mt-2 text-2xl font-bold text-red-500">
              {stats.intruders}
            </span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col">
            <span className="text-sm">Known people</span>
            <span className="mt-2 text-2xl font-bold text-green-500">
              {stats.known}
            </span>
          </div>
          {stats.lastIntruderUrl && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <span className="text-sm">Last Intruder</span>
              <img
                src={`http://localhost:8000${stats.lastIntruderUrl}`}
                alt="Last Intruder"
                className="mt-2 w-full h-24 object-cover rounded"
              />
              <p className="mt-1 text-xs text-gray-500">
                {new Date(stats.lastIntruderTime).toLocaleString()}
              </p>
            </div>
          )}
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { to: "/dashboard/activity", label: "Activity" },
              { to: "/dashboard/livefeed", label: "Live Feed" },
              { to: "/dashboard/addperson", label: "Add Person" },
              { to: "/dashboard/removeperson", label: "Remove Person" },
              { to: "/dashboard/notifications", label: "Notifications" },
              { to: "/dashboard/manual", label: "Manual Recognition" },
              { to: "/dashboard/retrainmodel", label: "Retrain Model" },
              { to: "/dashboard/reports", label: "Reports" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition text-center"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
