const twilio = require('twilio');

let client;
try {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
} catch (e) {
  console.log("Twilio initialization failed:", e.message);
}

const sendPaymentAlert = async (payment) => {
  if (!client) return { sent: false, error: 'Twilio not configured' };
  
  const { amount, customerName, customerPhone, type, method, note, date } = payment;

  const formattedDate = new Date(date).toLocaleDateString('en-IN');
  const formattedAmount = `Rs.${Number(amount).toLocaleString('en-IN')}`;

  const message = type === 'received'
    ? `✅ Payment Received!\n\nAmount: ${formattedAmount}\nFrom: ${customerName}\nMethod: ${method}\nDate: ${formattedDate}\nRef: ${note || 'N/A'}\n\nThank you! 🙏`
    : `💸 Payment Sent!\n\nAmount: ${formattedAmount}\nTo: ${customerName}\nMethod: ${method}\nDate: ${formattedDate}\nRef: ${note || 'N/A'}`;

  // Make sure phone has country code
  const toPhone = customerPhone.startsWith('+')
    ? customerPhone
    : `+91${customerPhone}`;

  try {
    // Try WhatsApp first
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${toPhone}`,
      body: message
    });
    console.log('✅ WhatsApp sent to', toPhone);
    return { sent: true, channel: 'whatsapp' };

  } catch (err) {
    console.log('WhatsApp failed, trying SMS...', err.message);

    // Fallback to SMS
    try {
      await client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: toPhone,
        body: message
      });
      console.log('✅ SMS sent to', toPhone);
      return { sent: true, channel: 'sms' };

    } catch (e) {
      console.error('❌ Alert failed:', e.message);
      return { sent: false, error: e.message };
    }
  }
};

module.exports = { sendPaymentAlert };
