// logger.js

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

// Logger class
class Logger extends EventEmitter {
    log(message) {
        const timeMsg = `${new Date().toISOString()} - ${message}`;
        this.emit('log', timeMsg);
    }
}

const logger = new Logger();

// ---- Console Transport ----
logger.on('log', msg => console.log(msg));

// ---- File Transport with 5 KB rotation ----
const logDir = path.join(__dirname, 'logs'); // logs folder inside logger-practical
let fileIndex = 1;
let currentSize = 0;
const maxSize = 5000; // ~5 KB per file
let currentFile = path.join(logDir, `log${fileIndex}.txt`);

logger.on('log', msg => {
    const line = msg + '\n';
    const size = Buffer.byteLength(line);

    // Rotate file if it exceeds maxSize
    if (currentSize + size > maxSize) {
        fileIndex++;
        currentFile = path.join(logDir, `log${fileIndex}.txt`);
        currentSize = 0;
    }

    fs.appendFileSync(currentFile, line);
    currentSize += size;
});

{
// ---- Test Logger ----
logger.log("This is a test log!");  // single log for testing

}
