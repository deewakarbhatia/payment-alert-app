import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('agent');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', { name, email, password, role });
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to create account');
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
                <p style={{ color: '#888', marginBottom: 24 }}>Create a new account</p>
                {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
                {success && <p style={{ color: 'green', marginBottom: 12 }}>{success}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        placeholder='Full Name'
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        style={{
                            width: '100%', padding: 10, marginBottom: 12,
                            border: '1px solid #ccc', borderRadius: 6, boxSizing: 'border-box'
                        }}
                    />
                    <input
                        placeholder='Email'
                        type='email'
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
                            width: '100%', padding: 10, marginBottom: 12,
                            border: '1px solid #ccc', borderRadius: 6, boxSizing: 'border-box'
                        }}
                    />
                    <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        style={{
                            width: '100%', padding: 10, marginBottom: 20,
                            border: '1px solid #ccc', borderRadius: 6, boxSizing: 'border-box'
                        }}
                    >
                        <option value='agent'>Agent</option>
                        <option value='admin'>Admin</option>
                    </select>

                    <button type='submit' style={{
                        width: '100%', padding: 12,
                        background: '#1A5276', color: '#fff',
                        border: 'none', borderRadius: 6,
                        fontSize: 16, cursor: 'pointer', marginBottom: 12
                    }}>
                        Sign Up
                    </button>

                    <div style={{ textAlign: 'center', fontSize: 14 }}>
                        Already have an account? <Link to='/login' style={{ color: '#1A5276' }}>Login here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
