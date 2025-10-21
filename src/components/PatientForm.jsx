import React, { useState } from "react";

export default function PatientForm({ onSave }) {
  const [patient, setPatient] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
    notes: "",
  });

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(patient);
    setPatient({ name: "", phone: "", age: "", gender: "", notes: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        name="name"
        placeholder="Patient Name"
        value={patient.name}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="phone"
        placeholder="Phone"
        value={patient.phone}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        name="age"
        placeholder="Age"
        value={patient.age}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <select
        name="gender"
        value={patient.gender}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <textarea
        name="notes"
        placeholder="Medical Notes / History"
        value={patient.notes}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">
        Save Patient
      </button>
    </form>
  );
}