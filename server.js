require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/error');

const app = express();

const origins = (process.env.CLIENT_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
app.use(helmet());
app.use(cors({ origin: origins.length ? origins : true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false }));
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 30 }));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'krishi-sewak-api' }));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/msp', require('./src/routes/msp'));
app.use('/api/crops', require('./src/routes/crops'));
app.use('/api/cart', require('./src/routes/cart'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/admin', require('./src/routes/admin'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Krishi Sewak API running on port ${PORT}`));
});

module.exports = app;
