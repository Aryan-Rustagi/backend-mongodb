import { Link } from 'react-router-dom';
import './Pages.css';

const Register = () => {
  return (
    <div className="page-container auth-page">
      <div className="auth-card">
        <h2>Join Blogify Today</h2>
        <p className="auth-subtitle">Create your account to start your blogging journey.</p>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input type="text" id="fullname" placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary auth-btn">Create Account</button>
        </form>
        <p className="auth-actions">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
