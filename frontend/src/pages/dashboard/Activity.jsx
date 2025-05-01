import React, { useEffect, useState } from "react";
import axios from "axios";

const Activity = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    axios
      .get("http://localhost:8000/activity")
      .then((res) => setLogs(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 1) Deduplicate by `id`
  const uniqueLogs = Array.from(
    new Map(logs.map((l) => [l.id, l])).values()
  );

  // 2) Apply filter
  // after deduplication
const normalizedFilter = filter.trim().toLowerCase();
const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:8000/activity/${id}`);
    // Remove from state
    setLogs((prev) => prev.filter((e) => e.id !== id));
  } catch (err) {
    console.error("Delete failed", err);
  }
};

const filteredLogs = uniqueLogs.filter((entry) => {
  if (normalizedFilter === "all") return true;
  return (
    entry.type &&
    entry.type.trim().toLowerCase() === normalizedFilter
  );
});


  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Activity Log</h1>

      <div className="flex items-center mb-4 space-x-4">
        <label>Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option>All</option>
          <option>Known</option>
          <option>Intruder</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLogs.map((entry) => (
          <div key={entry.id} className="bg-white shadow rounded p-4 relative">
            <button
            onClick={() => handleDelete(entry.id)}
            className="absolute top-2 right-2 text-red-600 hover:text-red-800"
          >
            ✕
          </button>
            {entry.image_url ? (
              <img
                src={`http://localhost:8000${entry.image_url}`}
                alt={entry.name}
                className="w-full h-48 object-cover rounded mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <p>
              <strong>Name:</strong> {entry.name}
            </p>
            <p>
              <strong>Confidence:</strong> {entry.confidence}%
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(entry.timestamp).toLocaleString()}
            </p>
            <span
              className={`inline-block mt-2 px-2 py-1 text-sm rounded ${
                entry.type === "Intruder"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {entry.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;
