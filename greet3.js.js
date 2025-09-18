// greet.js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// Listener: runs when 'greet' is emitted
myEmitter.on('greet', (name) => {
  console.log(`GREET listener: Hello, ${name || 'friend'}!`);
});

// Emit the event
myEmitter.emit('greet', 'Student'); // you can change the name
