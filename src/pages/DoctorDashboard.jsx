import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaUsers,
  FaCalendarAlt,
  FaStethoscope,
  FaPrescriptionBottleAlt,
  FaNotesMedical,
  FaBoxes, // Icon for Inventory
  FaSignOutAlt,
} from "react-icons/fa";

// Add Inventory card to the cards array
const cards = [
  { title: "Patient List", path: "/patient-list", icon: <FaUsers /> },
  { title: "Appointment Schedule", path: "/appointments", icon: <FaCalendarAlt /> },
  { title: "Consultation Form", path: "/consultation", icon: <FaStethoscope /> },
  { title: "Prescription Page", path: "/prescription", icon: <FaPrescriptionBottleAlt /> },
  { title: "Follow-up List", path: "/followups", icon: <FaNotesMedical /> },
  { title: "Inventory Setup", path: "/inventory", icon: <FaBoxes /> }, // New Inventory card
];

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login-admin");
  };

  if (!user) {
    return (
      <div className="text-center text-xl mt-10 text-gray-700">
        Please login.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Auth Greeting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              Welcome back, <span className="font-bold">{user?.name || "Doctor"}</span>
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              Role: {user?.role || "N/A"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 transition duration-200 text-sm font-medium"
            aria-label="Logout"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>

        {/* Main Dashboard Content */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-600 tracking-tight mb-6">
          Doctor Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {cards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              className="flex items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-l-4 border-teal-500"
              aria-label={`Navigate to ${card.title}`}
            >
              <span className="text-2xl text-teal-600 mr-4">{card.icon}</span>
              <span className="text-lg font-semibold text-gray-800">{card.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
