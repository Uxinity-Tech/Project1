import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaUsers,
  FaCalendarAlt,
  FaRupeeSign,
  FaChartLine,
  FaSignOutAlt,
  FaExclamationTriangle,
  FaDownload,
} from "react-icons/fa";

import { Line } from "react-chartjs-2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("monthly");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const storedPatients = localStorage.getItem("patients");
      const storedAppointments = localStorage.getItem("appointments");
      const storedBills = localStorage.getItem("bills");

      setPatients(storedPatients ? JSON.parse(storedPatients) : []);
      setAppointments(storedAppointments ? JSON.parse(storedAppointments) : []);
      setBills(storedBills ? JSON.parse(storedBills) : []);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const appointmentsToday = appointments.filter((a) => a?.date?.trim() === today);

  const totalRevenue = bills.reduce((sum, b) => {
    const amount = parseFloat(b?.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const billsByMonth = Array(12).fill(0);
  const billsByDay = Array(7).fill(0);

  bills.forEach((bill) => {
    const date = new Date(bill.date);
    const amount = parseFloat(bill.amount);
    if (!isNaN(amount) && !isNaN(date.getTime())) {
      billsByMonth[date.getMonth()] += amount;
      billsByDay[date.getDay()] += amount;
    }
  });

  const monthlyRevenue = billsByMonth;
  const weeklyRevenue = billsByDay;

  const revenueData = {
    labels:
      viewMode === "monthly"
        ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: viewMode === "monthly" ? "Monthly Revenue (₹)" : "Weekly Revenue (₹)",
        data: viewMode === "monthly" ? monthlyRevenue : weeklyRevenue,
        backgroundColor: "rgba(20, 184, 166, 0.2)", // Teal with opacity
        borderColor: "#14b8a6", // Solid teal
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#14b8a6",
        pointBorderColor: "#ffffff",
        pointHoverBackgroundColor: "#0d9488",
        pointHoverBorderColor: "#ffffff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#1f2937",
          font: { size: 14, weight: "bold" },
        },
      },
      title: {
        display: true,
        text: viewMode === "monthly" ? "Monthly Revenue Trend" : "Weekly Revenue Trend",
        color: "#1f2937",
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
        backgroundColor: "#14b8a6",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "#0d9488",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: { color: "#1f2937", font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#1f2937",
          font: { size: 12 },
          callback: (value) => `₹${value.toLocaleString()}`,
        },
        grid: { color: "#e5e7eb" },
      },
    },
  };

  const exportChart = async () => {
    const chartNode = document.getElementById("revenue-chart");
    if (!chartNode) return;

    const canvas = await html2canvas(chartNode);
    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imageData, "PNG", 10, 10, 190, 100);
    pdf.save("revenue_chart.pdf");
  };

  if (!user) {
    return (
      <div className="text-center text-xl mt-10 text-gray-700">
        Please login.
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <FaExclamationTriangle className="inline-block text-2xl mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Welcome back, <span className="font-bold">{user.name || "User"}</span>
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              Role: {user.role || "N/A"}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 transition duration-200"
            aria-label="Logout"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>

        {/* Title and Analytics Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-600 tracking-tight mb-4 sm:mb-0">
            Dashboard
          </h1>
          <button
            onClick={() => navigate("/analytics")}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 transition duration-200"
            aria-label="View Analytics"
          >
            <FaChartLine className="mr-2" />
            View Analytics
          </button>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center text-gray-600 text-lg">Loading data...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-200">
              <div className="flex items-center">
                <FaUsers className="text-teal-600 text-3xl mr-4" />
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                    Total Patients
                  </h2>
                  <p className="text-xl sm:text-2xl font-bold text-teal-600">
                    {patients.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-200">
              <div className="flex items-center">
                <FaCalendarAlt className="text-teal-600 text-3xl mr-4" />
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                    Appointments Today
                  </h2>
                  <p className="text-xl sm:text-2xl font-bold text-teal-600">
                    {appointmentsToday.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-200">
              <div className="flex items-center">
                <FaRupeeSign className="text-teal-600 text-3xl mr-4" />
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                    Monthly Revenue
                  </h2>
                  <p className="text-xl sm:text-2xl font-bold text-teal-600">
                    ₹{totalRevenue.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Chart */}
        <div
          id="revenue-chart"
          className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg mt-6 sm:mt-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
              Revenue Trend
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setViewMode("weekly")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition duration-200 ${
                  viewMode === "weekly"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                aria-label="View Weekly Revenue"
              >
                Weekly
              </button>
              <button
                onClick={() => setViewMode("monthly")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition duration-200 ${
                  viewMode === "monthly"
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                aria-label="View Monthly Revenue"
              >
                Monthly
              </button>
              <button
                onClick={exportChart}
                className="flex items-center px-3 py-1 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 transition duration-200"
                aria-label="Export Chart as PDF"
              >
                <FaDownload className="mr-1" />
                Export
              </button>
            </div>
          </div>
          <div className="h-64 sm:h-80">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}