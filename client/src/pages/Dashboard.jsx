import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { socket } from '../services/socket';
import './Pages.css';

const PAGE_SIZE = 5;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Update token before connecting
    socket.auth.token = localStorage.getItem('token');
    
    // Connect the socket when the component mounts
    socket.connect();

    // Listen for connection
    socket.on('connect', () => {
      console.log('🌐 Connected to server with ID:', socket.id);
    });

    // Listen for disconnection
    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    // Listen for new posts
    socket.on('newPost', (data) => {
      console.log('🔔 New post received:', data);
      toast.success(data.message, {
        duration: 4000,
        position: 'top-right',
      });
      // Optionally refresh posts if on first page
      if (page === 1) {
        loadPosts(1);
      }
    });

    // Handle connection error
    socket.on('connect_error', (err) => {
      console.error('⚠️ Connection error:', err.message);
      if (err.message.includes('Authentication error')) {
        toast.error('Socket authentication failed. Please re-login.');
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('newPost');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [page, loadPosts]);


  const loadPosts = useCallback(async (pageNum) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/posts', {
        params: { page: pageNum, limit: PAGE_SIZE },
      });

      if (data.success) {
        setPosts(data.data || []);
        setPagination(data.pagination || null);
      } else {
        setError(data.message || 'Failed to load posts');
        setPosts([]);
        setPagination(null);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Failed to load posts';
      setError(message);
      setPosts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts(page);
  }, [page, loadPosts]);

  const goPrev = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const goNext = () => {
    if (pagination?.hasNextPage) {
      setPage((p) => p + 1);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="page-container dashboard-page">
      <header className="dashboard-header">
        <div>
          <h2>Dashboard</h2>
          <p>
            Welcome back, <strong>{user.name}</strong> ({user.email})!
          </p>
        </div>
        <div className="header-actions">
          <Link to="/posts/new" className="btn-primary">
            + Create New Post
          </Link>
          <button type="button" onClick={logout} className="btn-secondary logout-btn">
            Logout
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <label className="section-title">Your Posts</label>

        {loading && (
          <div className="dashboard-state dashboard-state--loading">Loading posts…</div>
        )}

        {!loading && error && (
          <div className="dashboard-state dashboard-state--error">
            <p>{error}</p>
            <button type="button" className="btn-secondary" onClick={() => loadPosts(page)}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="dashboard-state dashboard-state--empty">
            <p>No posts yet. Create your first post to see it here.</p>
            <Link to="/posts/new" className="btn-primary">
              Create a post
            </Link>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <>
            <div className="posts-list">
              {posts.map((post) => (
                <div className="post-item" key={post._id}>
                  <div className="post-info">
                    <h4>{post.title}</h4>
                    <p className="post-date">{formatDate(post.createdAt)}</p>
                    <p className="post-excerpt">{post.body.slice(0, 120)}{post.body.length > 120 ? '…' : ''}</p>
                  </div>
                  <div className="post-status">
                    <span className={`status-badge ${String(post.status).toLowerCase()}`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {pagination && pagination.totalPages > 0 && (
              <div className="pagination-bar">
                <p className="pagination-meta">
                  Page {pagination.page} of {pagination.totalPages} · {pagination.totalItems} post
                  {pagination.totalItems !== 1 ? 's' : ''}
                </p>
                <div className="pagination-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={goPrev}
                    disabled={!pagination.hasPrevPage}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={goNext}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
