// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react"; // nice icon
import mockPolls from "../../mockData/mockPolls"; 

const AdminDashboard = () => {
  const [polls, setPolls] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Mock API call for now
    setPolls(mockPolls);
  }, []);

  const filteredPolls = polls.filter((poll) => {
    const userName = poll.user?.fullName?.toLowerCase() || "";
    const userEmail = poll.user?.email?.toLowerCase() || "";
    const searchTerm = search.toLowerCase();

    return (
      poll.question.toLowerCase().includes(searchTerm) ||
      poll.category.toLowerCase().includes(searchTerm) ||
      userName.includes(searchTerm) ||
      userEmail.includes(searchTerm)
    );
  });

  const handleDelete = (id) => {
    alert(`Poll ${id} deleted (mock action).`);
  };

  const handleBanUser = (userId) => {
    alert(`User ${userId} banned (mock action).`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Admin Dashboard</h1>

      {/* Search bar */}
      <div className="flex items-center bg-white shadow-sm rounded-lg p-3 mb-6">
        <Search className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by poll, category, or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow outline-none text-gray-700"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Question</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Created By</th>
              <th className="px-4 py-3 text-left">Visibility</th>
              <th className="px-4 py-3 text-left">Trending</th>
              <th className="px-4 py-3 text-left">Created At</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPolls.length > 0 ? (
              filteredPolls.map((poll) => (
                <tr key={poll.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{poll.question}</td>
                  <td className="px-4 py-3">{poll.category}</td>
                  <td className="px-4 py-3 capitalize">{poll.pollType}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">
                      {poll.user?.fullName || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500">{poll.user?.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {poll.visibilityPublic ? "Public" : "Private"}
                  </td>
                  <td className="px-4 py-3">
                    {poll.trending ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(poll.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleDelete(poll.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleBanUser(poll.user?.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Ban User
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No polls found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;