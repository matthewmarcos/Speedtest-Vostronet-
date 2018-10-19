# Vostronet Backend Programming Exam

This is an app similar to [www.speedtest.net](www.speedtest.net). This is my answer to Vostronet's programming test.

### Requirements:
1. Node 8.12.0

### Running the app

* Run the server
```
$ node server.js
```
* go to `localhost:3000` on your browser
* click the button to start the test

### How it works
1. The front end spawns the max amount of `XMLHttpRequests` the browser can handle. (usually 6 on modern ones) to the `/test` endpoint on the server. The way I determine the user's browser is not 100% fool-proof and should be improved for real-world situations.
1. The `/test` endpoint returns 25MB worth of 'A' characters.
1. The front end counts and sums the data received.
1. There is a 5 second limit before all `XMLHttpRequest` instances are terminated.
1. If an active `XMLHttpRequest` completes before the 5 second limit, a new one is spawned.


### Resources Used
[Nodejs API for Buffer, FS, Path, Http, Message and Response](https://nodejs.org/dist/latest-v8.x/docs/api/)

[Max number for xhr requests per browser](https://stackoverflow.com/questions/985431/max-parallel-http-connections-in-a-browser)

[XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)


Author: Joseph Matthew R. Marcos

E: matthewmarcos94@gmail.com

C: +63935 146 3943 