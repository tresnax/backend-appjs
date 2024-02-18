CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255),
  placeOfBirth VARCHAR(255),
  dateOfBirth DATE,
  address TEXT
);

-- Insert data
INSERT INTO "user" (username, password, fullName, placeOfBirth, dateOfBirth, address)
VALUES
  ('alpha', 'alpha', 'Alpha Alpha', 'Bandung', '1990-01-01', 'Bandung'),
  ('beta', 'beta', 'Beta Beta', 'Bandung', '1990-01-01', 'Bandung'),
  ('clara', 'clara', 'Clara Clara', 'Bandung', '1990-01-01', 'Bandung'),
  ('delta', 'delta', 'Delta Delta', 'Bandung', '1990-01-01', 'Bandung'),
  ('eclair', 'eclair', 'Eclair Eclair', 'Bandung', '1990-01-01', 'Bandung');


-- Create courses table
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  author VARCHAR(255),
  price INT
);

-- Insert data into courses table
INSERT INTO courses (title, description, author, price) VALUES
  ('Fullstack', 'Kursus Fullstack Development', 'Author1', 15000000),
  ('DevOps', 'Kursus DevOps Practices', 'Author2', 15000000),
  ('Big Data', 'Kursus Big Data Technologies', 'Author3', 15000000),
  ('Hacker', 'Kursus Ethical Hacking', 'Author4', 15000000),
  ('QA', 'Kursus Quality Assurance', 'Author5', 15000000);


-- Create purchases table
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  courseId INT NOT NULL,
  status VARCHAR(255) NOT NULL,
  FOREIGN KEY (courseId) REFERENCES courses(id)
);

-- Insert data into purchases table
INSERT INTO purchases (username, courseId, status) VALUES
  ('alpha', 2, 'Purchased'),
  ('delta', 2, 'Purchased'),
  ('clara', 2, 'Purchased'),
  ('beta', 4, 'Purchased');
