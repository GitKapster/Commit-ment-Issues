const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'password',
  database: 'myapp',
  connectTimeout: 30000 // 30 seconds
});

// Connect to database with robust error handling
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    console.error('Connection details:', {
      host: 'db',
      user: 'root',
      database: 'myapp'
    });
    
    // Optional: Implement reconnection logic
    const reconnect = () => {
      console.log('Attempting to reconnect...');
      db.connect((reconnectErr) => {
        if (reconnectErr) {
          console.error('Reconnection failed:', reconnectErr);
          setTimeout(reconnect, 5000); // Try again in 5 seconds
        } else {
          console.log('Reconnected to the database');
        }
      });
    };

    // Start reconnection attempts
    setTimeout(reconnect, 5000);
  } else {
    console.log('Connected to the database');
  }
});

// Error event handler
db.on('error', (err) => {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('Database has too many connections.');
  }
  if (err.code === 'ECONNREFUSED') {
    console.error('Database connection was refused.');
  }
});

// Test route with database connection check
app.get('/', (req, res) => {
  // Simple database connectivity test
  db.query('SELECT 1', (err, results) => {
    if (err) {
      res.status(500).send('Database connection error: ' + err.message);
    } else {
      res.send('Hello from Express! Database is connected.');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});