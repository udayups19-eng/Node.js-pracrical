// server.mjs
import http from 'http';

const port = 3000;

const server = http.createServer(async (req, res) => {
  if (req.url === '/') {
    const { default: fs } = await import('fs');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from Dynamic Import Server!');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});

