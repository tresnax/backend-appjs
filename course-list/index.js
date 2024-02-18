require('dotenv').config(); // Menggunakan dotenv untuk mengambil variabel lingkungan dari file .env
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(bodyParser.json());


// Mendapatkan semua kursus dari database
app.get('/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses');
    const courses = result.rows;
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Mendapatkan kursus berdasarkan ID dari database
app.get('/courses/:id', async (req, res) => {
  const courseId = parseInt(req.params.id);

  try {
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [courseId]);
    const course = result.rows[0];

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Kursus tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Menambahkan kursus baru ke database
app.post('/courses', async (req, res) => {
  const { title, description, author } = req.body;

  try {
    const result = await pool.query('INSERT INTO courses (title, description, author, price) VALUES ($1, $2, $3, $4) RETURNING *', [title, description, author, 15000000]);
    const newCourse = result.rows[0];
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Mengubah informasi kursus berdasarkan ID di database
app.put('/courses/:id', async (req, res) => {
  const courseId = parseInt(req.params.id);
  const { title, description, price, author } = req.body;

  try {
    const result = await pool.query('UPDATE courses SET title = $1, description = $2, author = $3, price = $4 WHERE id = $5 RETURNING *', [title, description, author, price || 15000000, courseId]);
    const updatedCourse = result.rows[0];

    if (updatedCourse) {
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Kursus tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
