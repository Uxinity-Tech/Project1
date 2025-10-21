import React, { useEffect, useState, useRef } from "react";
import { FaPrint, FaTrash } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useAuth } from "../context/AuthContext";

export default function AdminPrescription() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const printRefs = useRef({});
  const { user } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("prescriptions");
    if (saved) {
      const data = JSON.parse(saved);
      const sorted = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
      setPrescriptions(sorted);
    }
  }, []);

  const handlePrint = async (id) => {
    const node = printRefs.current[id];
    if (!node) return;

    const canvas = await html2canvas(node);
    const dataUrl = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(dataUrl, "PNG", 10, 10, 190, 120);
    pdf.save(`prescription-${id}.pdf`);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this prescription?")) return;

    const updated = prescriptions.filter((p) => p.id !== id);
    setPrescriptions(updated);
    localStorage.setItem("prescriptions", JSON.stringify(updated));
  };

  const filtered = prescriptions.filter((p) =>
    `${p.patientName} ${p.doctorName} ${p.diagnosis}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 tracking-tight">
          {user?.role === "admin" ? "All Prescriptions" : "My Recent Prescriptions"}
        </h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by patient, doctor, diagnosis..."
            className="w-full sm:w-80 p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 text-lg py-10">
            No prescriptions found.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((prescription) => (
              <div
                key={prescription.id}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
              >
                <div ref={(el) => (printRefs.current[prescription.id] = el)}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Prescription #{prescription.id}
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <strong className="font-medium">Date:</strong>{" "}
                      {new Date(prescription.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong className="font-medium">Doctor:</strong>{" "}
                      {prescription.doctorName}
                    </p>
                    <p>
                      <strong className="font-medium">Patient:</strong>{" "}
                      {prescription.patientName}
                    </p>
                    <p>
                      <strong className="font-medium">Diagnosis:</strong>{" "}
                      {prescription.diagnosis}
                    </p>
                    <p>
                      <strong className="font-medium">Medication:</strong>{" "}
                      {prescription.medication}
                    </p>
                    <p>
                      <strong className="font-medium">Dosage:</strong>{" "}
                      {prescription.dosage}
                    </p>
                    <p>
                      <strong className="font-medium">Notes:</strong>{" "}
                      {prescription.notes}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handlePrint(prescription.id)}
                    className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <FaPrint className="mr-2" />
                    Print
                  </button>

                  {user?.role === "admin" && (
                    <button
                      onClick={() => handleDelete(prescription.id)}
                      className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      <FaTrash className="mr-2" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}