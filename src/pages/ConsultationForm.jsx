import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useInventory } from "../context/InventoryContext"; // ✅ Import inventory context
import { FaSave, FaPrint } from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Consultation() {
  const { user } = useAuth();
  const { items, setItems } = useInventory(); // ✅ Get shared inventory
  const [form, setForm] = useState({
    patientName: "",
    diagnosis: "",
    prescription: "",
    dosage: "Twice a day",
    notes: "",
    inventory: "", // Inventory input
  });
  const [patients, setPatients] = useState([]);
  const [latestConsultation, setLatestConsultation] = useState(null);
  const [showPrint, setShowPrint] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("patients");
    if (saved) setPatients(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const inventoryItems = form.inventory
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean);

    // ✅ Update shared inventory: add new items if they don't exist
    inventoryItems.forEach((name) => {
      const existing = items.find((item) => item.name.toLowerCase() === name.toLowerCase());
      if (!existing) {
        setItems((prev) => [...prev, { id: Date.now() + Math.random(), name, quantity: 1, category: "Used in Consultation" }]);
      }
    });

    const newConsultation = {
      id: Date.now(),
      doctorName: user?.name || "Unknown Doctor",
      patientName: form.patientName,
      diagnosis: form.diagnosis,
      prescription: form.prescription,
      dosage: form.dosage,
      notes: form.notes,
      inventory: form.inventory,
      date: new Date().toLocaleDateString(),
    };

    const consultations = JSON.parse(localStorage.getItem("consultations")) || [];
    consultations.push(newConsultation);
    localStorage.setItem("consultations", JSON.stringify(consultations));

    setLatestConsultation(newConsultation);
    setShowPrint(true);
    alert("Consultation saved and inventory updated.");

    setForm({
      patientName: "",
      diagnosis: "",
      prescription: "",
      dosage: "Twice a day",
      notes: "",
      inventory: "",
    });
  };

  const handlePrint = async () => {
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, { scale: 2 });
    const dataUrl = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(dataUrl, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
    pdf.save(`consultation-${latestConsultation.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-teal-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto consultation-page">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-600 tracking-tight mb-6 font-sans">
          Consultation Paper
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-lg form-section"
        >
          {/* Patient & Diagnosis */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
              <select
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
              <input
                name="diagnosis"
                value={form.diagnosis}
                onChange={handleChange}
                placeholder="Enter diagnosis"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              />
            </div>
          </div>

          {/* Prescription */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prescription</label>
            <textarea
              name="prescription"
              value={form.prescription}
              onChange={handleChange}
              placeholder="Enter prescription"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>

          {/* Inventory Used */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Used</label>
            <textarea
              name="inventory"
              value={form.inventory}
              onChange={handleChange}
              placeholder="List inventory items used (one per line)"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Dosage & Notes */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
              <select
                name="dosage"
                value={form.dosage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option>Once a day</option>
                <option>Twice a day</option>
                <option>Thrice a day</option>
                <option>Before meals</option>
                <option>After meals</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional notes"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200 text-sm font-medium"
          >
            <FaSave className="mr-2" /> Save Consultation
          </button>
        </form>

        {/* Consultation Card */}
        {showPrint && latestConsultation && (
          <div
            className="mt-8 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border-t-4 border-teal-500 consultation-card"
            ref={printRef}
          >
            <div className="mb-4 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-teal-600 font-serif">
                SmileCare Dental Clinic
              </h3>
              <p className="text-xs text-gray-500">
                Kodungallur, Kerala | contact@smilecare.com | +91 123-456-7890
              </p>
            </div>
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Consultation Paper #{latestConsultation.id}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <p>
                <strong>Date:</strong> {latestConsultation.date}
              </p>
              <p>
                <strong>Doctor:</strong> {latestConsultation.doctorName}
              </p>
              <p>
                <strong>Patient:</strong> {latestConsultation.patientName}
              </p>
              <p>
                <strong>Diagnosis:</strong> {latestConsultation.diagnosis}
              </p>
              <p className="sm:col-span-2">
                <strong>Prescription:</strong>{" "}
                {latestConsultation.prescription.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              <p className="sm:col-span-2">
                <strong>Inventory Used:</strong>{" "}
                {latestConsultation.inventory
                  ? latestConsultation.inventory.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))
                  : "None"}
              </p>
              <p>
                <strong>Dosage:</strong> {latestConsultation.dosage}
              </p>
              <p>
                <strong>Notes:</strong> {latestConsultation.notes || "None"}
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="mt-6 flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200 text-sm font-medium"
            >
              <FaPrint className="mr-2" />
              Print Consultation Paper
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
