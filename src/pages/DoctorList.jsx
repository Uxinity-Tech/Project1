import React, { useEffect, useState } from "react";

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Doctor List</h2>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-pink-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Specialization</th>
            <th className="p-2 text-left">Username</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doc) => (
            <tr key={doc.id} className="border-t">
              <td className="p-2">{doc.name}</td>
              <td className="p-2">{doc.specialization}</td>
              <td className="p-2">{doc.username}</td>
              <td className="p-2 space-x-2">
                {/* Optional Edit Button if you want to navigate to registration with edit pre-filled */}
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(doc.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {doctors.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">
                No doctors registered.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
