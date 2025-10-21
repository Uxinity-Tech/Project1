import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("patients");
    if (saved) {
      const found = JSON.parse(saved).find((p) => p.id.toString() === id);
      if (found) setPatient(found);
    }
  }, [id]);

  if (!patient) return <div className="p-6">Patient not found.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Patient Details</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>Diagnosis:</strong> {patient.diagnosis}</p>
        {/* Extend with history, consultation, etc. */}
      </div>
    </div>
  );
}