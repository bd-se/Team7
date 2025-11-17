import React from 'react';

const Hero = () => {
  return (
    <section className="bg-blue-500 text-white py-20 px-4 md:px-10 text-center">
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">Welcome to the Game</h1>
      <p className="text-base sm:text-lg md:text-xl mb-6">
        Experience the thrill of the game with our interactive platform.
      </p>
      <button className="bg-white text-blue-500 font-semibold py-2 px-4 rounded hover:bg-gray-200">
        Get Started
      </button>
    </section>
  );
};

export default Hero;