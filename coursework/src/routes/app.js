const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.send('Welcome to the main page!');
});

// Test route
router.get('/test', (req, res) => {
  res.send('This is a test page');
});

module.exports = router;