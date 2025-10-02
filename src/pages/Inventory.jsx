import React, { useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaFilter } from "react-icons/fa";
import { useInventory } from "../context/InventoryContext";

export default function Inventory() {
  const { items, setItems } = useInventory();
  const [form, setForm] = useState({ name: "", quantity: "", category: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

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
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const filteredItems = items
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) => !filterCategory || item.category === filterCategory);

  const categories = [...new Set(items.map((item) => item.category))];

  // const getQuantityColor = (quantity) => {
  //   if (quantity <= 5) return "bg-red-100 text-red-800";
  //   if (quantity <= 20) return "bg-yellow-100 text-yellow-800";
  //   return "bg-green-100 text-green-800";
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-teal-700 tracking-tight mb-2">
              Inventory Management
            </h1>
            <p className="text-teal-600">Manage your dental supplies efficiently</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
              Total Items: {items.length}
            </span>
          </div>
        </div>

        {/* Inventory Form */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl mb-8 border border-teal-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaPlus className="mr-2 text-teal-600" />
            {editingId ? "Update Item" : "Add New Item"}
          </h2>
          <form
            onSubmit={handleAddOrUpdate}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-end"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 placeholder-gray-400"
                placeholder="e.g. Stethoscope"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 placeholder-gray-400"
                placeholder="e.g. 10"
                min="0"
                required
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 placeholder-gray-400"
                placeholder="e.g. Equipment"
                required
              />
            </div>
            <button
              type="submit"
              className="md:col-span-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-teal-600 hover:to-teal-700 focus:ring-2 focus:ring-teal-400 font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              {editingId ? "Update Item" : "Add Item"}
            </button>
          </form>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl mb-6 border border-teal-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 placeholder-gray-400"
              placeholder="Search items..."
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-teal-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-teal-500 to-teal-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center">
                        <FaSearch className="text-4xl mb-2 text-gray-300" />
                        <p className="text-lg font-medium">No items found</p>
                        <p className="text-sm">Try adjusting your search or filter</p>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-teal-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${(item.quantity)}`}>
                        {/* getQuantityColor(item.quantity)} */}
                        {item.quantity}
                      </span>
                      {/* {item.quantity <= 5 && (
                        <p className="text-xs text-red-600 mt-1">Low Stock!</p>
                      )} */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold bg-teal-100 text-teal-800 rounded-full">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-teal-600 hover:text-teal-900 p-2 rounded-lg hover:bg-teal-100 transition-all duration-200"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                        title="Delete"
                      >
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
    </div>
  );
}