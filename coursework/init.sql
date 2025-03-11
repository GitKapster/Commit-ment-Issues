CREATE DATABASE IF NOT EXISTS AimTrainer;  -- have the if not statement incase someone else runs it and it tries creating the database twice
USE AimTrainer;  -- This selects which database to create all the tables in

-- User Accounts Info
CREATE TABLE IF NOT EXISTS Users ( 
  UserID int PRIMARY KEY AUTO_INCREMENT,
  Username varchar(25),
  Password varchar(25)
);

-- Tasks Info
CREATE TABLE IF NOT EXISTS Tasks (
  TaskID int,
  TaskType varchar(25),
  Difficulty int
);

-- Leaderboards Info
CREATE TABLE IF NOT EXISTS Leaderboard (
  LeaderboardID int,
  TaskID int,
  UserID int,
  Score int,
  FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Table for Forums
CREATE TABLE IF NOT EXISTS Forums (
  ForumID int,
  UserID int,
  Title varchar (25),
  Date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (ForumID),
  KEY UserID (UserID)
);

-- Table for Posts (inside of Forums)
CREATE TABLE IF NOT EXISTS Posts (
  ForumID int,
  PostID int,
  UserID int,
  Title varchar (25),
  Body text NOT NULL,
  PRIMARY KEY (PostID),
  KEY ForumID (ForumID),
  Key UserID (UserID)
);

--Tasks Page Data

-- Sample Scores for the Leaderboard

-- Task 1, UserID 2 (Kapi) - Score 999
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (323, 2, 999);

-- Task 1, UserID 3 (Erin) - Score 850
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (323, 3, 850);

-- Task 2, UserID 4 (Taran) - Score 900
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (324, 4, 900);

-- Task 2, UserID 5 (Oskar) - Score 975
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (324, 5, 975);

-- Task 1, UserID 4 (Taran) - Score 875
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (323, 4, 875);

-- Task 2, UserID 2 (Kapi) - Score 920
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (324, 2, 920);

-- Task 3, UserID 5 (Oskar) - Score 945
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (325, 5, 945);

-- Task 3, UserID 3 (Erin) - Score 800
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (325, 3, 800);



-- Temporary logins for everyone
INSERT INTO Users (Username, Password) 
VALUES ('Kapi', 'Password');

INSERT INTO Users (Username, Password) 
VALUES ('Erin', 'Password');

INSERT INTO Users (Username, Password) 
VALUES ('Taran', 'Password');

INSERT INTO Users (Username, Password) 
VALUES ('Oskar', 'Password');
