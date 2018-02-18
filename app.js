const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path')

var app = express();

nunjucks.configure('', {
    autoescape: true,
    express: app
});

//app.get('/.*\.md$/', function(req, res) {
app.get('/*.md', function(req, res) {
    // // req.route.path)
    // let rel_path = req.path;
    // let extension = path.extname(rel_path);
    // if (extension === '.md') {
    //
    // }
    res.render('index.html', {message: 'is md'});
});

// app.get('*', function(req, res) {
//     res.render('index.html', {message: req.path});
// });

app.use(express.static('writing'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));

