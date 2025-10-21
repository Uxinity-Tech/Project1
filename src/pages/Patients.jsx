import React, { useState, useEffect } from "react";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    age: "",
    gender: "",
    diagnosis: "",
    doctorId: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load doctors from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("doctors");
    setDoctors(stored ? JSON.parse(stored) : []);
  }, []);

  // Load patients from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("patients");
    setPatients(saved ? JSON.parse(saved) : []);
  }, []);

  // Save to localStorage when patients change
  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle doctor selection
  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    setSelectedDoctorId(doctorId);
    setFormData({ ...formData, doctorId });
  };

  // Handle add/update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.doctorId) {
      alert("Please select a doctor");
      return;
    }
    if (isEditing) {
      setPatients(patients.map((p) => (p.id === formData.id ? formData : p)));
      setIsEditing(false);
    } else {
      setPatients([...patients, { ...formData, id: Date.now() }]);
    }
    setFormData({
      id: null,
      name: "",
      age: "",
      gender: "",
      diagnosis: "",
      doctorId: selectedDoctorId,
    });
  };

  const handleEdit = (id) => {
    const patient = patients.find((p) => p.id === id);
    setFormData(patient);
    setIsEditing(true);
    setSelectedDoctorId(patient.doctorId);
  };

  const handleDelete = (id) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  // Filter patients based on selected doctor
  const filteredPatients = patients.filter(
    (p) => p.doctorId === selectedDoctorId
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Patient Management
        </h2>

        {/* Doctor Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Doctor
          </label>
          <select
            value={selectedDoctorId}
            onChange={handleDoctorChange}
            className="w-full max-w-xs p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            aria-label="Select a doctor"
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg mb-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter patient name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                required
                aria-label="Patient name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                required
                aria-label="Patient age"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                required
                aria-label="Patient gender"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis
              </label>
              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                placeholder="Enter diagnosis"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                aria-label="Patient diagnosis"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 px-6 py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
          >
            {isEditing ? "Update Patient" : "Add Patient"}
          </button>
        </form>

        {/* Patient List */}
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Patient List
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-lg">
            <thead>
              <tr className="bg-indigo-50 text-gray-700">
                <th className="px-6 py-4 text-left font-semibold text-sm">
                  Name
                </th>
                <th className="px-6 py-4 text-center font-semibold text-sm">
                  Age
                </th>
                <th className="px-6 py-4 text-center font-semibold text-sm">
                  Gender
                </th>
                <th className="px-6 py-4 text-left font-semibold text-sm">
                  Diagnosis
                </th>
                <th className="px-6 py-4 text-center font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 text-left text-gray-800">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-800">
                    {patient.age}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-800">
                    {patient.gender}
                  </td>
                  <td className="px-6 py-4 text-left text-gray-800">
                    {patient.diagnosis}
                  </td>
                  <td className="px-6 py-4 text-center space-x-4">
                    <button
                      onClick={() => handleEdit(patient.id)}
                      className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 hover:text-indigo-800 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                      aria-label={`Edit patient ${patient.name}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 hover:text-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                      aria-label={`Delete patient ${patient.name}`}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500 text-sm font-medium"
                  >
                    No patients found for this doctor.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}