CREATE DATABASE IF NOT EXISTS AimTrainer;  -- have the if not statement incase someone else runs it and it tries creating the database twice
USE AimTrainer;  -- This selects which database to create all the tables in

-- User Accounts Info
CREATE TABLE IF NOT EXISTS Users ( 
  UserID int PRIMARY KEY AUTO_INCREMENT,
  Username varchar(25),
  Password varchar(255)
);

-- Tasks Info
CREATE TABLE IF NOT EXISTS Tasks (
  TaskID int PRIMARY KEY AUTO_INCREMENT,
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

INSERT INTO Users (UserID, Username, Password)
VALUES (1, 'Erin', '$2b$10$yH01cJkD6KchtY0YgOXBb.NJoKXEF46BSn.4QsEvFh4JFyRVQrgk6');

INSERT INTO Users (UserID, Username, Password)
VALUES (2, 'Kapi', '$2b$10$4oAhkdnYRJqxbZYUt.dfN.hDL0XZk3D9z9wyjISG5NJDKQEFAzkmO');

INSERT INTO Users (UserID, Username, Password)
VALUES (3, 'Taran', '$2b$10$6e1HQIAUyYVHZkVdmkyGeOXIr.5gZPAQcSH8LWh8AGWHwzPq6RP22');

INSERT INTO Users (UserID, Username, Password)
VALUES (4, 'Oskar', '$2b$10$QupFA2CvnryD7rplTNYXUuIIwtLBlfLOrWzEEkQjdmFMVPnocH0CO');


-- Leaderboard Sample Data

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

-- sample info for home page -- 
INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (7, 1, 800);

INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (7, 2, 820);

INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (7, 3, 900);

INSERT INTO Leaderboard (TaskID, UserID, Score)
VALUES (7, 4, 850);

-- Sample Tasks for Task Table

-- Difficulty 1
INSERT INTO Tasks (TaskType, Difficulty)
VALUES ('Aim', 1);

INSERT INTO Tasks (TaskType, Difficulty)
VALUES ('Reaction', 1);

INSERT INTO Tasks (TaskType, Difficulty)
VALUES ('Memory', 1);

-- Difficulty 2
INSERT INTO Tasks (TaskType, Difficulty)
VALUES ('Aim', 2);

INSERT INTO Tasks (TaskType, Difficulty)
VALUES ('Reaction', 2);

INSERT INTO Tasks (TaskType, Difficulty)
VALUES ('Memory', 2);

-- Difficulty 3
INSERT INTO Tasks (TaskType, Difficulty)
VALUES ('Aim', 3);

INSERT INTO Tasks (TaskType, Difficulty)
VALUES ('Reaction', 3);

INSERT INTO Tasks (TaskType, Difficulty)
VALUES ('Memory', 3);
