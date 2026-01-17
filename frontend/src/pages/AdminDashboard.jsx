import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile_no: '',
        country: '',
        state: '',
        skills: '',
        password: ''
    });

    useEffect(() => {
        fetchSellers();
    }, []);

    const fetchSellers = async () => {
        try {
            const response = await api.get('/admin/sellers');
            setSellers(response.data.data); // Pagination wrapper
        } catch (error) {
            console.error('Error fetching sellers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        navigate('/login');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map(skill => skill.trim())
            };
            await api.post('/admin/sellers', payload);
            fetchSellers();
            setShowForm(false);
            setFormData({
                name: '', email: '', mobile_no: '', country: '', state: '', skills: '', password: ''
            });
            alert('Seller created successfully!');
        } catch (error) {
            console.error('Error creating seller', error);
            alert('Failed to create seller. Check console.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this seller?')) return;
        try {
            await api.delete(`/admin/sellers/${id}`);
            fetchSellers();
        } catch (error) {
            console.error('Error deleting seller', error);
            alert('Failed to delete seller.');
        }
    };

    return (
        <div>
            {/* Header */}
            <header style={{
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--glass-border)',
                padding: '1rem 0',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div className="container flex-between" style={{ padding: '0 2rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Admin Dashboard</h2>
                    <button onClick={handleLogout} className="btn btn-sm btn-danger">
                        Logout
                    </button>
                </div>
            </header>

            <main className="container animate-fade-in">
                <div className="flex-between" style={{ marginBottom: '2rem', marginTop: '1rem' }}>
                    <h1 className="title" style={{ margin: 0 }}>Sellers</h1>
                    <button className="btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ New Seller'}
                    </button>
                </div>

                {showForm && (
                    <div className="glass-panel" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Create New Seller</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="grid-2">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input name="name" className="input" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input name="email" type="email" className="input" value={formData.email} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Mobile No</label>
                                    <input name="mobile_no" className="input" value={formData.mobile_no} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input name="password" type="password" className="input" value={formData.password} onChange={handleInputChange} required minLength={8} />
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <input name="country" className="input" value={formData.country} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input name="state" className="input" value={formData.state} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Skills (comma separated)</label>
                                <input name="skills" className="input" value={formData.skills} onChange={handleInputChange} placeholder="React, Laravel, Docker" required />
                            </div>
                            <button type="submit" className="btn">Create Seller</button>
                        </form>
                    </div>
                )}

                <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Location</th>
                                    <th>Skills</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center' }}>Loading...</td></tr>
                                ) : sellers.length === 0 ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center' }}>No sellers found.</td></tr>
                                ) : (
                                    sellers.map(seller => (
                                        <tr key={seller.id}>
                                            <td style={{ fontWeight: 500 }}>{seller.name}</td>
                                            <td style={{ color: '#94a3b8' }}>{seller.email}</td>
                                            <td>{seller.state}, {seller.country}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                    {Array.isArray(seller.skills)
                                                        ? seller.skills.map(s => <span key={s} className="badge">{s}</span>)
                                                        : <span className="badge">{seller.skills}</span>
                                                    }
                                                </div>
                                            </td>
                                            <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                                                {new Date(seller.created_at).toLocaleDateString()}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(seller.id)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
