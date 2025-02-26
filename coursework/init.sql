CREATE DATABASE IF NOT EXISTS AimTrainer;  -- have the if not statement incase someone else runs it and it tries creating the database twice
USE AimTrainer;  -- This selects which database to create all the tables in

-- User Accounts Info
CREATE TABLE IF NOT EXISTS Users ( 
  UserID int PRIMARY KEY,
  Username varchar(25),
  Password varchar(25)
);

-- Leaderboards Info
CREATE TABLE IF NOT EXISTS Leaderboard (
  TaskID int,
  UserID int,
  Username varchar(25),
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



