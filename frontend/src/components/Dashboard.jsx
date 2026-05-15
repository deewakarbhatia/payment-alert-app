import { useState, useEffect } from 'react';
import API from '../api/api';
import PaymentForm from './PaymentForm';
import PaymentTable from './PaymentTable';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const [payments, setPayments] = useState([]);
    const { user, logout } = useAuth();

    const fetchPayments = async () => {
        try {
            const res = await API.get('/payments');
            setPayments(res.data);
        } catch { logout(); }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchPayments(); }, []);

    const totalReceived = payments
        .filter(p => p.type === 'received')
        .reduce((s, p) => s + p.amount, 0);
    const totalSent = payments
        .filter(p => p.type === 'sent')
        .reduce((s, p) => s + p.amount, 0);
    const netBalance = totalReceived - totalSent;

    const cardStyle = (bg) => ({
        background: bg, padding: '20px 24px',
        borderRadius: 10, flex: 1, minWidth: 160
    });

    return (
        <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>

            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 24
            }}>
                <h2 style={{ color: '#1A5276', margin: 0 }}>💰 Payment Alert App</h2>
                <div>
                    <span style={{ marginRight: 16, color: '#555' }}>👤 {user.name} ({user.role})</span>
                    <button onClick={logout} style={{
                        padding: '8px 16px', background: '#E74C3C',
                        color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer'
                    }}>Logout</button>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                <div style={cardStyle('#D5F5E3')}>
                    <p style={{ margin: 0, color: '#1E8449', fontSize: 13 }}>Total Received</p>
                    <h2 style={{ margin: '4px 0', color: '#1E8449' }}>₹{totalReceived.toLocaleString('en-IN')}</h2>
                </div>
                <div style={cardStyle('#FADBD8')}>
                    <p style={{ margin: 0, color: '#C0392B', fontSize: 13 }}>Total Sent</p>
                    <h2 style={{ margin: '4px 0', color: '#C0392B' }}>₹{totalSent.toLocaleString('en-IN')}</h2>
                </div>
                <div style={cardStyle('#D6EAF8')}>
                    <p style={{ margin: 0, color: '#1A5276', fontSize: 13 }}>Net Balance</p>
                    <h2 style={{ margin: '4px 0', color: '#1A5276' }}>₹{netBalance.toLocaleString('en-IN')}</h2>
                </div>
                <div style={cardStyle('#F9EBEA')}>
                    <p style={{ margin: 0, color: '#922B21', fontSize: 13 }}>Total Transactions</p>
                    <h2 style={{ margin: '4px 0', color: '#922B21' }}>{payments.length}</h2>
                </div>
            </div>

            {/* Payment Form */}
            <PaymentForm onSuccess={fetchPayments} />

            {/* Payment Table */}
            <PaymentTable payments={payments} onRefresh={fetchPayments} />

        </div>
    );
}