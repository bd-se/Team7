const express = require('express');
const cors = require('cors');

const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./db.sqlite');
const PORT = 3000;

// Serve a welcome message at the root path
const path = require('path');

// Serve React application
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// User profile GET endpoint
app.get('/user/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    db.get(`SELECT id, username, email FROM users WHERE id = ?`, [user.id], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Error querying database' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    });
  });
});

// User profile PUT endpoint
app.put('/user/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const { username, email } = req.body;
    if (!username && !email) {
      return res.status(400).json({ error: 'At least one field (username or email) is required' });
    }

    const updates = [];
    const values = [];
    if (username) {
      updates.push('username = ?');
      values.push(username);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    values.push(user.id);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    db.run(query, values, function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error updating user profile' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'Profile updated successfully' });
    });
  });
});

// Auth me endpoint
app.get('/auth/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token is required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    db.get(`SELECT id, username, email FROM users WHERE id = ?`, [user.id], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Error querying database' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    });
  });
});

// Auth login endpoint
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error querying database' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  });
});

// Auth signup endpoint
app.post('/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
      [username, email, hashedPassword],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Error inserting user into database' });
        }
        res.status(201).json({ id: this.lastID, username, email });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Get user statistics
app.get('/user/stats', (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  db.all(
    `SELECT COUNT(*) AS gamesPlayed, SUM(score > 0) AS gamesWon FROM game_history WHERE user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Error querying database' });
      }

      const stats = rows[0];
      res.status(200).json({
        gamesPlayed: stats.gamesPlayed,
        gamesWon: stats.gamesWon,
        gamesLost: stats.gamesPlayed - stats.gamesWon
      });
    }
  );
});
// Update /game/stand to save game result
app.post('/game/stand', (req, res) => {
  const { sessionId, userId } = req.body;
  const session = gameSessions[sessionId];

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const { blackjack, playerHand, dealerHand } = session;

  // Dealer's turn
  while (blackjack.calculateScore(dealerHand) < 17) {
    dealerHand.push(blackjack.dealCard());
  }

  const playerScore = blackjack.calculateScore(playerHand);
  const dealerScore = blackjack.calculateScore(dealerHand);

  let result;
  if (blackjack.isBust(dealerHand) || playerScore > dealerScore) {
    result = 'win';
  } else if (playerScore < dealerScore) {
    result = 'lose';
  } else {
    result = 'draw';
  }

  session.status = 'completed';

  // Save game result to database
  saveGameResult(userId, playerScore, result);

  res.status(200).json({
    playerHand,
    dealerHand,
    playerScore,
    dealerScore,
    result,
    message: `Game over. You ${result}.`,
    status: session.status
  });
});
// Persist game result to game_history
const saveGameResult = (userId, score, result) => {
  const datePlayed = new Date().toISOString();
  db.run(
    `INSERT INTO game_history (user_id, score, date_played) VALUES (?, ?, ?)`,
    [userId, result === 'win' ? score : 0, datePlayed],
    (err) => {
      if (err) {
        console.error('Error saving game result:', err.message);
      }
    }
  );
};
// Player stands to end their turn
app.post('/game/stand', (req, res) => {
  const { sessionId } = req.body;
  const session = gameSessions[sessionId];

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const { blackjack, playerHand, dealerHand } = session;

  // Dealer's turn
  while (blackjack.calculateScore(dealerHand) < 17) {
    dealerHand.push(blackjack.dealCard());
  }

  const playerScore = blackjack.calculateScore(playerHand);
  const dealerScore = blackjack.calculateScore(dealerHand);

  let result;
  if (blackjack.isBust(dealerHand) || playerScore > dealerScore) {
    result = 'win';
  } else if (playerScore < dealerScore) {
    result = 'lose';
  } else {
    result = 'draw';
  }

  session.status = 'completed';

  res.status(200).json({
    playerHand,
    dealerHand,
    playerScore,
    dealerScore,
    result,
    message: `Game over. You ${result}.`,
    status: session.status
  });
});
// Player hits to receive another card
app.post('/game/hit', (req, res) => {
  const { sessionId } = req.body;
  const session = gameSessions[sessionId];

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const { blackjack, playerHand } = session;
  const newCard = blackjack.dealCard();
  playerHand.push(newCard);

  if (blackjack.isBust(playerHand)) {
    session.status = 'completed';
    return res.status(200).json({
      playerHand,
      message: 'Bust! You lose.',
      status: session.status
    });
  }

  res.status(200).json({
    playerHand,
    message: 'Card dealt'
  });
});
// Import Blackjack module
const Blackjack = require('./blackjack');

// In-memory game sessions
const gameSessions = {};

// Start a new game session
app.post('/game/start', (req, res) => {
  const sessionId = Date.now().toString(); // Simple session ID
  const blackjack = new Blackjack();
  const playerHand = [blackjack.dealCard(), blackjack.dealCard()];
  const dealerHand = [blackjack.dealCard(), blackjack.dealCard()];

  gameSessions[sessionId] = {
    blackjack,
    playerHand,
    dealerHand,
    status: 'in-progress'
  };

  res.status(200).json({
    sessionId,
    playerHand,
    dealerHand: [dealerHand[0]], // Show only one dealer card
    message: 'Game started'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});