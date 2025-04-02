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

app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Make user session available to all templates
  next();
});

// home page / root page
app.get("/", async function (req, res) {
  try {
    // SQL Query to get the top 5 scores for TaskID = 10
    const query = `
      SELECT Users.Username, Leaderboard.Score
      FROM Leaderboard
      JOIN Users ON Leaderboard.UserID = Users.UserID
      WHERE Leaderboard.TaskID = 10
      ORDER BY Leaderboard.Score DESC
      LIMIT 5;
    `;

    // Execute SQL query
    const result = await db.query(query);
    const topScores = Array.isArray(result[0]) ? result[0] : result; // Ensure it's an array

    // Debugging: Log the actual returned data
    console.log("Leaderboard Data:", topScores);

    // Pass data to the template
    res.render("home", { topScores });
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).send("Error retrieving leaderboard data.");
  }
});

// account page
app.get("/account/:id", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login"); // redirect if not logged in
  }

  const userID = Number(req.session.user.UserID); // Convert to number
  const requestedID = Number(req.params.id); // Convert to number

  // User can only open their own account page
  if (requestedID !== userID) {
    return res.status(403).send("Denied: You can only access your own account.");
  }

  try {
    // Query the database for the Aim task data
    const aimQuery = 'SELECT * FROM Leaderboard WHERE UserID = ? AND TaskID = 1';
    const memoryQuery = 'SELECT * FROM Leaderboard WHERE UserID = ? AND TaskID = 2';
    const reactionQuery = 'SELECT * FROM Leaderboard WHERE UserID = ? AND TaskID = 3';
    
    // Execute the queries using `await` and `mysql2`'s query method
    const aimData = await db.query(aimQuery, [userID]);
    const memoryData = await db.query(memoryQuery, [userID]);
    const reactionData = await db.query(reactionQuery, [userID]);

    // Log the data to see if it's being fetched properly
    console.log("Aim Data:", aimData); 
    console.log("Memory Data:", memoryData); 
    console.log("Reaction Data:", reactionData); 

    // Render the account page with the queried data
    res.render('account', {
      username: req.session.user.Username, 
      userID: userID,
      aimData: aimData[0] || [], 
      memoryData: memoryData[0] || [], 
      reactionData: reactionData[0] || [],
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Redirect /account to /account/userID
app.get("/account", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const userID = Number(req.session.user.UserID);
  res.redirect(`/account/${userID}`);
});

// login page
app.get("/login", (req, res) => {
  res.render("login"); // Render the login.pug template
});

// Games page
app.get("/Games", (req, res) => {
  res.render("Games"); // Render the games.pug template
});

app.get("/register", (req, res) => {
  res.render("register");
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
  console.log(`Received login attempt - Username: ${username}`); // removed password from logs for security

  try {
    const result = await db.query("SELECT * FROM Users WHERE Username = ?", [username]); // matching given username to db username
    const rows = Array.isArray(result) ? result : [result]; // make sure its an array
    
    // check if user is not found in database
    if (rows.length === 0) {
      console.log("User not found in database.");
      return res.send("Invalid username or password");
    }

    // user = first user found from query
    const user = rows[0];
    console.log(`Found user with ID: ${user.UserID}`); // Don't log full user object with password

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.Password);
    
    if (passwordMatch) {
      req.session.user = {
        UserID: user.UserID,
        Username: user.Username
        // Don't include password in session
      }; 
      console.log("Login successful, redirecting..."); 
      return res.redirect(`/account/${user.UserID}`); 
    }

    console.log("Password incorrect.");
    res.send("Invalid username or password");

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("Server error");
  }
});

app.post("/register", async (req, res) => {
  const { username, password, re_password } = req.body;

  // Check if passwords match
  if (password !== re_password) {
    return res.send("Error: Passwords do not match");
  }

  try {
    // Check if user already exists
    const existingUser = await db.query("SELECT * FROM Users WHERE Username = ?", [username]);

    // Check if the result has any rows
    if (existingUser && existingUser.length > 0) {
      return res.send("Error: Account Already Exists");
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into the database
    // Note: We're not manually providing a UserID as it's likely auto-incremented in the database
    const insertResult = await db.query(
      "INSERT INTO Users (Username, Password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    // Check if insert was successful
    if (insertResult && insertResult.affectedRows > 0) {
      // Redirect to login page after successful registration
      res.redirect("/login?registered=true");
    } else {
      res.status(500).send("Failed to create account");
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send("Server error");
  }
});

//logout route
app.get("/logout", (req,res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error logging out");
    }
    res.redirect("/login"); // Redirect user to login page
  });
});

// Forum main page
app.get("/forum", async function(req, res) {
  try {
    // Get news (or fallback to default news)
    const news = await getEsportsNews();
    
    // Add sample topics - in a real app, you would fetch these from the database
    const topics = [
      {
        id: 1,
        title: "Is Amin Team 1 Material?",
        author: "Admin",
        date: "Feb 25, 2025",
        replies: 2,
        content: "Amin has shown great progress in recent games. His aim accuracy has improved by 25% and his reaction time is consistently under 200ms."
      },
      {
        id: 2,
        title: "How to stop shaking when i aim?",
        author: "Kasper",
        date: "Feb 26, 2025",
        replies: 1,
        content: "I noticed my hands shake when I'm trying to make precise shots. Any tips to improve stability during aim training?"
      },
      {
        id: 3,
        title: "Is Nova227 the rookie of the year 2025?",
        author: "RoehamptonEsports",
        date: "Feb 26, 2025",
        replies: 1,
        content: "Nova227 has dominated the scene with record-breaking performance in aim challenges. His stats show a 15% lead over the next best rookie."
      },
      {
        id: 4,
        title: "How do i improve my reaction speed?",
        author: "Virtus.Roe",
        date: "Feb 26, 2025",
        replies: 1,
        content: "My reaction time is currently around 300ms but I need to get it below 250ms to compete at a higher level. What are the best training methods?"
      }
    ];
    
    // Render the forum page with news data AND topics
    res.render("forum", { 
      esportsNews: news,
      topics: topics
    });
  } catch (error) {
    console.error("Error loading forum:", error);
    // If there's an error, pass empty arrays
    res.render("forum", { 
      esportsNews: [],
      topics: [] 
    });
  }
});

// Forum topic view - shows a single topic with all replies
app.get("/forum/topic/:id", async function(req, res) {
  try {
    const topicId = req.params.id;
    const replyAdded = req.query.reply === 'added';
    
    // In a real app, you'd fetch the topic and its replies from the database
    // For now, we'll use sample data
    const sampleTopics = {
      "1": {
        id: 1,
        title: "Is Amin Team 1 Material?",
        author: "Admin",
        date: "Feb 25, 2025",
        content: "Amin has shown great progress in recent games. His aim accuracy has improved by 25% and his reaction time is consistently under 200ms.",
        replies: [
          { author: "Coach", date: "Feb 25, 2025", content: "I've been monitoring his progress. His decision-making has also improved significantly." },
          { author: "TeamCaptain", date: "Feb 26, 2025", content: "We need to see how he performs under pressure in the next tournament." }
        ]
      },
      "2": {
        id: 2,
        title: "How to stop shaking when i aim?",
        author: "Kasper",
        date: "Feb 26, 2025",
        content: "I noticed my hands shake when I'm trying to make precise shots. Any tips to improve stability during aim training?",
        replies: [
          { author: "AimTrainer", date: "Feb 26, 2025", content: "Try lowering your sensitivity and make sure you're in a comfortable position. Also, regular breaks help reduce tension." }
        ]
      },
      "3": {
        id: 3,
        title: "Is Nova227 the rookie of the year 2025?",
        author: "RoehamptonEsports",
        date: "Feb 26, 2025",
        content: "Nova227 has dominated the scene with record-breaking performance in aim challenges. His stats show a 15% lead over the next best rookie.",
        replies: [
          { author: "Analyst", date: "Feb 27, 2025", content: "His consistency is what sets him apart. Most rookies have high variance in their performance." }
        ]
      },
      "4": {
        id: 4,
        title: "How do i improve my reaction speed?",
        author: "Virtus.Roe",
        date: "Feb 26, 2025",
        content: "My reaction time is currently around 300ms but I need to get it below 250ms to compete at a higher level. What are the best training methods?",
        replies: [
          { author: "ProPlayer", date: "Feb 27, 2025", content: "Use our reaction test tool daily. Start with easy mode and gradually move to harder difficulties. Also, make sure you get enough sleep!" }
        ]
      }
    };
    
    // If a reply was just added, let's add it to the sample data
    if (replyAdded && req.session.user && req.session.lastReply) {
      const topic = sampleTopics[topicId];
      
      if (topic) {
        // Add the actual reply from the current user
        const newReply = {
          author: req.session.user.Username,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          content: req.session.lastReply // Use the actual content from the form
        };
        
        // Add the new reply to the end of the replies array
        topic.replies.push(newReply);
        
        // Clear the stored reply from the session
        delete req.session.lastReply;
      }
    }
    
    const topic = sampleTopics[topicId];
    
    if (!topic) {
      return res.status(404).send("Topic not found");
    }
    
    // Pass the user session to the template
    res.render("topic", { 
      topic: topic,
      user: req.session.user || null
    });
  } catch (error) {
    console.error("Error loading topic:", error);
    res.status(500).send("Error loading topic");
  }
});

// Route for creating a new topic
app.get("/forum/new-topic", (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect("/login?redirect=forum/new-topic");
  }
  
  res.render("new-topic");
});

// Process new topic submission
app.post("/forum/new-topic", (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.status(401).send("You must be logged in to create a topic");
  }
  
  const { title, content, category } = req.body;
  
  // In a real app, you would save this to the database
  // For now, just redirect back to the forum
  res.redirect("/forum");
});

// Process reply submission
app.post("/forum/topic/:id/reply", (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.status(401).send("You must be logged in to reply");
  }
  
  const topicId = req.params.id;
  const { content } = req.body;
  
  // Store the reply content in the session so we can access it after redirect
  req.session.lastReply = content;
  
  // In a real app, you would save this to the database
  // For now, just redirect back to the topic with a query parameter
  res.redirect(`/forum/topic/${topicId}?reply=added`);
  
  /* 
  // In a real implementation with a database, you would do something like this:
  
  try {
    // Get the current user information
    const userId = req.session.user.UserID;
    const username = req.session.user.Username;
    
    // Create a timestamp for the reply
    const timestamp = new Date();
    
    // Insert the reply into the database
    await db.query(
      "INSERT INTO TopicReplies (topic_id, user_id, content, created_at) VALUES (?, ?, ?, ?)",
      [topicId, userId, content, timestamp]
    );
    
    // Redirect back to the topic page to see the new reply
    res.redirect(`/forum/topic/${topicId}`);
  } catch (error) {
    console.error("Error posting reply:", error);
    res.status(500).send("Error posting reply");
  }
  */
});

// Leaderboard Route - Fetch Data from MySQL
app.get("/leaderboard", async (req, res) => {
  try {
    const query = `
      SELECT Leaderboard.Score, Users.Username, Tasks.TaskType
      FROM Leaderboard
      JOIN Users ON Leaderboard.UserID = Users.UserID
      JOIN Tasks ON Leaderboard.TaskID = Tasks.TaskID
      ORDER BY Leaderboard.Score DESC
    `;

    const players = await db.query(query);
    
    res.render("leaderboard", { players });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).send("Error loading leaderboard");
  }
});

// Tasks Route - Detching data from the SQL
app.get("/tasks", (req, res) => {
  res.render("tasks"); // Render the tasks.pug template
});

// Reaction Test Route for Easy Mode
app.get("/reaction-test/easy", (req, res) => {
  res.render("reaction-test", { difficulty: "easy" });
});

// Reaction Test Route for Medium Mode
app.get("/reaction-test/medium", (req, res) => {
  res.render("reaction-test", { difficulty: "medium" });
});

// Reaction Test Route for Hard Mode
app.get("/reaction-test/hard", (req, res) => {
  res.render("reaction-test", { difficulty: "hard" });
});

// Add this route
app.get('/memory-test/:difficulty', (req, res) => {
  const difficulty = req.params.difficulty;
  if (!['easy', 'medium', 'hard'].includes(difficulty)) {
    return res.redirect('/tasks');
  }
  res.render('memory-test', { difficulty });
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