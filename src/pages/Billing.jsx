import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaFileExport, FaSearch } from "react-icons/fa";

export default function Billing() {
  const [bills, setBills] = useState([]);
  const [form, setForm] = useState({ id: null, patient: "", amount: "", status: "Pending" });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const saved = localStorage.getItem("bills");
    if (saved) setBills(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!form.patient.trim()) {
      setError("Patient voyant name is required.");
      return;
    }
    if (!form.amount || form.amount <= 0) {
      setError("Please enter a valid amount greater than 0.");
      return;
    }

    if (isEditing) {
      setBills(bills.map((bill) => (bill.id === form.id ? { ...form } : bill)));
      setIsEditing(false);
    } else {
      setBills([...bills, { ...form, id: Date.now() }]);
    }

    setForm({ id: null, patient: "", amount: "", status: "Pending" });
  };

  const handleEdit = (bill) => {
    setForm(bill);
    setIsEditing(true);
    setError(null);
  };

  const handleDelete = (id) => {
    setBills(bills.filter((bill) => bill.id !== id));
  };

  const handleStatusToggle = (id) => {
    setBills(
      bills.map((bill) =>
        bill.id === id
          ? { ...bill, status: bill.status === "Pending" ? "Paid" : "Pending" }
          : bill
      )
    );
  };

  const handleExportCSV = () => {
    const headers = "Patient,Amount,Status\n";
    const rows = bills
      .map((bill) => `${bill.patient},₹${bill.amount},${bill.status}`)
      .join("\n");
    const csv = headers + rows;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bills.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredBills = bills.filter((bill) => {
    const matchesSearch = bill.patient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-extrabold text-teal-700 mb-10 tracking-tight">
          Billing Management
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center shadow-sm">
            <FaTrash className="mr-3 text-lg" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl mb-12 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="patient" className="block text-sm font-semibold text-gray-700 mb-2">
                Patient Name
              </label>
              <input
                type="text"
                id="patient"
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                placeholder="Enter patient name"
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200 shadow-md"
          >
            <FaPlus className="mr-2 text-lg" />
            {isEditing ? "Update Bill" : "Add Bill"}
          </button>
        </form>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
              Search by Patient
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient name..."
                className="w-full p-3 pl-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
            </div>
          </div>
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleExportCSV}
              className="flex items-center px-4 py-3 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200"
            >
              <FaFileExport className="mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        <h3 className="text-2xl font-semibold text-teal-700 mb-8">
          Bill Records
        </h3>
        <div className="space-y-4">
          {filteredBills.length === 0 && (
            <p className="text-gray-500 text-center text-lg font-medium">
              No bills found.
            </p>
          )}
          {filteredBills.map((bill) => (
            <div
              key={bill.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700">
                  <strong>Patient:</strong> {bill.patient}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Amount:</strong> ₹{parseFloat(bill.amount).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> {bill.status}
                </p>
              </div>
              <div className="flex space-x-4 mt-4 sm:mt-0">
                <button
                  onClick={() => handleEdit(bill)}
                  className="flex items-center px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200"
                >
                  <FaEdit className="mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleStatusToggle(bill.id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition duration-200 focus:ring-2 focus:ring-offset-2 ${
                    bill.status === "Paid"
                      ? "bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500"
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 focus:ring-yellow-500"
                  }`}
                >
                  {bill.status === "Paid" ? "Mark Pending" : "Mark Paid"}
                </button>
                <button
                  onClick={() => handleDelete(bill.id)}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200"
                >
                  <FaTrash className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}