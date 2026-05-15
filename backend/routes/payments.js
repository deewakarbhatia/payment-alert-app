const router = require('express').Router();
const Payment = require('../models/Payment');
const auth = require('../middleware/auth');
const { sendPaymentAlert } = require('../services/whatsapp');

// Create payment + send alert
router.post('/', auth, async (req, res) => {
    try {
        const payment = new Payment({
            ...req.body,
            agent: req.user.id,
            agentName: req.user.name
        });
        await payment.save();

        // Send WhatsApp/SMS alert
        const alertResult = await sendPaymentAlert(payment);
        payment.whatsappSent = alertResult.sent;
        await payment.save();

        res.json({ payment, alertResult });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

// Get payments (admin sees all, agent sees own)
router.get('/', auth, async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { agent: req.user.id };
        const payments = await Payment.find(filter).sort({ date: -1 });
        res.json(payments);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
});

// Update payment
router.put('/:id', auth, async (req, res) => {
    const payment = await Payment.findByIdAndUpdate(
        req.params.id, req.body, { new: true }
    );
    res.json(payment);
});

// Delete payment
router.delete('/:id', auth, async (req, res) => {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
});

module.exports = router;