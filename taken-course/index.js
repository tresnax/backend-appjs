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

// Mendapatkan semua pembelian kursus berdasarkan username
app.get('/purchases/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pool.query('SELECT * FROM purchases WHERE username = $1', [username]);
    const userPurchases = result.rows;
    res.json(userPurchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Menambah pembelian kursus baru
app.post('/purchases', async (req, res) => {
  const { username, courseId } = req.body;

  try {
    // Check if the course exists
    const courseResult = await pool.query('SELECT * FROM courses WHERE id = $1', [courseId]);
    const course = courseResult.rows[0];

    if (!course) {
      return res.status(400).json({ message: 'Kursus tidak ditemukan' });
    }

    // Insert purchase into the purchases table
    const purchaseResult = await pool.query('INSERT INTO purchases (username, courseId, status) VALUES ($1, $2, $3) RETURNING *', [username, courseId, 'Purchased']);
    const newPurchase = purchaseResult.rows[0];

    res.status(201).json(newPurchase);
  } catch (error) {
    console.error('Error adding purchase:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Menghapus pembelian kursus berdasarkan ID dan username
app.delete('/purchases/:id', async (req, res) => {
  const { username } = req.body;
  const purchaseId = parseInt(req.params.id);

  try {
    // Delete purchase from the purchases table based on username and purchase ID
    const result = await pool.query('DELETE FROM purchases WHERE id = $1 AND username = $2 RETURNING *', [purchaseId, username]);
    const deletedPurchase = result.rows[0];

    if (deletedPurchase) {
      res.json({ message: 'Pembelian kursus dihapus' });
    } else {
      res.status(404).json({ message: 'Pembelian kursus tidak ditemukan' });
    }
  } catch (error) {
    console.error('Error deleting purchase:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
