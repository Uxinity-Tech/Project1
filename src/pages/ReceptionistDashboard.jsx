import React from "react";

const ReceptionistDashboard = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4 text-teal-700">Receptionist Dashboard</h2>
    <ul className="list-disc ml-6">
      <li>Check-in Patients</li>
      <li>Manage Appointments</li>
      <li>View Patient List</li>
      {/* Add more receptionist features as needed */}
    </ul>
  </div>
);

export default ReceptionistDashboard;