const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'password',
  database: 'myapp'
});

// Test route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});