// frontend/src/context/AdminAuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem("admin");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  useEffect(() => {
    if (admin) {
      localStorage.setItem("admin", JSON.stringify(admin));
    } else {
      localStorage.removeItem("admin");
    }
  }, [admin]);

  const login = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
    navigate("/admin/dashboard");
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const isAuthenticated = !!admin;

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin, login, logout, isAuthenticated }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Custom hook for easy access to context
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};