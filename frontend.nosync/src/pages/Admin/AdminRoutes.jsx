import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import AdminDashboard from "./AdminDashboard";

const AdminRoutes = () => {
  const { admin } = useAdminAuth();

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<AdminDashboard />} />
      {/* More admin routes will go here */}
    </Routes>
  );
};

export default AdminRoutes;
