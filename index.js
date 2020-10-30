// NodeJS modules
const fs = require('fs');
const path = require('path');

// Express modules
const express = require('express');
const app = express();
const port = 3000;

// Static files

app.use('/files/', express.static(path.join(__dirname, 'public')))

// Routing and Node Code
app.get('/', (req, res) => {
    fs.readFile('src/index.html', 'utf8',(err, data) => {
        res.send(data);
    });
})

app.listen(port, () => {
    console.log(`app is listening on ${port}`)
});