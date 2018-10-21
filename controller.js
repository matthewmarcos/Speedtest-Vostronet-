var path = require('path');
var fs = require('fs');
totalBytesData = {}; 

var PAYLOAD_SIZE = 25000000;  // 25e6?


exports.sendFile = function sendFile(message, response, filename) {
    // index.html default
    var relativeFilePath = path.posix.basename(filename) || 'index.html';
    // Find files in in static folder
    relativeFilePath = path.join('static', relativeFilePath);

    fs.readFile(relativeFilePath, function(err, contents) {
        if(err || !contents) {
            return notFound(message, response);
        }

        response.writeHead(200, {
            'Content-Type': 'text/html'
        });
        response.write(contents);
        response.end();
    });
}


exports.testDownloadSpeed = function testDownloadSpeed(message, response) {
    var payload = Buffer.alloc(PAYLOAD_SIZE, 65);
    response.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': payload.length
    });
    response.write(payload);
    response.end();

}


exports.testUploadSpeed = function testUploadSpeed(message, response) {
    var headers = message.headers;
    var testToken = headers['test-token'] || null;
    var payload = {};

    if(!testToken) {
        // The client does not send a test token (which we use to uniquely identify them)
        response.writeHead(403);
        response.end();
        return;
    }

    totalBytesData[testToken] = totalBytesData[testToken] || 0;

    message.on('readable', function() {
        var body = String(message.read());
        console.log(body.length)
        totalBytesData[testToken] += body.length;
    });

    message.on('end', function() {
        response.writeHead(200);
        response.end();
    });

}; 


exports.uploadSpeedResults = function uploadSpeedResults(message, response) {
    var headers = message.headers;
    var testToken = headers['test-token'] || null;
    var payload = {};

    if(!testToken) {
        // The client does not send a test token (which we use to uniquely identify them)
        response.writeHead(403);
        response.end();
        return;
    }

    response.writeHead(200, {
        'Content-Type': 'application/json'
    });
    response.write(String(totalBytesData[testToken]));
    response.end();
}


function notFound(message, response) {
    response.writeHead(404);
    response.write('404 not found');
    response.end();
}


exports.notFound = notFound;

