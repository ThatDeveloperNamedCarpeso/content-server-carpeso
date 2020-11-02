// NodeJS modules
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const dir = path.join(__dirname, '/src/');

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
const posts = require('./posts');

// Express middleware
app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use('/posts', posts); // user posts router for /post routes
app.use('/asset', express.static('assets'));

// Get Routes
app.get('/', function(req, res) {
    res.sendFile(path.join(dir, 'login.html'));
});


// Post Routes
app.post('/login', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM users WHERE name='${req.body.username}' AND password='${req.body.password}'`);
        if(result.rowCount > 0) {
            res.status(200).send({status: 'OK'});
        } else {
            res.status(202).send({status: 'NO'});
        }
        client.release();
    } catch (err) {
        console.error(err);
        res.status(401).send({status: 'DENY'});
    }
});

app.post('/register', async (req, res) => {
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