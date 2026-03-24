import { Link } from 'react-router-dom';
import './Pages.css';

const Home = () => {
  return (
    <div className="page-container home-page">
      <section className="hero-section">
        <h1 className="hero-title">
          Share your ideas with the <span className="highlight-text">world</span>.
        </h1>
        <p className="hero-subtitle">
          Write, read, and connect with other creators on the ultimate blogging platform. No algorithms, just your words.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-primary">Start Writing</Link>
          <Link to="#explore" className="btn-secondary">Explore Posts</Link>
        </div>
      </section>

      <section className="features-section" id="explore">
        <div className="feature-card">
          <h3>✍️ Simple Editor</h3>
          <p>Focus on what matters most—your writing. Rich markdown support built-in.</p>
        </div>
        <div className="feature-card">
          <h3>💬 Connect & Engage</h3>
          <p>Read beautifully typeset blogs and interact with the creator community.</p>
        </div>
        <div className="feature-card">
          <h3>⚡ Lightning Fast</h3>
          <p>Optimized for speed. Your readers won't wait. No bloatware or trackers.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
