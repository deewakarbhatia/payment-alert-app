import { useState } from 'react';
import API from '../api/api';

export default function PaymentTable({ payments, onRefresh }) {
    const [search, setSearch] = useState('');

    const filtered = payments.filter(p =>
        p.customerName.toLowerCase().includes(search.toLowerCase()) ||
        p.customerPhone.includes(search)
    );

    const handleDelete = async (id) => {
        if (window.confirm('Delete this payment?')) {
            await API.delete(`/payments/${id}`);
            onRefresh();
        }
    };

    return (
        <div>
            <h3 style={{ color: '#1A5276', marginBottom: 12 }}>📋 Payment History</h3>
            <input
                placeholder='🔍 Search by name or phone...'
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                    width: '100%', padding: 10, marginBottom: 16,
                    border: '1px solid #ccc', borderRadius: 6,
                    boxSizing: 'border-box', fontSize: 14
                }}
            />
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: '#1A5276', color: '#fff' }}>
                            {['Date', 'Customer', 'Phone', 'Amount', 'Type', 'Method', 'Agent', 'Action'].map(h =>
                                <th key={h} style={{ padding: '10px 12px', textAlign: 'left' }}>{h}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} style={{ padding: 20, textAlign: 'center', color: '#888' }}>
                                No payments found
                            </td></tr>
                        )}
                        {filtered.map((p, i) => (
                            <tr key={p._id} style={{ background: i % 2 === 0 ? '#EBF5FB' : '#fff' }}>
                                <td style={{ padding: '10px 12px' }}>{new Date(p.date).toLocaleDateString('en-IN')}</td>
                                <td style={{ padding: '10px 12px' }}>{p.customerName}</td>
                                <td style={{ padding: '10px 12px' }}>{p.customerPhone}</td>
                                <td style={{ padding: '10px 12px', fontWeight: 'bold' }}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                                <td style={{ padding: '10px 12px', color: p.type === 'received' ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {p.type === 'received' ? '✅ Received' : '💸 Sent'}
                                </td>
                                <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>{p.method}</td>
                                <td style={{ padding: '10px 12px' }}>{p.agentName}</td>
                                <td style={{ padding: '10px 12px' }}>
                                    <button onClick={() => handleDelete(p._id)}
                                        style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}