// NodeJS modules
// const fs = require('fs');
const path = require('path');
const cors = require('cors');
const dir = path.join(__dirname, '/src/');

// FOR HEROKU! Heroku Postgres
const { Pool } = require('pg');

// Heroku Postgres configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Express Sessioning
const session = require('express-session') ;

// ExpressJS node module
const express = require('express');

// Create an Express App
const app = express();

// Important Constant Variables
const port = process.env.PORT || 5000;

// Custom routes
const posts = require('./posts');

// Cors, for cross origin requests
app.use(cors());

// Create sessioning
app.use(session({ 
    // It holds the secret key for session 
    secret: 'admin-carpeso', 
  
    // Forces the session to be saved 
    // back to the session store 
    resave: true, 
  
    // Forces a session that is "uninitialized" 
    // to be saved to the store 
    saveUninitialized: true
}));

// for parsing application/json
app.use(express.json());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// user posts router for /post routes
app.use('/posts', posts);

// Serve Static files via /asset route
app.use('/asset', express.static('assets'));

// Get Routes
app.get('/', function(req, res) {
    if(req.session.user_data) {
        res.sendFile(path.join(dir, 'admin.html'));
    } else {
        res.redirect('/admin');
    }
});
app.get('/admin', function(req, res) {
    if(req.session.user_data) {
        res.sendFile(path.join(dir, 'admin.html'));
    } else {
        res.sendFile(path.join(dir, 'login.html'));
    }
});

// Post Routes
app.post('/login', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM users WHERE name='${req.body.username}' AND password='${req.body.password}'`);
        if(result.rowCount > 0) {
            req.session.user_data = {
                data: result
            }
            res.redirect(307, '/');
        } else {
            res.redirect(202, '/');
        }
        client.release();
    } catch (err) {
        console.error(err);
        res.redirect(401, '/');
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
});
app.post('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect(307, '/');
})

// Listen to app
app.listen(port, () => {
    console.log(`app is listening on ${port}`)
});