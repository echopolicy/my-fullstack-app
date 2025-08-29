import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`bg-white text-[#1E3A5F] px-6 py-1 sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : "shadow"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logoEP.png" alt="EchoPolicy Logo" className="h-24 w-auto" />
          <span className="text-xl font-bold">EchoPolicy</span>
        </Link>

        {/* Links */}
        <div className="space-x-4 flex items-center">
          <Link to="/polls" className="hover:text-[#3B82F6]">
            Polls
          </Link>
          <Link to="/about" className="hover:text-[#F97316]">
            About
          </Link>

          {isLoggedIn ? (
            <div className="relative">
              {/* Account Button */}
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="hover:text-[#2253c5] font-medium"
              >
                Account ▾
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg border">
                  <Link
                    to="/admin/create"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    New Poll
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Your Polls
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-[#2253c5]">
              Login
            </Link>
          )}

          <a
            href="https://github.com/echopolicy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#3B82F6]"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;