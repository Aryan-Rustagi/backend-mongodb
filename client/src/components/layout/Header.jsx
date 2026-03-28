import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">Blogify</Link>
        </div>
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          {user ? (
            <>
              <span className="nav-link nav-user">{user.name}</span>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button 
                onClick={logout} 
                className="nav-link logout-nav-btn"
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link btn-login">Login</Link>
              <Link to="/register" className="nav-link btn-register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
