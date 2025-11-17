import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
  const baseStyles = 'px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded focus:outline-none focus:ring';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
  };

  const buttonStyles = `${baseStyles} ${variants[variant] || variants.primary}`;

  return (
    <button type={type} onClick={onClick} className={buttonStyles}>
      {children}
    </button>
  );
};

export default Button;