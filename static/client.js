(function() {
    var URL = '/test';
    var ASYNC_REQUEST_COUNT = 1;
    var TESTING_TIME = 5;  // Number of seconds
    var TEST_TOKEN_LENGTH = 10;


    var total_data_size = [];
    var requests = [];
    var $progress = document.getElementById('progress');
    var $timeElapsed = document.getElementById('time-elapsed');
    var $timeTotal = document.getElementById('time-total');
    var $testDownloadSpeed = document.getElementById('test-download-speed');
    var $downloadSpeed = document.getElementById('download-speed');
    var $testUploadSpeed = document.getElementById('test-upload-speed');
    var $uploadSpeed = document.getElementById('upload-speed');


    function downloadSpeedTest(ev) {
        for(var i = 0 ; i < ASYNC_REQUEST_COUNT ; i++) {
            total_data_size[i] = 0;
            var req = spawnXHR('GET', requests.length, {});
        }

        requests.forEach(function(req, idx) {
            req.send();
        });

        // Force cancel the requests after some time
        setTimeout(abortDownloadSpeedRequests, TESTING_TIME * 1000);
    }


    function uploadSpeedTest(ev) {
        var payload = generateTestToken(5000000);
        var customHeaders = {
            'test-token': generateTestToken(TEST_TOKEN_LENGTH)
        }

        for(var i = 0 ; i < ASYNC_REQUEST_COUNT ; i++) {
            total_data_size[i] = 0;
            var req = spawnXHR('POST', requests.length, payload, customHeaders);
        }

        requests.forEach(function(req, idx) {
            req.send(payload);
        });

        // Force cancel the requests after some time
        setTimeout(abortUploadSpeedRequests.bind(null, customHeaders), TESTING_TIME * 1000);
    }


    function spawnXHR(method, idx, payload, customHeaders) {
        /*
         * idx referrs to the index of the requests array the
         * new xhr request will be
         */

        var headers = customHeaders || {};
        var headerKeys = Object.keys(headers);

        var req = new XMLHttpRequest();
        // Setting the custom headers
        req.open(method, URL);
        headerKeys.forEach(function(key) {
            req.setRequestHeader(key, headers[key]);
        });
        req.addEventListener('progress', handleDownloadProgress.bind(this, idx));
        req.addEventListener('load', handleLoad.bind(null, payload, method, customHeaders));
        req.addEventListener('error', handleError);
        req.addEventListener('abort', handleDownloadProgress.bind(this, idx));
        requests.push(req);

        return req;
    }


    function generateTestToken(len) {
        var salt = '';
        var choices = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

        for (var i = 0; i < len; i++) {
            salt += choices.charAt(Math.floor(Math.random() * choices.length));
        }

        return salt + String(new Date().getTime());
    }


    function abortUploadSpeedRequests(header) {
        var totalBytesDownloaded = 0;

        // Abort alll existing requests
        requests.forEach(function(req) {
            req.abort();
        });
        requests = [];


        // Ask server how much it received in all
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'text';
        xhr.open('POST', '/results');
        xhr.setRequestHeader('test-token', header['test-token']);
        xhr.addEventListener('load', function() {
            var data = xhr.response;
            totalBytesDownloaded = Number(data);
            $uploadSpeed.innerHTML = stringifyDownloaded(
                totalBytesDownloaded/TESTING_TIME
            ) + '/ second';
        });
        xhr.send();
    }


    function abortDownloadSpeedRequests() {
        requests.forEach(function(req) {
            req.abort();
        });

        /* Reduce is an ES5 Specification
        * https://es5.github.io/#x15.4.4.21
        */
        var totalBytesDownloaded = total_data_size.reduce(function(acc, val) {
            return acc + val;
        }, 0);

        // Reset the req counter
        total_data_size = [];
        requests = [];

        $downloadSpeed.innerHTML = stringifyDownloaded(
            totalBytesDownloaded/TESTING_TIME
        ) + '/ second';
    }


    function handleDownloadProgress(idx, data) {
        total_data_size[idx] = data.loaded;
    }


    function handleLoad(payload, method, customHeaders, ev) {
    /*This gets triggered if an xhr completes downloading. Spawn a new one.
    */
        var req = spawnXHR(method, requests.length, payload, customHeaders);
        req.send(payload);
    }


    function handleError(err) {
        // Ignore Error
    }


    function getMaxAsyncRequests() {
    /* MAX number of active async requests
     * https://stackoverflow.com/questions/985431/max-parallel-http-connections-in-a-browser
     * https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser/9851769
     */
        var agent = navigator.userAgent;

        // very very crude way of checking the browser
        var isChrome = Boolean(agent.indexOf('Chrome') !== -1);
        var isFirefox = Boolean(agent.indexOf('Firefox') !== -1)

        // 6 max async requests if good browser. Otherwise, 2.
        return (isChrome || isFirefox) ? 6 : 2;
    }


    function stringifyDownloaded(byteCount) {
        // Converts byteCount into a human-readable string
        var suffix = ' MB';
        var value;

        if(byteCount < 1000000) {
            suffix = ' KB';
            value = byteCount/1000;
        }
        else {
            value = byteCount/1000000;
        }

        return String(value.toFixed(2)) + suffix;
    }


    function start() {
        ASYNC_REQUEST_COUNT = getMaxAsyncRequests();
        $testDownloadSpeed.addEventListener('click', downloadSpeedTest);
        $testUploadSpeed.addEventListener('click', uploadSpeedTest);
    }

    start();

}());
