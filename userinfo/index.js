// userInfoService.js
require('dotenv').config(); // Menggunakan dotenv untuk mengambil variabel lingkungan dari file .env
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000; // Port yang digunakan

const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(bodyParser.json());

app.get('/user-info/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pool.query('SELECT * FROM "user" WHERE username = $1', [username]);
    const userInfo = result.rows[0];

    if (userInfo) {
      console.log(`User info found for username: ${username}`);
      res.json(userInfo);
    } else {
      console.log(`User not found for username: ${username}`);
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/user-info/:username', async (req, res) => {
  const { username } = req.params;
  const { fullName, placeOfBirth, dateOfBirth, address } = req.body;

  try {
    const result = await pool.query('UPDATE "user" SET fullname = $1, place_of_birth = $2, date_of_birth = $3, address = $4 WHERE username = $5 RETURNING *', [fullName, placeOfBirth, dateOfBirth, address, username]);
    const updatedUserInfo = result.rows[0];

    if (updatedUserInfo) {
      console.log(`User info updated for username: ${username}`);
      res.json(updatedUserInfo);
    } else {
      console.log(`User not found for username: ${username}`);
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user info:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(port, () => {
  console.log(`User-info is running on port ${port}`);
});