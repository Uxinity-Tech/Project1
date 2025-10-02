import React, { useState } from "react";

export default function AppointmentForm({ onBook }) {
  const [data, setData] = useState({
    patientName: "",
    date: "",
    time: "",
    treatment: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook(data);
    setData({ patientName: "", date: "", time: "", treatment: "", status: "Pending" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        name="patientName"
        placeholder="Patient Name"
        value={data.patientName}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="date"
        type="date"
        value={data.date}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="time"
        type="time"
        value={data.time}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="treatment"
        placeholder="Treatment (e.g. Cleaning, RCT)"
        value={data.treatment}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">
        Book Appointment
      </button>
    </form>
  );
}

