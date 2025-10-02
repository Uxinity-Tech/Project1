import React, { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);

  // Load doctors from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("doctors");
    if (saved) setDoctors(JSON.parse(saved));
  }, []);

  const handleDelete = (id) => {
    const filtered = doctors.filter((doc) => doc.id !== id);
    setDoctors(filtered);
    localStorage.setItem("doctors", JSON.stringify(filtered));

    // Optional: Remove doctorId from patients
    const patientData = localStorage.getItem("patients");
    if (patientData) {
      const updatedPatients = JSON.parse(patientData).map((p) =>
        p.doctorId === id ? { ...p, doctorId: "" } : p
      );
      localStorage.setItem("patients", JSON.stringify(updatedPatients));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-teal-700 mb-10 tracking-tight">
          Doctor List
        </h2>

        {doctors.length === 0 ? (
          <p className="text-gray-500 text-center text-lg font-medium">
            No doctors registered yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center mb-4">
                  {doc.image ? (
                    <img
                      src={doc.image}
                      alt={`${doc.name}'s profile`}
                      className="w-16 h-16 rounded-full object-cover border-2 border-teal-200 mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                      <FaUserPlus className="text-teal-500 text-2xl" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xl font-bold text-teal-600">
                      {doc.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      <strong>Specialization:</strong> {doc.specialization}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Username:</strong> {doc.username}
                </p>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                >
                  <FaUserPlus className="mr-2 text-lg" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}