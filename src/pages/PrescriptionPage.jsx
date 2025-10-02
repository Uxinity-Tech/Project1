import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaPrint, FaUserShield, FaUserMd, FaSearch } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function PrescriptionPage() {
  const [consultations, setConsultations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const printRefs = useRef({});
  const { user } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem("consultations");
    if (saved) {
      const all = JSON.parse(saved);
      const filtered =
        user?.role === "doctor"
          ? all.filter((item) => item.doctorName === user.name)
          : all;
      setConsultations(filtered);
    }
  }, [user]);

  const filteredConsultations = consultations.filter(
    (item) =>
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = async (index) => {
    const node = printRefs.current[index];
    if (!node) return;

    const canvas = await html2canvas(node, { scale: 2 });
    const dataUrl = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const imgProps = pdf.getImageProperties(dataUrl);
    let imgHeight = (imgProps.height * (pdfWidth - 20)) / imgProps.width;

    // Scale content to fit A4 if too tall
    const maxHeightPerPage = pdfHeight - 20; // 10mm margins
    if (imgHeight > maxHeightPerPage) {
      const scaleFactor = maxHeightPerPage / imgHeight;
      imgHeight = maxHeightPerPage;
      pdf.addImage(dataUrl, "PNG", 10, 10, pdfWidth - 20, imgHeight * scaleFactor);
    } else {
      pdf.addImage(dataUrl, "PNG", 10, 10, pdfWidth - 20, imgHeight);
    }

    pdf.save(`prescription-${index}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-4 sm:p-6 md:p-8">
      <style>
        {`
          @media print {
            .prescription-page {
              background: none;
              padding: 0;
            }
            .prescription-card {
              box-shadow: none;
              border: none;
              border-top: 4px solid #14b8a6;
              padding: 10mm;
              margin: 10mm;
              width: 190mm;
              min-height: 277mm;
              page-break-inside: avoid;
              font-family: serif;
              color: #000000;
            }
            .prescription-card .clinic-name {
              font-size: 18pt;
              font-weight: bold;
              color: #000000;
            }
            .prescription-card .clinic-info {
              font-size: 10pt;
              color: #000000;
            }
            .prescription-card h3 {
              font-size: 14pt;
              color: #000000;
            }
            .prescription-card p {
              font-size: 12pt;
              color: #000000;
              overflow-wrap: break-word;
              word-break: break-word;
            }
            .notes-field {
              max-height: 150mm;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .prescription-field {
              max-height: 50mm;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .print-btn,
            .search-container,
            .role-indicator {
              display: none;
            }
          }
        `}
      </style>
      <div className="max-w-4xl mx-auto prescription-page">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-600 tracking-tight">
            Prescriptions
          </h2>
          {user?.role && (
            <div
              className="flex items-center gap-2 text-sm font-medium text-teal-600 role-indicator"
              aria-label={`User role: ${user.role}`}
            >
              {user.role === "admin" ? (
                <>
                  <FaUserShield className="text-teal-600" />
                  Admin View
                </>
              ) : (
                <>
                  <FaUserMd className="text-teal-600" />
                  Doctor View
                </>
              )}
            </div>
          )}
        </div>

        <div className="relative mb-6 search-container">
          <input
            type="text"
            placeholder="Search by patient, doctor, or diagnosis..."
            className="w-full sm:w-1/2 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search prescriptions by patient, doctor, or diagnosis"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
        </div>

        {filteredConsultations.length === 0 ? (
          <p className="text-center text-teal-600 text-lg font-medium">
            No prescriptions found.
          </p>
        ) : (
          <div className="space-y-6">
            {filteredConsultations.map((item, index) => (
              <div
                key={index}
                ref={(el) => (printRefs.current[index] = el)}
                className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border-t-4 border-teal-500 prescription-card"
                style={{ width: "190mm" }}
              >
                <div className="mb-4 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-teal-600 font-serif clinic-name">
                    SmileCare Dental Clinic
                  </h3>
                  <p className="text-xs text-gray-500 clinic-info">
                    Kodungallur, Kerala | contact@smilecare.com | +91 123-456-7890
                  </p>
                </div>
                <h3 className="font-semibold text-lg sm:text-xl text-gray-800 mb-4">
                  Prescription #{index + 1}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p>
                    <strong>Date:</strong> {new Date(item.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Doctor:</strong> {item.doctorName}
                  </p>
                  <p>
                    <strong>Patient:</strong> {item.patientName}
                  </p>
                  <p>
                    <strong>Diagnosis:</strong> {item.diagnosis}
                  </p>
                  <p className="sm:col-span-2 prescription-field">
                    <strong>Prescription:</strong>{" "}
                    {item.prescription.length > 500
                      ? `${item.prescription.substring(0, 500)}...`
                      : item.prescription}
                  </p>
                  <p className="sm:col-span-2 notes-field">
                    <strong>Notes:</strong>{" "}
                    {item.notes.length > 1000
                      ? `${item.notes.substring(0, 1000)}...`
                      : item.notes || "None"}
                  </p>
                </div>
                <button
                  onClick={() => handlePrint(index)}
                  className="mt-6 flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 transition duration-200 text-sm font-medium print-btn"
                  aria-label={`Print prescription ${index + 1}`}
                >
                  <FaPrint className="mr-2" />
                  Print Prescription
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}