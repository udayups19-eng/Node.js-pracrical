const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to log when client disconnects
function clientAbortMiddleware(req, res, next) {
  req.on('close', () => {
    if (res.writableEnded === false) {
      console.log('❌ Client disconnected. Stopping stream.');
    }
  });
  next();
}

// Route for streaming NDJSON
app.get('/', clientAbortMiddleware, (req, res) => {
  res.setHeader('Content-Type', 'application/x-ndjson');

  let count = 0;
  const interval = setInterval(() => {
    if (res.writableEnded) {
      clearInterval(interval);
      return;
    }

    const data = { id: count, message: `Item ${count}` };
    res.write(JSON.stringify(data) + '\n'); // NDJSON format
    count++;

    // Stop after 10 messages
    if (count >= 10) {
      clearInterval(interval);
      res.end();
    }
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
    console.log('Stream stopped due to client disconnect.');
  });
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
