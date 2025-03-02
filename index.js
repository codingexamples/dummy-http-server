#!/usr/bin/env node

var http = require('node:http');

function getFormattedTimestamp() {
    const date = new Date();

    const year = date.getFullYear();
    // Months are zero-based -> padding
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
}

// Slice to remove the first two elements
const cmdArgs = process.argv.slice(2);
const options = {
    port: 8080,
    hostname: "localhost",
    contentType: 'text/html',
    responseStatus: 200,
    response: 'OK'
};
cmdArgs.forEach(arg => {
    const [key, value] = arg.split('=');
    if (key === '--content-type') {
        options.contentType = value;
    } else if (key === '--response-status') {
        let responseStatusNumber = Number(value);
        if (isNaN(responseStatusNumber)) {
            console.error('Invalid number in command line option --response-status.');
            process.exit(1);
        } else {
            options.responseStatus = responseStatusNumber;
        }
    } else if (key === '--response') {
        // console.log(value);
        if (options.contentType == "application/json") {
            let jsonObjectFromValue;
            try {
                jsonObjectFromValue = JSON.parse(value);
                options.response = jsonObjectFromValue
            } catch (error) {
                console.error('Invalid JSON string in command line option --response.');
                process.exit(1);
            }
        } else {
            options.response = value;
        }
    } else if (key === '--port') {
        let portNumber = Number(value);
        if (isNaN(portNumber)) {
            console.error('Invalid number in command line option --port.');
            process.exit(1);
        } else {
            options.port = portNumber;
        }
    } else if (key === '--hostname') {
        options.hostname = value;
    }
    else if (key === '--help') {
        console.log("Command line options:");
        console.log("--content-type: content-type of the response to the client");
        console.log("--response: body of the response to the client");
        console.log("--response-status: HTTP status of the response to the client");
        console.log("--port: port of the listening server");
        console.log("--hostname: hostname of the listening server\n");
        console.log("#### EXAMPLES ####");
        console.log('npx dummy-http-server --content-type=application/json --response="{\"myMessage\": \"hello\", \"myStatusCode\": \"1234\"}" --response-status=201');
        console.log("npx dummy-http-server --port=7000 --hostname=192.168.5.100");
        process.exit(1);
    }
});

console.log('Server options:', options);

var requestId = 0;

var httpServer = http.createServer(function (req, res) {
    console.log("######## REQUEST ########");
    console.log(`Request-ID: ${requestId}`);
    console.log(`Time: ${getFormattedTimestamp()}`);
    console.log(`HTTP-method: ${req.method}`);
    console.log(`HTTP-version: ${req.httpVersion}`);
    console.log(`URL: ${req.url}`);
    console.log("Headers:");
    console.log(req.headers);

    // Collect the body data (if any)
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        // Log the complete body
        console.log("Body:")
        console.log(body);

        // Respond to the client
        res.writeHead(options.responseStatus, { 'Content-Type': options.contentType });
        if (options.contentType === "application/json") {
            res.write(JSON.stringify(options.response));
        } else {
            res.write(options.response);
        }
        res.end();

        console.log("########## END ##########");
        console.log("");
    });

    req.on('error', err => {
        console.log('Request error:', err);
        res.statusCode = 500;
        res.end('Internal Server Error\n');

        console.log("########## END ##########\n");
    });



    requestId += 1;
})

httpServer.listen(options.port, function (){
    console.log(`Server listening at http://${options.hostname}:${options.port}/\n`);
});

