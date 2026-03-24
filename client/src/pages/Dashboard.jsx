import { Link } from 'react-router-dom';
import './Pages.css';

const Dashboard = () => {
  // Placeholder posts list
  const posts = [
    { id: 1, title: 'Getting Started with React Router v6', status: 'Published', date: '2026-03-22' },
    { id: 2, title: 'Clean Architecture in Node.js Backend', status: 'Draft', date: '2026-03-24' },
    { id: 3, title: 'How to build beautiful UIs with glassmorphism', status: 'Published', date: '2026-02-18' },
  ];

  return (
    <div className="page-container dashboard-page">
      <header className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back, Writer! Organize your articles together.</p>
        </div>
        <button className="btn-primary">+ Create New Post</button>
      </header>

      <section className="dashboard-content">
        <label className="section-title">Your Posts</label>
        
        <div className="posts-list">
          {posts.map(post => (
            <div className="post-item" key={post.id}>
              <div className="post-info">
                <h4>{post.title}</h4>
                <p className="post-date">{post.date}</p>
              </div>
              <div className="post-status">
                <span className={`status-badge ${post.status.toLowerCase()}`}>
                  {post.status}
                </span>
                <Link to={`/posts/${post.id}`} className="btn-secondary btn-sm">Edit</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
