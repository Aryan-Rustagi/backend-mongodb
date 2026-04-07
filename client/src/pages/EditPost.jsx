import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import './Pages.css';

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('draft');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/api/posts/${id}`);
        if (data.success) {
          setTitle(data.data.title);
          setBody(data.data.body);
          setStatus(data.data.status);
        } else {
          const message = data.message || 'Failed to fetch post';
          setError(message);
          toast.error(message);
        }
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Failed to fetch post';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { data } = await api.put(`/api/posts/${id}`, {
        title,
        body,
        status,
      });

      if (data.success) {
        toast.success('Post updated successfully');
        navigate('/dashboard');
        return;
      }

      const message = data.message || 'Could not update post';
      setError(message);
      toast.error(message);
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Could not update post';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container dashboard-page">
        <div className="dashboard-state dashboard-state--loading">
          Loading post data...
        </div>
      </div>
    );
  }

  return (
    <div className="page-container create-post-page">
      <div className="create-post-header">
        <div>
          <h2>Edit post</h2>
          <p className="create-post-sub">Modify your post content and settings.</p>
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
            {submitting ? 'Updating...' : 'Update post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
