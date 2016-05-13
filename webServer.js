var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var app = express();

const hostname = '127.0.0.1';
const port = 80;

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/contactList.html', function (request, response) {
    fs.writeFile('./public/json/contactList.json', JSON.stringify(request.body), function (err) {
        if (!err) {
            response.send('success');
        }
    });
});

app.listen(80, function () {
    console.log(`Server running at http://${hostname}:${port}/`);
});