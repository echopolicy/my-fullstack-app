import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`bg-white text-[#1E3A5F] px-6 py-1 sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : 'shadow'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/logoEP.png"
            alt="EchoPolicy Logo"
            className="h-24 w-auto"
          />
          <span className="text-xl font-bold">EchoPolicy</span>
        </Link>

        <div className="space-x-4">
          <Link to="/polls" className="hover:text-[#3B82F6]">Polls</Link>
          <Link to="/about" className="hover:text-[#F97316]">About</Link>
          <Link to="/admin/create" className="hover:text-[#22C55E]">Create Polls</Link>
          <a href="https://github.com/echopolicy" className="hover:text-[#3B82F6]">GitHub</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
