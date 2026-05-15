import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, password });
            login(res.data.token, res.data.user);
            navigate('/');
        } catch {
            setError('Invalid email or password');
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: '#EBF5FB'
        }}>
            <div style={{
                background: '#fff', padding: 40, borderRadius: 12,
                width: 380, boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ color: '#1A5276', marginBottom: 8 }}>💰 Payment Alert App</h2>
                <p style={{ color: '#888', marginBottom: 24 }}>Login to your account</p>
                {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        placeholder='Email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%', padding: 10, marginBottom: 12,
                            border: '1px solid #ccc', borderRadius: 6, boxSizing: 'border-box'
                        }}
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%', padding: 10, marginBottom: 20,
                            border: '1px solid #ccc', borderRadius: 6, boxSizing: 'border-box'
                        }}
                    />
                    <button type='submit' style={{
                        width: '100%', padding: 12,
                        background: '#1A5276', color: '#fff',
                        border: 'none', borderRadius: 6,
                        fontSize: 16, cursor: 'pointer', marginBottom: 12
                    }}>
                        Login
                    </button>
                    
                    <div style={{ textAlign: 'center', fontSize: 14 }}>
                        Don't have an account? <Link to='/signup' style={{ color: '#1A5276' }}>Sign up here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}