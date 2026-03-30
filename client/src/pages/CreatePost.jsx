import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import './Pages.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('draft');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { data } = await api.post('/api/posts', {
        title,
        body,
        status,
      });

      if (data.success) {
        navigate('/dashboard');
        return;
      }

      setError(data.message || 'Could not create post');
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Could not create post';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container create-post-page">
      <div className="create-post-header">
        <div>
          <h2>New post</h2>
          <p className="create-post-sub">Write something for your Blogify feed.</p>
        </div>
        <Link to="/dashboard" className="btn-secondary">
          Back to dashboard
        </Link>
      </div>

      <div className="create-post-card">
        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form create-post-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="post-title">Title</label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title"
              required
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="post-body">Content</label>
            <textarea
              id="post-body"
              className="form-textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your post..."
              required
              rows={12}
            />
          </div>

          <div className="form-group">
            <label htmlFor="post-status">Status</label>
            <select
              id="post-status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <button type="submit" className="btn-primary auth-btn" disabled={submitting}>
            {submitting ? 'Publishing...' : 'Save post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
