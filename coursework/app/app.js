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

// Parses form data
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
const bcrypt = require("bcryptjs");


const session = require("express-session");

// enables session storing for users
app.use(session({
  secret: "silly_cat_inc",  
  resave: false,
  saveUninitialized: true, // saves new session if empty
  cookie: { secure: false }  
}));


// home page / root page
app.get("/", function (req, res) {
  res.render("home");  // Render the 'index.pug' template
});

// account page
app.get("/account", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login"); // Redirect if not logged in
  }
  
  res.render("account", { username: req.session.user.Username });
});

// login page
app.get("/login", (req, res) => {
  res.render("login"); // Render the login.pug template
});

// Forum main page
app.get("/forum", function(req, res) {
  // For now, just render the forum page without data
  res.render("forum");
});

// login function fetching from database
app.post("/login", async (req, res) => {
  const { username, password } = req.body; // username and password taken from user input
  console.log(`Received login attempt - Username: ${username}, Password: ${password}`); // console logging for debugging

  try {
    const result = await db.query("SELECT * FROM Users WHERE Username = ?", [username]); // matching given username to db username
    const rows = Array.isArray(result) ? result : [result]; // make sure its an array
    console.log("Raw database response:", rows); // print database response for debugging

    // check if user is not found in database
    if (rows.length === 0) {
      console.log("User not found in database.");
      return res.send("Invalid username or password");
    }

    // user = first user found from query
    const user = rows[0];
    console.log(`Found user: ${JSON.stringify(user)}`); // debugging

    if (password === user.Password) {  // Direct password comparison, no hashing
      req.session.user = user; // storing user in session
      console.log("Login successful, redirecting..."); // debugging
      return res.redirect("/account"); // send to account page
    }

    console.log("Password incorrect.");
    res.send("Invalid username or password");

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("Server error");
  }
});



// Start server on port 3000
app.listen(3000,function(){
  console.log(`Server running at http://127.0.0.1:3000/`);
});