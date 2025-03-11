CREATE DATABASE IF NOT EXISTS AimTrainer;  -- have the if not statement incase someone else runs it and it tries creating the database twice
USE AimTrainer;  -- This selects which database to create all the tables in

-- User Accounts Info
CREATE TABLE IF NOT EXISTS Users ( 
  UserID int PRIMARY KEY AUTO_INCREMENT,
  Username varchar(25),
  Password varchar(25)
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

--Leaderboard Page
INSERT INTO Leaderboard (TaskID, UserID, Score)
Values ('323', '2', '999');



-- Temporary logins for everyone
INSERT INTO Users (Username, Password) 
VALUES ('Kapi', 'Password');

INSERT INTO Users (Username, Password) 
VALUES ('Erin', 'Password');

INSERT INTO Users (Username, Password) 
VALUES ('Taran', 'Password');

INSERT INTO Users (Username, Password) 
VALUES ('Oskar', 'Password');
