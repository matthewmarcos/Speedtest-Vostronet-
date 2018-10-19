(function() {
    var URL = '/test';
    var ASYNC_REQUEST_COUNT = 1;
    var TESTING_TIME = 5;  // Number of seconds

    var total_data_size = [];
    var requests = [];
    var $testSpeed = document.getElementById('test-speed');
    var $progress = document.getElementById('progress');
    var $downloaded = document.getElementById('downloaded');
    var $timeElapsed = document.getElementById('time-elapsed');
    var $timeTotal = document.getElementById('time-total');
    var $speed = document.getElementById('speed');


    function speedTest(ev) {
        for(var i = 0 ; i < ASYNC_REQUEST_COUNT ; i++) {
            total_data_size[i] = 0;
            var req = spawnXHR(requests.length);
        }

        requests.forEach(function(req, idx) {
            req.send();
        });

        // Force cancel the requests after some time
        setTimeout(abortRequests, TESTING_TIME * 1000);
    }


    function spawnXHR(idx) {
        /*
         * idx referrs to the index of the requests array the
         * new xhr request will be
         */
        var req = new XMLHttpRequest();
        req.open('GET', URL);
        req.addEventListener('progress', handleProgress.bind(this, idx));
        req.addEventListener('load', handleLoad);
        req.addEventListener('error', handleError);
        req.addEventListener('abort', handleProgress.bind(this, idx));
        requests.push(req);

        return req;
    }


    function abortRequests() {
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

        $speed.innerHTML = stringifyDownloaded(
            totalBytesDownloaded/TESTING_TIME
        ) + '/ second';
    }


    function handleProgress(idx, data) {
        total_data_size[idx] = data.loaded;
    }


    function handleLoad(data) {
    /*This gets triggered if an xhr completes downloading. Spawn a new one.
    */
        var req = spawnXHR(requests.length);
        req.send();
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
            suffix = ' KB'
            value = byteCount/1000;
        }
        else {
            value = byteCount/1000000;
        }

        return String(value.toFixed(2)) + suffix;
    }


    function start() {
        ASYNC_REQUEST_COUNT = getMaxAsyncRequests();
        $testSpeed.addEventListener('click', speedTest);
    }

    start();

}())
