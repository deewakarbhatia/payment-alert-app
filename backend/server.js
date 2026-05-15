const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/', (req, res) => res.json({ status: 'API Running ✅' }));

app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT} ✅`)
);