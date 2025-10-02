import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function AppointmentSchedule() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("appointments");
    if (saved) setAppointments(JSON.parse(saved));
  }, []);

  const filteredAppointments = appointments.filter(
    (a) =>
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-600 tracking-tight mb-6">
          Scheduled Appointments
        </h2>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by patient or doctor..."
            className="w-full sm:w-1/2 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search appointments by patient or doctor"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
        </div>

        {filteredAppointments.length === 0 ? (
          <p className="text-center text-teal-600 text-lg font-medium">
            No appointments found.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAppointments.map((a, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border-l-4 border-teal-500"
              >
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Patient:</strong> {a.patientName}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {a.doctorName || a.doctor}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(a.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {a.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}