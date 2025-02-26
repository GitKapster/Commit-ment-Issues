CREATE DATABASE IF NOT EXISTS AimTrainer;  --have the if not statement incase someone else runs it and it tries creating the database twice
USE AimTrainer;  -- This selects which database to create all the tables in

CREATE TABLE Users (
  UserID int PRIMARY KEY,
  Username varchar(25),
  Password varchar(25)
);

CREATE TABLE Leaderboard (
  TaskID int,
  UserID int,
  Username varchar(25),
  Score int,
  FOREIGN KEY (UserID) REFERENCES Users(UserID)
);



