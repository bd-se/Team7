import React from 'react';
// Import GameTable component
import GameTable from '../components/GameTable';

const Game = () => {
  return (
    <div>
      <GameTable />
      <h1>Game Page</h1>
      <p>Welcome to the game! Enjoy playing and check your stats.</p>
    </div>
  );
};

export default Game;