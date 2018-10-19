var http = require('http');
var url = require('url');

var controller = require('./controller')

var PORT = 3000;


http.createServer(function(message, response) {
    var reqUrl = message.url;

    // Hacky router to handle different urls
    if(message.method === 'GET') {
        switch(reqUrl) {
            case '/test': {
                return controller.testSpeed(message, response);
            }
            default: {
                return controller.sendFile(message, response, reqUrl);
            }
        }
    }
    else {
        // 404
        controller.notFound(message, response);
    }

}).listen(PORT, function() {
    console.log("Listening to port " + PORT)
});

