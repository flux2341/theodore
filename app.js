const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');
const marked = require('marked');

const writing_folder = 'writing';

var app = express();

nunjucks.configure('', {
    autoescape: true,
    express: app
});





// https://stackoverflow.com/questions/25460574/find-files-by-extension-html-under-a-folder-in-nodejs/25462405
function find_markdown_recurse(startPath, results) {

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            find_markdown_recurse(filename, results); //recurse
        }
        else if (filename.endsWith('.md')) {
            results.push(filename.substr(writing_folder.length + 1));
        }
    }
}

function find_markdown() {
    let results = [];
    find_markdown_recurse(writing_folder, results);
    return results;
}





function get_headings(markdown) {

    let heading_regex = /^#+(?!#)(.*)/gm;
    let match;
    let headings = []
    while ((match = heading_regex.exec(markdown)) !== null) {

        // count the leading number of hash-tags
        // todo: this will count all occurrences of #, "#Title #1" will be interpreted as h2
        let heading_level = match[0].match(/#/g).length;

        //console.log(heading_level + ' ' + match[0]);

        headings.push({
            heading_level: heading_level,
            text: match[1]
        });
    }

    return headings

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

        let file_list = find_markdown();
        console.log(file_list);


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

