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

-- Temporary logins for everyone (Insert users first)
INSERT INTO Users (Username, Password) 
VALUES ('Kapi', 'Password');

INSERT INTO Users (Username, Password) 
VALUES ('Erin', 'Password');

INSERT INTO Users (Username, Password) 
VALUES ('Taran', 'Password');

INSERT INTO Users (Username, Password) 
VALUES ('Oskar', 'Password');

-- Now insert the scores (Leaderboard entries)
-- Task 1, UserID 1 (Kapi) - Score 999
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (1, 1, 999);

-- Task 1, UserID 2 (Erin) - Score 850
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (1, 2, 850);

-- Task 2, UserID 3 (Taran) - Score 900
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (2, 3, 900);

-- Task 2, UserID 4 (Oskar) - Score 975
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (2, 4, 975);

-- Task 1, UserID 3 (Taran) - Score 875
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (1, 3, 875);

-- Task 2, UserID 1 (Kapi) - Score 920
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (2, 1, 920);

-- Task 3, UserID 4 (Oskar) - Score 945
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (3, 4, 945);

-- Task 3, UserID 2 (Erin) - Score 800
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (3, 2, 800);

