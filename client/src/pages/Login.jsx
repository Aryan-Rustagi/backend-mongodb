import { Link } from 'react-router-dom';
import './Pages.css';

const Login = () => {
  return (
    <div className="page-container auth-page">
      <div className="auth-card">
        <h2>Welcome back to Blogify</h2>
        <p className="auth-subtitle">Login to your account to start editing posts.</p>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary auth-btn">Login</button>
        </form>
        <p className="auth-actions">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
