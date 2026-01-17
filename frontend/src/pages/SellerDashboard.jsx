import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SellerDashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [productName, setProductName] = useState('');
    const [productDesc, setProductDesc] = useState('');
    const [brands, setBrands] = useState([
        { brand_name: '', detail: '', price: '', image: null }
    ]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/seller/products');
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        navigate('/login');
    };

    const handleBrandChange = (index, field, value) => {
        const newBrands = [...brands];
        newBrands[index][field] = value;
        setBrands(newBrands);
    };

    const handleImageChange = (index, file) => {
        const newBrands = [...brands];
        newBrands[index].image = file;
        setBrands(newBrands);
    };

    const addBrandField = () => {
        setBrands([...brands, { brand_name: '', detail: '', price: '', image: null }]);
    };

    const removeBrandField = (index) => {
        const newBrands = brands.filter((_, i) => i !== index);
        setBrands(newBrands);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('product_name', productName);
        formData.append('product_description', productDesc);

        brands.forEach((brand, index) => {
            formData.append(`brands[${index}][brand_name]`, brand.brand_name);
            formData.append(`brands[${index}][detail]`, brand.detail);
            formData.append(`brands[${index}][price]`, brand.price);
            if (brand.image) {
                formData.append(`brands[${index}][image]`, brand.image);
            }
        });

        try {
            await api.post('/seller/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchProducts();
            setShowForm(false);
            // Reset form
            setProductName('');
            setProductDesc('');
            setBrands([{ brand_name: '', detail: '', price: '', image: null }]);
            alert('Product added successfully!');
        } catch (error) {
            console.error('Error adding product', error);
            alert('Failed to add product. Check console.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/seller/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product', error);
        }
    };

    const handleDownloadPdf = async (id, name) => {
        try {
            const response = await api.get(`/seller/products/${id}/pdf`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error downloading PDF', error);
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
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Seller Dashboard</h2>
                    <button onClick={handleLogout} className="btn btn-sm btn-danger">
                        Logout
                    </button>
                </div>
            </header>

            <main className="container animate-fade-in">
                <div className="flex-between" style={{ marginBottom: '2rem', marginTop: '1rem' }}>
                    <h1 className="title" style={{ margin: 0 }}>Products</h1>
                    <button className="btn" onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : '+ New Product'}
                    </button>
                </div>

                {showForm && (
                    <div className="glass-panel" style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>Add New Product</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input className="input" value={productName} onChange={e => setProductName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea className="input" rows="3" value={productDesc} onChange={e => setProductDesc(e.target.value)} required />
                            </div>

                            <h4 style={{ marginBottom: '1rem', marginTop: '1.5rem', color: '#94a3b8' }}>Brands & Pricing</h4>

                            {brands.map((brand, index) => (
                                <div key={index} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    padding: '1rem',
                                    borderRadius: '0.5rem',
                                    marginBottom: '1rem',
                                    border: '1px solid var(--glass-border)'
                                }}>
                                    <div className="grid-2">
                                        <div className="form-group">
                                            <label>Brand Name</label>
                                            <input
                                                className="input"
                                                value={brand.brand_name}
                                                onChange={e => handleBrandChange(index, 'brand_name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Price</label>
                                            <input
                                                type="number"
                                                className="input"
                                                value={brand.price}
                                                onChange={e => handleBrandChange(index, 'price', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Details (Optional)</label>
                                        <input
                                            className="input"
                                            value={brand.detail}
                                            onChange={e => handleBrandChange(index, 'detail', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Image</label>
                                        <input
                                            type="file"
                                            className="input"
                                            onChange={e => handleImageChange(index, e.target.files[0])}
                                            accept="image/*"
                                        />
                                    </div>
                                    {brands.length > 1 && (
                                        <button type="button" onClick={() => removeBrandField(index)} className="btn btn-sm btn-danger">
                                            Remove Brand
                                        </button>
                                    )}
                                </div>
                            ))}

                            <div style={{ marginBottom: '1.5rem' }}>
                                <button type="button" onClick={addBrandField} className="btn" style={{ background: 'transparent', border: '1px dashed var(--primary)', color: 'var(--primary)' }}>
                                    + Add Another Brand
                                </button>
                            </div>

                            <button type="submit" className="btn">Save Product</button>
                        </form>
                    </div>
                )}

                <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : products.length === 0 ? (
                        <p>No products found.</p>
                    ) : (
                        products.map(product => (
                            <div key={product.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{product.name}</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0.5rem 0' }}>{product.description}</p>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase' }}>Brands</h4>
                                    <ul style={{ paddingLeft: '1.2rem', margin: '0.5rem 0' }}>
                                        {product.brands && product.brands.map(b => (
                                            <li key={b.id} style={{ marginBottom: '0.25rem' }}>
                                                {b.name} - <span style={{ color: '#22c55e' }}>${b.price}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleDownloadPdf(product.id, product.name)}
                                        className="btn btn-sm"
                                        style={{ flex: 1 }}
                                    >
                                        Download PDF
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default SellerDashboard;
