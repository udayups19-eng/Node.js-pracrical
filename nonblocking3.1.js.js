// nonblocking.js
const fs = require('fs');

// Non-blocking (asynchronous) read
fs.readFile('example.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log("Non-Blocking Read:", data);
});

console.log("This will run before file is read!");
