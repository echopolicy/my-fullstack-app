import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { admin } = useAdminAuth();

  // If no admin is logged in, redirect to login
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
