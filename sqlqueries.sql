-- create table
CREATE TABLE pastebin (
  id SERIAL PRIMARY KEY,
  input VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  creation_date DATE DEFAULT NOW()
);

-- create first row
INSERT INTO pastebin VALUES (1,'test pastebin','first title')
