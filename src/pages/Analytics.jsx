// /pages/Analytics.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Analytics() {
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState("monthly");

  const chartRef = useRef(null);

  useEffect(() => {
    const storedAppointments = localStorage.getItem("appointments");
    const storedBills = localStorage.getItem("bills");
    const storedPatients = localStorage.getItem("patients");

    if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
    if (storedBills) setBills(JSON.parse(storedBills));
    if (storedPatients) setPatients(JSON.parse(storedPatients));
  }, []);

  const filteredAppointments = appointments.filter((a) => {
    const date = new Date(a.date);
    const now = new Date();
    if (filter === "weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return date >= oneWeekAgo && date <= now;
    } else {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
  });

  const appointmentsByDate = filteredAppointments.reduce((acc, a) => {
    acc[a.date] = (acc[a.date] || 0) + 1;
    return acc;
  }, {});

  const lineChartData = Object.entries(appointmentsByDate).map(([date, count]) => ({
    date,
    appointments: count,
  }));

  const revenueData = bills.map((b) => ({
    name: b.patient,
    revenue: parseFloat(b.amount || 0),
  }));

  const genderCount = patients.reduce(
    (acc, p) => {
      if (p.gender === "Male") acc.male++;
      else if (p.gender === "Female") acc.female++;
      else acc.other++;
      return acc;
    },
    { male: 0, female: 0, other: 0 }
  );

  const genderData = [
    { name: "Male", value: genderCount.male },
    { name: "Female", value: genderCount.female },
    { name: "Other", value: genderCount.other },
  ];

  const COLORS = ["#4f46e5", "#ec4899", "#10b981"];

  const handleExport = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 10, width, height);
    pdf.save("analytics.pdf");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
        <button
          onClick={handleExport}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Export Charts as PDF
        </button>
      </div>

      <div className="flex justify-end">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      <div ref={chartRef} className="space-y-12">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Appointments Over Time</h2>
          <LineChart width={600} height={300} data={lineChartData}>
            <Line type="monotone" dataKey="appointments" stroke="#6366f1" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Revenue by Patient</h2>
          <BarChart width={600} height={300} data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#10b981" />
          </BarChart>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Gender Distribution</h2>
          <PieChart width={400} height={300}>
            <Pie
              data={genderData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}
