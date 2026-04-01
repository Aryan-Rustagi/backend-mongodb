import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import './Pages.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // clear messages on change
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validate = () => {
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) {
      return 'All fields are required.';
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await api.post('/api/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (!data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      const msg = 'Registration successful! Redirecting to login...';
      setSuccess(msg);
      toast.success(msg);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Registration failed.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container auth-page">
      <div className="auth-card">
        <h2>Join Blogify Today</h2>
        <p className="auth-subtitle">Create your account to start your blogging journey.</p>
        
        {error && (
          <div className="alert alert-error" style={{ color: '#d32f2f', marginBottom: '1rem', padding: '0.75rem', border: '1px solid #d32f2f', borderRadius: '4px', backgroundColor: '#ffebee', fontSize: '14px' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" style={{ color: '#2e7d32', marginBottom: '1rem', padding: '0.75rem', border: '1px solid #2e7d32', borderRadius: '4px', backgroundColor: '#e8f5e9', fontSize: '14px' }}>
            {success}
          </div>
        )}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="John Doe" 
              value={formData.name} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="you@example.com" 
              value={formData.email} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              value={formData.password} 
              onChange={handleChange} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              placeholder="••••••••" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
            />
          </div>
          <button type="submit" className="btn-primary auth-btn" disabled={loading} style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-actions">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
