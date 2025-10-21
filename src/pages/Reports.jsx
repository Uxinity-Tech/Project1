import React, { useEffect, useState } from "react";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";

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

  // ✅ Tailwind-safe gradient colors
  const colorClasses = {
    teal: "from-teal-500 to-teal-600",
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
  };

  const StatsCard = ({ icon: Icon, title, value, color = "teal", isCurrency = false }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white shadow-md flex items-center justify-center`}
        >
          {Icon ? <Icon className="text-xl" /> : <span className="text-xl font-bold">₹</span>}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
            {title}
          </p>
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-200">
        {isCurrency ? `₹${value.toLocaleString()}` : value.toLocaleString()}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-extrabold text-teal-700 mb-10 tracking-tight flex items-center">
          <span className="text-3xl mr-3">📊</span>
          Reports & Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            icon={FaUsers}
            title="Total Patients"
            value={totalPatients}
            color="blue"
          />
          <StatsCard
            icon={FaCalendarAlt}
            title="Total Appointments"
            value={totalAppointments}
            color="green"
          />
          <StatsCard
            title="Total Revenue"
            value={totalRevenue}
            color="teal"
            isCurrency={true}
          />
        </div>
      </div>
    </div>
  );
}
