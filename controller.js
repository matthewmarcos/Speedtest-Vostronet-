var path = require('path');
var fs = require('fs');

exports.sendFile = function sendFile(message, response, filename) {
    // index.html default
    var relativeFilePath = path.posix.basename(filename) || 'index.html';

    response.writeHead(200, {
        'Content-Type': 'text/html'
    });

    fs.readFile(relativeFilePath, function(err, contents) {
        response.write(contents);
        response.end();
    });
}

exports.testSpeed = function testSpeed(message, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });

    response.write(message.url);
    response.end();
}
