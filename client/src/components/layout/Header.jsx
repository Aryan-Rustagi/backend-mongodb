import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">Blogify</Link>
        </div>
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/login" className="nav-link btn-login">Login</Link>
          <Link to="/register" className="nav-link btn-register">Register</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
