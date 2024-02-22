// authService.js
require('dotenv').config(); // Menggunakan dotenv untuk mengambil variabel lingkungan dari file .env
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // Port yang digunakan

const secretKey = process.env.SECRET_KEY;
const kid = process.env.KID;

const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Objek untuk menyimpan informasi pengguna
// const users = {
//   'alpha': 'alpha',
//   'beta': 'beta',
//   'clara': 'clara',
//   'delta': 'delta',
//   'eclair': 'eclair'
// };

// app.use(bodyParser.json());

// // Fungsi untuk memverifikasi kredensial
// const verifyCredentials = (username, password) => {
//   const storedPassword = users[username];

//   // Periksa apakah kata sandi cocok
//   return storedPassword && storedPassword === password;
// };

app.use(bodyParser.json());

// Function to verify credentials in the database
const verifyCredentialsInDatabase = async (username, password) => {
  try {
    const result = await pool.query('SELECT * FROM "user" WHERE username = $1 AND password = $2', [username, password]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error validating credentials:', error);
    return false;
  }
};

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Verify credentials using the function that checks the database
  if (await verifyCredentialsInDatabase(username, password)) {
    // Set token expiration time to 15 minutes (900 seconds)
    const token = jwt.sign({ username }, secretKey, { keyid: kid, expiresIn: '5m' });
    res.json({ token });
  } else {
    console.error('Invalid credentials:', username, password);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.listen(port, () => {
  console.log(`AuthService is running on port ${port}`);
});