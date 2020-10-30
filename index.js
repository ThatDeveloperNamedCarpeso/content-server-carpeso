// NodeJS modules
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '/src');

// FOR HEROKU! Heroku Postgres
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Express modules
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Routes
app.get('/users', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM users');
        const results = { 'results': (result) ? result.rows : null};
        res.send(results);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
});

app.post('/users', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`INSERT INTO users (name, email, password) VALUES ('${req.body.username}', '${req.body.email}', '${req.body.password}')`);
        const results = { 'results': (result) ? result.rows : null};
        res.send(results);
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
})

// Listen to app
app.listen(port, () => {
    console.log(`app is listening on ${port}`)
});