// /pages/Inventory.jsx
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useInventory } from "../context/InventoryContext";

export default function Inventory() {
  const { items, setItems } = useInventory(); // shared inventory state
  const [form, setForm] = useState({ name: "", quantity: "", category: "" });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (!form.name || !form.quantity || !form.category) return;

    if (editingId) {
      setItems(
        items.map((item) =>
          item.id === editingId ? { ...item, ...form, quantity: Number(form.quantity) } : item
        )
      );
      setEditingId(null);
    } else {
      setItems([...items, { id: Date.now(), ...form, quantity: Number(form.quantity) }]);
    }

    setForm({ name: "", quantity: "", category: "" });
  };

  const handleEdit = (item) => {
    setForm({ ...item });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-600 tracking-tight mb-6">
          Inventory Management
        </h1>

        {/* Inventory Form */}
        <form
          onSubmit={handleAddOrUpdate}
          className="bg-white p-6 rounded-2xl shadow-lg mb-6 grid gap-4 sm:grid-cols-3 items-end"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400"
              placeholder="e.g. Stethoscope"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400"
              placeholder="e.g. 10"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-400"
              placeholder="e.g. Equipment"
              required
            />
          </div>
          <button
            type="submit"
            className="sm:col-span-3 bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition"
          >
            {editingId ? "Update Item" : "Add Item"}
          </button>
        </form>

        {/* Inventory Table */}
        <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-teal-100">
                <th className="px-4 py-2 text-left">Item Name</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No items in inventory.
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-600">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
