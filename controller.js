var path = require('path');
var fs = require('fs');

var PAYLOAD_SIZE = 25000000;  // 25e?
var TEST_TIMEOUT = 20;  //Stream the buffers for only 20 seconds.


exports.sendFile = function sendFile(message, response, filename) {
    // index.html default
    var relativeFilePath = path.posix.basename(filename) || 'index.html';

    fs.readFile(relativeFilePath, function(err, contents) {
        if(err || !contents) {
            console.log('Not found')
            return notFound(message, response);
        }

        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.write(contents);
        response.end();
    });
}


exports.testSpeed = function testSpeed(message, response) {
    var payload = Buffer.alloc(PAYLOAD_SIZE, 65);
    response.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': payload.length
    });
    response.write(payload);
    response.end();

}


function notFound(message, response) {
    response.writeHead(404);
    response.write('404 not found');
    response.end();
}

exports.notFound = notFound
