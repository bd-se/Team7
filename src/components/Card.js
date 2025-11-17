import React from 'react';

const Card = ({ title, children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden text-sm sm:text-base">
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="p-3 sm:p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;