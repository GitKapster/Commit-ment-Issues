CREATE DATABASE AimTrainer;

CREATE TABLE Users (
  UserID int,
  Username varchar(25),
  Password varchar(25)
);


CREATE TABLE Leaderboard (
  TaskID int,
  UserID int,
  Username varchar(25),
  Score int
);



