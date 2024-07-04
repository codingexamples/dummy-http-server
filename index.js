var http = require('node:http');

// Access the command line arguments
const cmdArgs = process.argv.slice(2); // Slice to remove the first two elements

// Process the arguments
// cmdArgs.forEach((arg, index) => {
//     console.log(`Argument ${index}: ${arg}`);
// });

// Example of how to handle specific options
const cmdOptions = {
    name: null,
    age: null
};

cmdArgs.forEach(arg => {
    const [key, value] = arg.split('=');
    if (key === '--name') {
        cmdOptions.name = value;
    } else if (key === '--age') {
        cmdOptions.age = value;
    }
});

console.log('Parsed Options:', cmdOptions);

var requestId = 0;

http.createServer(function (req, res) {
    console.log("######## REQUEST ########");
    console.log(`Request-ID: ${requestId}`);
    console.log(`Time: ${getFormattedTimestamp()}`);
    console.log(`Method: ${req.method}`);
    console.log(`Http-version: ${req.httpVersion}`);
    console.log(`URL: ${req.url}`);
    console.log("Headers:");
    console.log(req.headers);
    // console.log("Trailers:");
    // console.log(req.trailers);


    // Collect the body data (if any)
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        // Log the complete body
        console.log(body);

        // Respond to the client
        // res.statusCode = 200;
        // res.setHeader('Content-Type', 'text/plain');
        // res.end('Hello, world!\n');
        //write a response to the client
        // TODO: answer from command line option
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('Hello World!');
        res.end();

        console.log("########## END ##########");
        console.log("");
    });

    req.on('error', err => {
        console.log('Request error:', err);
        res.statusCode = 500;
        res.end('Internal Server Error\n');

        console.log("########## END ##########");
        console.log("");
    });



    requestId += 1;
}).listen(8080); //the server object listens on port 8080


function getFormattedTimestamp() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
}