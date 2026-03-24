import { Link } from 'react-router-dom';
import './Pages.css';

const NotFound = () => {
  return (
    <div className="page-container notfound-page">
      <section className="error-section">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary">Go back home</Link>
      </section>
    </div>
  );
};

export default NotFound;
