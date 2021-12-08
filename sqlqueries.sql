-- create table
CREATE TABLE pastebin (
  id SERIAL PRIMARY KEY,
  input TEXT NOT NULL,
  title VARCHAR(50),
  creation_date TIMESTAMP DEFAULT NOW()
);

-- create first row
INSERT INTO pastebin VALUES (1,'test pastebin','first title')

