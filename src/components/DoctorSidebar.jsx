import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaBars,
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaStethoscope,
  FaPrescriptionBottleAlt,
  FaNotesMedical,
  FaSignOutAlt,
  FaUserCircle,
  FaTimes,
  FaBoxes, // Icon for Inventory
} from "react-icons/fa";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
  { name: "Patient List", path: "/patient-list", icon: <FaUsers /> },
  { name: "Appointments", path: "/appointments", icon: <FaCalendarAlt /> },
  { name: "Consultation", path: "/consultation", icon: <FaStethoscope /> },
  { name: "Prescriptions", path: "/prescription", icon: <FaPrescriptionBottleAlt /> },
  { name: "Follow Ups", path: "/followups", icon: <FaNotesMedical /> },
  { name: "Inventory", path: "/inventory", icon: <FaBoxes /> }, // Added Inventory
];

export default function DoctorSidebar({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
    navigate("/login-admin");
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  if (!user) {
    return (
      <div className="text-center text-xl mt-10 text-gray-700">
        Please login.
      </div>
    );
  }

  // Default profile image URL (you can replace this with your own default avatar URL)
  const defaultProfileImage = "https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=DP"; // Example default avatar

  return (
    <div className="relative min-h-screen">
      {/* Hamburger button for mobile */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 p-3 rounded-full bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 md:hidden"
        aria-label={isMobileOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        {isMobileOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-xl ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 ${isCollapsed ? "w-20" : "w-64"} lg:w-72`}
        aria-label="Doctor Sidebar"
      >
        <div className="flex flex-col h-full justify-between p-6">
          <div>
            <div className="flex items-center justify-between mb-8">
              {!isCollapsed && (
                <h2 className="text-2xl font-extrabold text-teal-600 tracking-tight">
                  Doctor Panel
                </h2>
              )}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 hidden md:block"
                aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <FaBars className="text-teal-600 text-lg" />
              </button>
            </div>
            <nav className="space-y-2">
              {links.map((link) => (
                <div key={link.path} className="relative group">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                        isActive
                          ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                          : "text-gray-700 hover:bg-teal-100"
                      } ${isCollapsed ? "justify-center" : ""}`
                    }
                    aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <span className="text-xl">{link.icon}</span>
                    {!isCollapsed && <span className="ml-3">{link.name}</span>}
                  </NavLink>
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 hidden group-hover:block bg-teal-600 text-white text-xs rounded-lg py-1 px-2 shadow-lg z-10">
                      {link.name}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div
            className={`p-4 bg-teal-50 rounded-2xl shadow-inner ${
              isCollapsed ? "text-center" : ""
            }`}
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center mr-3 overflow-hidden">
                <img
                  src={user.image || defaultProfileImage}
                  alt={`${user.name || "Doctor"}'s profile`}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = defaultProfileImage; // Fallback to default if image fails to load
                  }}
                />
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Welcome, <span className="font-bold">{user?.name || "Doctor"}</span>
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    Role: {user?.role || "N/A"}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 transition duration-200 text-sm font-medium"
              aria-label="Logout"
            >
              <FaSignOutAlt className={isCollapsed ? "" : "mr-2"} />
              {!isCollapsed && "Logout"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={`transition-all duration-300 min-h-screen pt-16 md:pt-0 md:ml-20 lg:ml-72 ${
          isCollapsed ? "md:ml-20" : "md:ml-64 lg:ml-72"
        }`}
      >
        {children}
      </main>
    </div>
  );
}