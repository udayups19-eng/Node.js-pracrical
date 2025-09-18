// simple http server with file read and write

// import http and fs module
const http = require("http");
const fs = require("fs");

// create a server
const server = http.createServer(function (req, res) {
    // write some content to a file
    fs.writeFile("myfile.txt", "Hello, this is my first file in Node.js!", function (err) {
        if (err) {
            res.write("Error writing file");
        } else {
            // read the same file
            fs.readFile("myfile.txt", "utf8", function (err, data) {
                if (err) {
                    res.write("Error reading file");
                } else {
                    res.write("File content is: " + data);
                }
                res.end();
            });
        }
    });
});

// start the server
server.listen(3000, function () {
    console.log("Server is running at http://localhost:3000");
});