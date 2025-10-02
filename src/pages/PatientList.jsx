import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaSearch } from "react-icons/fa";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("patients");
    if (saved) setPatients(JSON.parse(saved));
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-600 tracking-tight mb-6">
          Patient List
        </h2>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full sm:w-1/2 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search patients by name"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
        </div>

        {filteredPatients.length === 0 ? (
          <p className="text-center text-teal-600 text-lg font-medium">
            No patients found.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPatients.map((p) => (
              <div
                key={p.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 border-l-4 border-teal-500"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {p.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Age:</strong> {p.age}
                  </p>
                  <p>
                    <strong>Gender:</strong> {p.gender}
                  </p>
                  <p>
                    <strong>Diagnosis:</strong> {p.diagnosis || "None"}
                  </p>
                </div>
                <Link
                  to={`/patient-details/${p.id}`}
                  className="mt-4 flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 transition duration-200 text-sm font-medium"
                  aria-label={`View details for ${p.name}`}
                >
                  <FaEye className="mr-2" />
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}