const fs = require('fs');
const path = require('path');
const express = require('express');

var router = express.Router();
var directory = path.join(__dirname, '/posts');

router.get('/', function(req, res) {
    let posts = [];
    let files = fs.readdirSync(directory + '/', 'utf-8');
    files.forEach(file => {
        posts.push({
            file: req.path,
            data: fs.readFileSync(`${directory}/${file}`, 'utf-8').toString()
        });
    });
    res.send(posts);
});

router.get(/\/([^\s]+)/, function(req, res) {
    try {
        let data = fs.readFileSync(`${directory}${req.path}.htm`, 'utf-8');
        res.send(data.toString());
    } catch (error) {
        console.log(error);
        res.send("<h1>No post found!</h1>");
    }
});

module.exports = router;