import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Login = () => {
    const [isSeller, setIsSeller] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isSeller ? '/seller/login' : '/admin/login';

        try {
            const response = await api.post(endpoint, { email, password });
            const { token, role } = response.data;

            localStorage.setItem('auth_token', token);
            localStorage.setItem('user_role', role);

            if (role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/seller');
            }
        } catch (err) {
            console.error(err);
            setError('Invalid credentials or server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 className="title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>The Future Code</h1>
                <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '2rem' }}>
                    {isSeller ? 'Seller Portal' : 'Admin Portal'}
                </p>

                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', marginBottom: '2rem' }}>
                    <button
                        type="button"
                        onClick={() => setIsSeller(false)}
                        style={{
                            flex: 1,
                            border: 'none',
                            background: !isSeller ? 'var(--primary)' : 'transparent',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Admin
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsSeller(true)}
                        style={{
                            flex: 1,
                            border: 'none',
                            background: isSeller ? 'var(--primary)' : 'transparent',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Seller
                    </button>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {!isSeller && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
                        Default: admin@gmail.com / password
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
