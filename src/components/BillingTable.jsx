export default function BillingTable({ bills = [] }) {
  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full border text-left">
        <thead className="bg-pink-200">
          <tr>
            <th className="p-2">Patient</th>
            <th className="p-2">Treatment</th>
            <th className="p-2">Amount (₹)</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{bill.patientName}</td>
              <td className="p-2">{bill.treatment}</td>
              <td className="p-2">₹{bill.amount}</td>
              <td className="p-2">{bill.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
