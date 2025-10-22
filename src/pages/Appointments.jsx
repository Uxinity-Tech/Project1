import React, { useEffect, useState } from "react";
import { FaCalendarPlus, FaTrash } from "react-icons/fa";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    date: "",
    time: "",
    doctorId: "",
    patientId: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const savedDoctors = JSON.parse(localStorage.getItem("doctors")) || [];
    const savedPatients = JSON.parse(localStorage.getItem("patients")) || [];

    setAppointments(savedAppointments);
    setDoctors(savedDoctors);
    setPatients(savedPatients);
  }, []);

  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const selectedDoctor = doctors.find((d) => d.id === parseInt(form.doctorId));
    const selectedPatient = patients.find((p) => p.id === parseInt(form.patientId));

    if (!form.date || !form.time || !selectedDoctor || !selectedPatient) {
      setError("Please fill all required fields.");
      return;
    }

    const newAppointment = {
      id: Date.now(),
      date: form.date,
      time: form.time,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
    };

    setAppointments([...appointments, newAppointment]);
    setForm({ date: "", time: "", doctorId: "", patientId: "" });
  };

  const handleDelete = (id) => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-teal-700 mb-10 tracking-tight">
          Schedule Appointments
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center shadow-sm">
            <FaTrash className="mr-3 text-lg" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl mb-12 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-semibold text-gray-700 mb-2">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="doctorId" className="block text-sm font-semibold text-gray-700 mb-2">
              Doctor
            </label>
            <select
              id="doctorId"
              value={form.doctorId}
              onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
              required
            >
              <option value="">Select Doctor</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="patientId" className="block text-sm font-semibold text-gray-700 mb-2">
              Patient
            </label>
            <select
              id="patientId"
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
              required
            >
              <option value="">Select Patient</option>
              {patients.map((pat) => (
                <option key={pat.id} value={pat.id}>
                  {pat.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="col-span-1 md:col-span-2 flex items-center justify-center w-full md:w-auto px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200 shadow-md"
          >
            <FaCalendarPlus className="mr-2 text-lg" />
            Add Appointment
          </button>
        </form>

        <h3 className="text-2xl font-semibold text-teal-700 mb-8">
          Scheduled Appointments
        </h3>
        <div className="space-y-4">
          {appointments.length === 0 && (
            <p className="text-gray-500 text-center text-lg font-medium">
              No appointments scheduled yet.
            </p>
          )}
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">
                  <strong>Date:</strong> {new Date(appt.date).toLocaleDateString()} @ {appt.time}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Doctor:</strong> {appt.doctorName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Patient:</strong> {appt.patientName}
                </p>
              </div>
              <button
                onClick={() => handleDelete(appt.id)}
                className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}