// NodeJS modules
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '/src');
// Express modules
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Static files

app.use('/files/', express.static(path.join(__dirname, 'public')))

// Routing and Node Code
app.get('/', (req, res) => {
    res.sendFile(path.join(dir, '/index.html'));
})

app.listen(port, () => {
    console.log(`app is listening on ${port}`)
});