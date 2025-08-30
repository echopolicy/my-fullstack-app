import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import 'tailwindcss/tailwind.css';

const NotFound = () => {
  const [searchAttempt, setSearchAttempt] = useState(0);
  const [shipPosition, setShipPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  // Handle spaceship movement on click
  const handleMoveShip = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 32; // Center ship (64x64)
    const y = e.clientY - rect.top - 32;
    setShipPosition({ x, y });
  };

  // Handle search button with particle effect
  const handleSearch = () => {
    setSearchAttempt(searchAttempt + 1);
    // Create particles
    const newParticles = Array.from({ length: 10 }, () => ({
      id: Math.random(),
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      scale: Math.random() * 0.5 + 0.5,
    }));
    setParticles(newParticles);
    // Clear particles after animation
    setTimeout(() => setParticles([]), 1000);
  };

  // Starry background animation
  useEffect(() => {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star) => {
      star.style.animationDelay = `${Math.random() * 2}s`;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-blue-900 flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
      {/* Starry background */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="star absolute bg-white rounded-full opacity-70 animate-twinkle"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Animated title */}
      <motion.h1
        className="text-6xl md:text-8xl font-bold mb-4 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        404 - Lost in Space!
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl mb-6 text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Oops! The page you're looking for has drifted into the cosmic void. Fly the rocket to see if you can get there. 
      </motion.p>

      {/* Interactive spaceship area */}
      <div
        className="relative w-64 h-64 md:w-96 md:h-96 mb-8 cursor-pointer"
        onClick={handleMoveShip}
      >
        <motion.div
          className="absolute w-16 h-16 bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://www.svgrepo.com/show/381273/rocket-space-astronomy-spaceship-satellite.svg')",
          }}
          animate={{ x: shipPosition.x, y: shipPosition.y, rotate: searchAttempt % 2 === 0 ? 12 : -12 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />
      </div>

      {/* Dynamic message */}
      <AnimatePresence>
        <motion.p
          key={searchAttempt}
          className="text-lg md:text-xl mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {searchAttempt === 0 && "Click the space to fly the ship or search for the missing page!"}
          {searchAttempt === 1 && "Still lost? Maybe it's hiding in another galaxy!"}
          {searchAttempt >= 2 && "This page is gone! Fly around or head back home!"}
        </motion.p>
      </AnimatePresence>

      {/* Search button with particle effect */}
      <div className="relative">
        <motion.button
          onClick={handleSearch}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-full mb-4 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Search Again
        </motion.button>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full"
            style={{ left: '50%', top: '50%' }}
            initial={{ x: 0, y: 0, opacity: 1, scale: particle.scale }}
            animate={{ x: particle.x, y: particle.y, opacity: 0, scale: 0 }}
            transition={{ duration: 1 }}
          />
        ))}
      </div>

      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
      >
        Return to Home Base
      </Link>

      {/* Tailwind CSS for twinkling stars */}
      <style>
        {`
          .animate-twinkle {
            animation: twinkle 2s infinite;
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 0.2; }
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;