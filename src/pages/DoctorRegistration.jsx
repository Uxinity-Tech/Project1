import React, { useEffect, useState } from "react";
import { FaUserPlus, FaEdit, FaTrash, FaUpload } from "react-icons/fa";

export default function DoctorRegistration() {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    specialization: "",
    username: "",
    password: "",
    image: "",
    role: "doctor", // Add this default
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("doctors");
    if (saved) {
      try {
        setDoctors(JSON.parse(saved));
      } catch (err) {
        setError("Failed to load doctor data.");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("doctors", JSON.stringify(doctors));
  }, [doctors]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file (e.g., PNG, JPG).");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result });
        setError(null);
      };
      reader.onerror = () => setError("Failed to read the image file.");
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.specialization || !formData.username || !formData.password) {
      setError("Please fill all required fields.");
      return;
    }

    if (isEditing) {
      const updated = doctors.map((doc) => (doc.id === formData.id ? { ...formData, role: "doctor" } : doc));
      setDoctors(updated);
      setIsEditing(false);
    } else {
      setDoctors([...doctors, { ...formData, id: Date.now(), role: "doctor" }]);
    }

    setFormData({
      id: null,
      name: "",
      specialization: "",
      username: "",
      password: "",
      image: "",
      role: "doctor",
    });
    e.target.reset();
  };

  const handleEdit = (id) => {
    const doc = doctors.find((d) => d.id === id);
    if (doc) {
      setFormData({ ...doc, role: "doctor" }); // Ensure role is set
    }
    setIsEditing(true);
    setError(null);
  };

  const handleDelete = (id) => {
    const filtered = doctors.filter((d) => d.id !== id);
    setDoctors(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-800 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-teal-700 dark:text-teal-300 mb-10 tracking-tight">
          Doctor Registration
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-xl flex items-center shadow-sm">
            <FaTrash className="mr-3 text-lg" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl mb-12 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                Doctor Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter doctor name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="specialization"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                id="specialization"
                placeholder="Enter specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                required
                aria-required="true"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="image"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-100 dark:file:bg-teal-900 file:text-teal-700 dark:file:text-teal-300 file:hover:bg-teal-200 dark:file:hover:bg-teal-800 transition duration-200"
                  />
                  <FaUpload className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-500 dark:text-teal-300" />
                </div>
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Profile preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-teal-200 dark:border-teal-700"
                  />
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200 shadow-md"
            aria-label={isEditing ? "Update Doctor" : "Register Doctor"}
          >
            <FaUserPlus className="mr-2 text-lg" />
            {isEditing ? "Update Doctor" : "Register Doctor"}
          </button>
        </form>

        <h3 className="text-2xl font-semibold text-teal-700 dark:text-teal-300 mb-8">
          Registered Doctors
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 col-span-full text-center text-lg font-medium">
              No doctors registered yet.
            </p>
          )}
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center mb-4">
                {doc.image ? (
                  <img
                    src={doc.image}
                    alt={`${doc.name}'s profile`}
                    className="w-16 h-16 rounded-full object-cover border-2 border-teal-200 dark:border-teal-700 mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mr-4">
                    <FaUserPlus className="text-teal-500 dark:text-teal-300 text-2xl" />
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-bold text-teal-600 dark:text-teal-400">
                    {doc.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Specialization:</strong> {doc.specialization}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                <strong>Username:</strong> {doc.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic mb-4">
                (Use this username & password to login as doctor)
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleEdit(doc.id)}
                  className="flex items-center px-4 py-2 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-lg hover:bg-teal-200 dark:hover:bg-teal-800 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200"
                  aria-label={`Edit ${doc.name}`}
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="flex items-center px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                  aria-label={`Delete ${doc.name}`}
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}