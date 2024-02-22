// rsv.js
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

// Function to verify credentials in the database
const verifyCredentialsInDatabase = async (username) => {
  try {
    const result = await pool.query('SELECT * FROM "user" WHERE username = $1', [username]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Error validating credentials:', error);
    return false;
  }
};

const verifyTokenAPI = async (tokenapi) => {
    try {
        const result = await pool.query('SELECT * FROM "reservasion" WHERE tokenapi = $1', [tokenapi]);
        return result.rows.length > 0;
    } catch (error) {
        console.error('Error validation API:', error);
        return false;
    }
};

function makeRandom(length) {
    const charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    if ( !length ) {
         length = 10;
    }
    let result = ''; 
    for (let i = 0; i < length; i++) {
         result += charList.charAt( Math.floor( Math.random() * charList.length ) );
    }
    return result;
}

const TokenAPI = makeRandom();

app.post('/reserv', async (req, res) => {
  const { username, resdate, resexp } = req.body;
  
  function Hitungreserv ( resdate, resexp ) {
    const msPerDay = 24 * 60 * 60 * 1000; // Jumlah milidetik per hari
    const awal = new Date (resdate);
    const akhir = new Date (resexp);

    const selisihHari = Math.round ((akhir-awal)/msPerDay);
    return selisihHari;
  }
  
  const LamaReserv = Hitungreserv(resdate, resexp);
  const expiresInSeconds = LamaReserv+'d';
  console.log(expiresInSeconds);

  // Verify credentials using the function that checks the database
  if (await verifyCredentialsInDatabase(username)) {

    try {
        const reservResult = await pool.query('INSERT INTO reservasion (username, tokenapi, resdate, resexp) VALUES ($1, $2, $3, $4) RETURNING *', [username, TokenAPI, resdate, resexp]);
        const newReserv = reservResult.rows[0];

        res.status(201).json({ newReserv, TokenAPI });

    } catch (error) {
        console.error('Error add new reservasion API', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }

  } else {
    console.error('Invalid credentials:', username);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/detail/:tokenapi', async (req, res) => {
    const { tokenapi } = req.params;

    if (await verifyTokenAPI(tokenapi)) {
        try {
            const result = await pool.query('SELECT * FROM reservasion WHERE tokenapi = $1', [tokenapi]);
            const userReserv = result.rows;
            res.json(userReserv);
        } catch (error) {
            console.error('Error fetching reservasion:', error);
            res.status(500).json({ error: 'Internal Server Error'});
        }
    } else {
        console.error('Invalid credentials:', tokenapi);
        res.status(401).json({ error: 'Invalid credentials' });
    }

});

app.listen(port, () => {
  console.log(`AuthService is running on port ${port}`);
});