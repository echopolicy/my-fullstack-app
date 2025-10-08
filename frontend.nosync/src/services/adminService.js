// src/services/adminService.js
export const adminLogin = async (email, password) => {
  // Temporary mock logic
  if (email === "admin@echopolicy.com" && password === "admin123") {
    return { success: true, token: "fake-jwt-token" };
  } else {
    throw new Error("Invalid credentials");
  }
};