const express = require("express");
const axios = require("axios"); // this is for the api hook

// Create express app
var app = express();
const { query } = require("./services/db");

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

// account list page
app.get("/account-list", async (req, res) => {
  try {
    const results = await query("SELECT UserID, Username FROM Users");
    console.log("Fetched users:", results); // Debugging
    res.render("account-list", { users: results });
  } catch (err) {
    console.error("Database query error:", err.message);
    res.status(500).send(`Database query failed: ${err.message}`);
  }
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


// Trying to add the webhook for esports updates

// Using an RSS to JSON service
async function getEsportsNews() {
  try {
    const response = await axios.get('https://api.rss2json.com/v1/api.json', {
      params: {
        rss_url: 'https://www.hltv.org/rss/news',  // HLTV news RSS feed
        api_key: 'hioxghhkhlbzgtbsgorqr3jz6m25fqeujxj8cok9', // I got this api key from rss2json, idk if it will work
        count: 10
      }
    });
    
    return response.data.items.map(item => ({
      title: item.title,
      date: new Date(item.pubDate).toLocaleDateString()
    }));
  } catch (error) {
    // Incase api key gets deleted (i might have to update the api key once in a while)
    return [
      { title: "Team Liquid advances to finals", date: "Feb 27, 2025" },
      { title: "New Valorant tournament announced", date: "Feb 26, 2025" },
      { title: "CS2 patch brings major weapon changes", date: "Feb 25, 2025" }
    ];
  }
}
// Forum main page
app.get("/forum", async function(req, res) {
  try {
    // Get news (or fallback to default news)
    const news = await getEsportsNews();
    
    // Render the forum page with news data
    res.render("forum", { esportsNews: news });
  } catch (error) {
    console.error("Error loading forum:", error);
    // If there's an error, pass an empty array
    res.render("forum", { esportsNews: [] });
  }
});