import { useState } from 'react';
import API from '../api/api';

export default function PaymentForm({ onSuccess }) {
    const [form, setForm] = useState({
        amount: '', customerName: '', customerPhone: '',
        type: 'received', method: 'cash', note: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/payments', form);
            alert('✅ Payment logged! WhatsApp alert sent!');
            setForm({
                amount: '', customerName: '', customerPhone: '',
                type: 'received', method: 'cash', note: ''
            });
            onSuccess();
        } catch { alert('Something went wrong'); }
        setLoading(false);
    };

    const inputStyle = {
        width: '100%', padding: 10, border: '1px solid #ccc',
        borderRadius: 6, boxSizing: 'border-box', fontSize: 14
    };

    return (
        <div style={{ background: '#f8f9fa', padding: 24, borderRadius: 10, marginBottom: 24 }}>
            <h3 style={{ color: '#1A5276', marginBottom: 16 }}>➕ Log New Payment</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <input name='amount' placeholder='Amount (₹)' value={form.amount}
                        onChange={handleChange} required style={inputStyle} type='number' />
                    <input name='customerName' placeholder='Customer Name' value={form.customerName}
                        onChange={handleChange} required style={inputStyle} />
                    <input name='customerPhone' placeholder='Phone (e.g. 9876543210)' value={form.customerPhone}
                        onChange={handleChange} required style={inputStyle} />
                    <select name='type' value={form.type} onChange={handleChange} style={inputStyle}>
                        <option value='received'>✅ Received</option>
                        <option value='sent'>💸 Sent</option>
                    </select>
                    <select name='method' value={form.method} onChange={handleChange} style={inputStyle}>
                        <option value='cash'>Cash</option>
                        <option value='upi'>UPI</option>
                        <option value='bank'>Bank Transfer</option>
                        <option value='cheque'>Cheque</option>
                    </select>
                    <input name='note' placeholder='Reference / Note (optional)' value={form.note}
                        onChange={handleChange} style={inputStyle} />
                </div>
                <button type='submit' disabled={loading} style={{
                    padding: '10px 28px', background: loading ? '#aaa' : '#1A5276',
                    color: '#fff', border: 'none', borderRadius: 6,
                    fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer'
                }}>
                    {loading ? 'Sending...' : '📤 Submit & Send WhatsApp'}
                </button>
            </form>
        </div>
    );
}