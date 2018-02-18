const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');
const marked = require('marked');

const writing_folder = './writing';

var app = express();

nunjucks.configure('', {
    autoescape: true,
    express: app
});




function get_headings(markdown) {

    let heading_regex = /^#+(?!#)(.*)/gm;
    let match;
    let matches = []
    while ((match = heading_regex.exec(markdown)) !== null) {

        // count the leading number of hash-tags
        // todo: this will count all occurrences of #, "#Title #1" will be interpreted as h2
        let heading_level = match[0].match(/#/g).length;

        console.log(heading_level + ' ' + match[0]);

        matches.push({
            heading_level: heading_level,
            text: match[1]
        });
    }

    return matches

}




//app.get('/.*\.md$/', function(req, res) {
app.get('/*.md', function(req, res) {
    // // req.route.path)
    // let rel_path = req.path;
    // let extension = path.extname(rel_path);
    // if (extension === '.md') {
    //
    // }
    let result = '';
    try {
        let markdown = fs.readFileSync(writing_folder+req.path, 'utf8');
        get_headings(markdown);
        result = marked(markdown);
        result = new nunjucks.runtime.SafeString(result);
    } catch(e) {
        console.log('error:', e.stack);
        result = e.stack.toString();
    }
    res.render('index.html', {message: result});
});

// app.get('*', function(req, res) {
//     res.render('index.html', {message: req.path});
// });

app.use(express.static('writing'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));

