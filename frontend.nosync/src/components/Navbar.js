import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../App.css"; 

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setMenuOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/logoEP.png" alt="EchoPolicy Logo" />
          <span>EchoPolicy</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link to="/polls">All Polls</Link>
          <Link to="/create">New Poll</Link>
          <Link to="/about" className="text-[#F97316]">About</Link>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="font-medium"
              >
                Account ▾
              </button>
                {menuOpen && (
                  <div className="dropdown">
                    <Link to="/admin/create" onClick={() => setMenuOpen(false)}>
                      New Poll
                    </Link>
                    <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                      Your Polls
                    </Link>
                    <button onClick={handleLogout} className="text-red-500">
                      Logout
                    </button>
                  </div>
                )}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}

          <a href="https://github.com/echopolicy" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)}>
          ☰
        </button>
      </div>

      {/* Mobile Links */}
      {mobileOpen && (
        <div className="mobile-menu">
          <Link to="/polls" onClick={() => setMobileOpen(false)}>All Polls</Link>
          <Link to="/create" onClick={() => setMobileOpen(false)}>New Poll</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)}>About</Link>

          {isLoggedIn ? (
            <>
              <Link to="/admin/create" onClick={() => setMobileOpen(false)}>New Poll</Link>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Your Polls</Link>
              <button onClick={handleLogout} className="text-red-500">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)}>Login</Link>
          )}

          <a
            href="https://github.com/echopolicy"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
          >
            GitHub
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;