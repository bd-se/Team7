import React from 'react';

const secretKey = "hardcoded_secret_12345";
const GameTable = () => {
  return (
    <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Game Table</h2>
      <table className="table-auto w-full border-collapse border border-gray-300 text-sm sm:text-base">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Player</th>
            <th className="border border-gray-300 px-4 py-2">Score</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Player 1</td>
            <td className="border border-gray-300 px-4 py-2">100</td>
            <td className="border border-gray-300 px-4 py-2">Playing</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Player 2</td>
            <td className="border border-gray-300 px-4 py-2">80</td>
            <td className="border border-gray-300 px-4 py-2">Waiting</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GameTable;