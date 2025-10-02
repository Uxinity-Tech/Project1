import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaBars,
  FaTachometerAlt,
  FaUserMd,
  FaUserPlus,
  FaUsers,
  FaCalendarAlt,
  FaFileInvoice,
  FaChartBar,
  FaChartLine,
  FaSignOutAlt,
  FaPrescriptionBottleAlt,
  FaTimes,
} from "react-icons/fa";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt />, group: "Main" },
  { name: "DoctorList", path: "/doctor", icon: <FaUserMd />, group: "Doctors" },
  { name: "Doctor Registration", path: "/doctor-registration", icon: <FaUserPlus />, group: "Doctors" },
  { name: "Doctor Prescriptions", path: "/admin-prescriptions", icon: <FaPrescriptionBottleAlt />, group: "Doctors" },
  { name: "Patients", path: "/patients", icon: <FaUsers />, group: "Main" },
  { name: "Appointments", path: "/appointments", icon: <FaCalendarAlt />, group: "Main" },
  { name: "Billing", path: "/billing", icon: <FaFileInvoice />, group: "Main" },
  { name: "Reports", path: "/reports", icon: <FaChartBar />, group: "Analytics" },
  { name: "Analytics", path: "/analytics", icon: <FaChartLine />, group: "Analytics" },
  { name: "Inventory", path: "/inventory", icon: <FaChartLine />, group: "Inventory" }
];

export default function Sidebar({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(null);

  if (!user) {
    return (
      <div className="text-center text-xl mt-10 text-gray-700">
        Please login.
      </div>
    );
  }

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);
  const toggleGroup = (group) => {
    setExpandedGroup(expandedGroup === group ? null : group);
  };

  const groupedLinks = links.reduce((acc, link) => {
    acc[link.group] = acc[link.group] || [];
    acc[link.group].push(link);
    return acc;
  }, {});

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
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full justify-between p-6">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8 flex-shrink-0">
              {!isCollapsed && (
                <h1 className="text-3xl font-extrabold text-teal-600 tracking-tight">
                  DentalCare
                </h1>
              )}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-full hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200 hidden md:block"
                aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                <FaBars className="text-teal-600 text-lg" />
              </button>
            </div>

            <div 
              className="flex-1 overflow-y-auto pl-2" 
              style={{ direction: 'rtl' }}
            >
              <ul 
                className="space-y-3" 
                style={{ direction: 'ltr' }}
              >
                {Object.entries(groupedLinks).map(([group, groupLinks]) => (
                  <li key={group}>
                    {!isCollapsed && (
                      <button
                        onClick={() => toggleGroup(group)}
                        className="w-full text-left text-sm font-semibold text-gray-600 mb-2 flex items-center"
                      >
                        {group}
                        <span className={`ml-2 transform transition-transform duration-200 ${expandedGroup === group ? "rotate-90" : ""}`}>
                          {expandedGroup === group ? "▼" : "▶"}
                        </span>
                      </button>
                    )}
                    {(isCollapsed || expandedGroup === group || group === "Main") && (
                      <ul className="space-y-2">
                        {groupLinks.map((link) => (
                          <li key={link.path} className="relative group">
                            <Link
                              to={link.path}
                              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-sm ${
                                location.pathname === link.path
                                  ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                                  : "text-gray-700 hover:bg-teal-100"
                              } ${isCollapsed ? "justify-center" : ""}`}
                              aria-current={location.pathname === link.path ? "page" : undefined}
                              onClick={() => setIsMobileOpen(false)}
                            >
                              <span className="text-xl">{link.icon}</span>
                              {!isCollapsed && <span className="ml-3 font-medium">{link.name}</span>}
                            </Link>
                            {isCollapsed && (
                              <div className="absolute left-full ml-2 hidden group-hover:block bg-teal-600 text-white text-xs rounded-lg py-1 px-2 shadow-lg z-10">
                                {link.name}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`p-4 bg-teal-50 rounded-2xl shadow-inner ${isCollapsed ? "text-center" : ""}`}>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center mr-3">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={`${user.name}'s avatar`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-teal-600 font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {user.role}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                logout();
                setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 transition duration-200 text-sm"
              aria-label="Logout"
            >
              <FaSignOutAlt className={isCollapsed ? "" : "mr-2"} />
              {!isCollapsed && "Logout"}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={`transition-all duration-300 min-h-screen pt-16 md:pt-0 md:ml-20 lg:ml-72 ${isCollapsed ? "md:ml-20" : "md:ml-64 lg:ml-72"}`}>
        {children}
      </main>
    </div>
  );
}