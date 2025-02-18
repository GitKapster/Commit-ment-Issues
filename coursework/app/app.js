const express = require('express');
const router = express.Router();

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');

// Home page
router.get('/', (req, res) => {
  res.send('Welcome to the main page!');
});

// Test route
router.get('/test', (req, res) => {
  res.send('This is a test page');
});

module.exports = router;