// blocking.js
const fs = require('fs');

// Blocking (synchronous) read
const data = fs.readFileSync('example.txt', 'utf8');
console.log("Blocking Read:", data);
