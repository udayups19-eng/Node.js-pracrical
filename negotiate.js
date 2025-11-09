const express = require('express');
const { js2xml } = require('xml-js');
const app = express();
const PORT = 3001;

// Middleware for content negotiation
function negotiateMiddleware(req, res, next) {
  res.negotiate = (data) => {
    const accept = req.headers['accept'];

    if (accept && accept.includes('application/xml')) {
      res.setHeader('Content-Type', 'application/xml');
      res.send(js2xml({ response: data }, { compact: true, spaces: 2 }));
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.json(data);
    }
  };
  next();
}

app.use(negotiateMiddleware);

app.get('/', (req, res) => {
  const data = { message: 'Hello from NodeJS!', success: true };
  res.negotiate(data);
});

app.listen(PORT, () => console.log(`✅ Negotiation server on http://localhost:${PORT}`));
