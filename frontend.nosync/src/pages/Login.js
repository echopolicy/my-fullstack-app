import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const url = isLogin
      ? `${API_BASE_URL}/users/login`
      : `${API_BASE_URL}/users/signup`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
      } else {
        if (isLogin) {
          // Save token & user in localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setSuccess("Login successful!");
          // Redirect to My Polls or Home
          navigate("/dashboard");
        } else {
          setSuccess("Signup successful! Please log in.");
          setFormData({ fullName: "", email: "", password: "" });
          setIsLogin(true); // switch back to login tab
        }
      }
    } catch (err) {
      setError("Network error");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Toggle Tabs */}
        <div className="flex mb-6">
          <button
            className={`w-1/2 py-2 text-lg font-semibold rounded-tl-2xl ${
              isLogin ? "bg-[#1E3A5F] text-white" : "bg-gray-200"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 text-lg font-semibold rounded-tr-2xl ${
              !isLogin ? "bg-[#1E3A5F] text-white" : "bg-gray-200"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-500 mb-2">{success}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required={!isLogin}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F]"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1E3A5F]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1E3A5F] text-white py-2 rounded-lg font-semibold hover:bg-[#3B82F6] transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <div className="mt-3 text-left text-xs leading-normal text-gray-500">
          By continuing to use our services, you acknowledge that you have both
          read and agree to our{" "}
          <a
            href="/terms"
            className="font-medium underline underline-offset-2 hover:text-black"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="font-medium underline underline-offset-2 hover:text-black"
          >
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}