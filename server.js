var http = require('http');
var url = require('url');

var controller = require('./controller')

var PORT = 3000;

var GET = {
    '/': function(message, res) {

    }
}

function sampleMiddleware(req, res) {
    req.aaa = true;
    res.aaa = true;

    return [req, res];
}

function middleWareComposer() {
    var req = this.arguments[0];
    var res = this.arguments[1];

    var middleWares = this.arguments.slice(2);

    middleWares.forEach(function(middleware) {
        var temp = middleWare(req, res);
        req = temp[0];
        res = temp[1];
    });

}

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
        response.writeHead(404);
        response.write('404 not found');
        response.end();
    }

}).listen(PORT, function() {
    console.log("Listening to port " + PORT)
});

