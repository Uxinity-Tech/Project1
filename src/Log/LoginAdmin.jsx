import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaExclamationTriangle, FaSignInAlt, FaChevronDown } from "react-icons/fa";
import image from "../assets/image.png";

export default function LoginAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const dropdownRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (role === "admin") {
      if (username === "admin" && password === "admin123") {
        login("admin", { name: "Admin" });
        navigate("/dashboard");
      } else {
        setError("Invalid admin credentials.");
      }
    } else if (role === "doctor") {
      const stored = localStorage.getItem("doctors");
      if (stored) {
        const doctors = JSON.parse(stored);
        const foundDoctor = doctors.find(
          (doc) => doc.username === username && doc.password === password
        );
        if (foundDoctor) {
          // FIXED: Pass the full doctor object to include image, specialization, etc.
          login("doctor", foundDoctor);
          navigate("/dashboard");
          return;
        }
      }
      setError("Invalid doctor credentials.");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDropdown();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(20, 184, 166, 0.8), rgba(20, 184, 166, 0.8)), url(${image})`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md space-y-6"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-600 tracking-tight text-center">
          Welcome to DentalCare
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between text-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                aria-expanded={isDropdownOpen}
                aria-controls="role-dropdown"
                aria-label="Select user role"
              >
                <span className="text-sm font-medium capitalize">{role}</span>
                <FaChevronDown
                  className={`text-teal-600 transform transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <ul
                  id="role-dropdown"
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden animate-dropdown"
                >
                  <li>
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 hover:text-teal-600 transition duration-200 capitalize"
                      onClick={() => selectRole("admin")}
                    >
                      Admin
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-teal-100 hover:text-teal-600 transition duration-200 capitalize"
                      onClick={() => selectRole("doctor")}
                    >
                      Doctor
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              aria-label="Username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm flex items-center">
            <FaExclamationTriangle className="mr-2" />
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 transition duration-200 text-sm font-medium"
          aria-label={`Login as ${role}`}
        >
          <FaSignInAlt className="mr-2" />
          Login as {role.charAt(0).toUpperCase() + role.slice(1)}
        </button>
      </form>
    </div>
  );
}