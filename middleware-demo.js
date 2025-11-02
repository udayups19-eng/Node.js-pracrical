// middleware-demo.js
const express = require('express');
const cors = require('cors');
const Ajv = require('ajv');

const app = express();
const ajv = new Ajv();

// -------------------- Configuration --------------------
const PORT = process.env.PORT || 3000;
const CORS_WHITELIST = ['http://localhost:3000', 'http://example.com'];

// -------------------- Helpers --------------------
// Wrap async route handlers so thrown or rejected errors go to next()
const wrapAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Create problem+json response helper following RFC-7807 minimal fields
function problemJson({ type = 'about:blank', title, status = 500, detail, instance }) {
  const body = { type, title, status };
  if (detail) body.detail = detail;
  if (instance) body.instance = instance;
  return body;
}

// Simple schema compile helper
function validateSchema(schema) {
  const validate = ajv.compile(schema);
  return (req, res, next) => {
    const ok = validate(req.body);
    if (ok) return next();
    const errDetail = ajv.errorsText(validate.errors, { separator: ', ' });
    const err = new Error('Request body validation failed: ' + errDetail);
    err.status = 400;
    err.title = 'Invalid request body';
    err.detail = errDetail;
    return next(err);
  };
}

// -------------------- Middleware pipeline (order matters) --------------------

// 1) Request ID middleware
app.use((req, res, next) => {
  try {
    req.id = require('crypto').randomUUID();
  } catch {
    req.id = Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
  res.setHeader('X-Request-Id', req.id);
  next();
});

// 2) High-precision timing middleware
app.use((req, res, next) => {
  req._startHrTime = process.hrtime.bigint();
  res.setHeader('X-Request-Id', req.id);
  const setResponseTime = () => {
    const diffNs = Number(process.hrtime.bigint() - req._startHrTime);
    const ms = diffNs / 1e6;
    res.setHeader('X-Response-Time-ms', ms.toFixed(3));
  };
  res.on('finish', setResponseTime);
  res.on('close', setResponseTime);
  next();
});

// 3) Simple logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} (reqId=${req.id})`);
  next();
});

// 4) CORS - locked down to whitelist
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (CORS_WHITELIST.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  optionsSuccessStatus: 200,
}));

// 5) Body parser with size limit and JSON safety
app.use(express.json({ limit: '100kb' }));

// 6) Handle JSON parse errors
app.use((err, req, res, next) => {
  if (err && (err.type === 'entity.parse.failed' || err instanceof SyntaxError)) {
    err.status = err.status || 400;
    err.title = 'Malformed JSON';
    err.detail = err.message;
    return next(err);
  }
  return next(err);
});

// 7) Routes
const itemSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    qty: { type: 'integer', minimum: 0 },
  },
  required: ['name'],
  additionalProperties: false,
};

app.post('/items', validateSchema(itemSchema), wrapAsync(async (req, res) => {
  await new Promise((r) => setTimeout(r, 30));
  res.status(201).json({
    message: 'Item accepted',
    item: req.body,
    requestId: req.id,
  });
}));

app.get('/demo', wrapAsync(async (req, res) => {
  await new Promise((_, reject) => setTimeout(() => reject(new Error('boom - demo async failure')), 10));
  res.json({ ok: true });
}));

app.get('/', (req, res) => {
  res.json({ message: 'Middleware pipeline demo', requestId: req.id });
});

// -------------------- Centralized error handler --------------------
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const title = err.title || (status === 500 ? 'Internal Server Error' : 'Error');
  const detail = err.detail || err.message;
  const instance = `/requests/${req.id}`;

  const body = problemJson({
    type: 'about:blank',
    title,
    status,
    detail,
    instance,
  });

  if (status >= 500) {
    console.error(`ERROR [reqId=${req.id}]`, err);
  } else {
    console.warn(`Client error [reqId=${req.id}]`, err.message);
  }

  res.setHeader('Content-Type', 'application/problem+json');
  res.setHeader('X-Request-Id', req.id);
  res.status(status).json(body);
});

// -------------------- Safety for unhandled errors --------------------
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at Promise', p, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// -------------------- Start server --------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} (file: middleware-demo.js)`);
});
