import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar, CartesianGrid,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function Reports() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/reports")
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <p className="p-6">Loading reports…</p>;

  return (
    <div className="p-6 space-y-12">
      {/* 1) Daily Trend */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Detections Over Time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.daily_counts}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total" />
            <Line type="monotone" dataKey="intruders" stroke="#ff4040" name="Intruders" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* 2) Intruder vs Known */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Intruder vs Known Ratio</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data.intruder_ratio}
              dataKey="value"
              nameKey="name"
              label
              outerRadius={80}
            >
              {data.intruder_ratio.map((entry) => (
                <Cell key={entry.name} fill={COLORS[data.intruder_ratio.indexOf(entry) % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* 3) Top Detected People */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Top Detected Individuals</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.top_people}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* 4) Hourly Heatmap */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Hourly Detections</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.hourly_heatmap}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* 5) Confidence Distribution */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Confidence Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.confidence_histogram}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bin" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ff8042" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
