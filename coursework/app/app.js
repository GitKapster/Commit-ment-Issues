const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');

// root
app.get("/", function(req, res) {
  res.send("Hello World");
});

// Start server on port 3000
app.listen(3000,function(){
  console.log(`Server running at http://127.0.0.1:3000/`);
});