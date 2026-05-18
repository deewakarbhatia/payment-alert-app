const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const client = require('prom-client');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Prometheus Metrics ──
client.collectDefaultMetrics();

const paymentCounter = new client.Counter({
    name: 'payments_total',
    help: 'Total number of payments logged',
    labelNames: ['type', 'method']
});

app.locals.paymentCounter = paymentCounter;

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

// ── Routes ──
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/', (req, res) => res.json({ status: 'API Running ✅' }));

// ── MongoDB + Server Start ──
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected ✅');
        app.listen(process.env.PORT, () =>
            console.log(`Server running on port ${process.env.PORT} ✅`)
        );
    })
    .catch(err => console.error('MongoDB Error:', err));