import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function FollowUpList() {
  const [followUps, setFollowUps] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("followUps");
    if (saved) setFollowUps(JSON.parse(saved));
  }, []);

  const filteredFollowUps = followUps.filter(
    (item) =>
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-teal-600 tracking-tight mb-6">
          Follow-Up List
        </h2>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search by patient or note..."
            className="w-full sm:w-1/2 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200 bg-white shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search follow-ups by patient or note"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" />
        </div>

        {filteredFollowUps.length === 0 ? (
          <p className="text-center text-teal-600 text-lg font-medium">
            No follow-up entries found.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFollowUps.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border-l-4 border-teal-500"
              >
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>Patient:</strong> {item.patientName}
                  </p>
                  <p className="line-clamp-2">
                    <strong>Note:</strong> {item.note}
                  </p>
                  <p>
                    <strong>Follow-Up Date:</strong>{" "}
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}