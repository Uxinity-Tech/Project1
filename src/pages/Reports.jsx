import React, { useEffect, useState } from "react";

export default function Reports() {
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const patients = JSON.parse(localStorage.getItem("patients")) || [];
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const bills = JSON.parse(localStorage.getItem("bills")) || [];

    setTotalPatients(patients.length);
    setTotalAppointments(appointments.length);
    setTotalRevenue(
      bills.reduce((total, bill) => total + parseFloat(bill.amount || 0), 0)
    );
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Patients</h3>
          <p className="text-2xl">{totalPatients}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Appointments</h3>
          <p className="text-2xl">{totalAppointments}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl">₹{totalRevenue}</p>
        </div>
      </div>
    </div>
  );
}