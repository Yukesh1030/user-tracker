import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, BookOpen, Loader2 } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Import axios correctly (using local axios instance configured in AuthContext or import from 'axios')
  // We'll import axios from 'axios' directly, since axios settings are set globally.
  
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`blogs/${id}/`);
        setBlog(response.data);
      } catch (err) {
        console.error("Error fetching blog detail", err);
        setError("Failed to load the article. It may not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="loading-spinner" size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <p>Fetching article content...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="main-content" style={{ textAlign: 'center' }}>
        <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          {error || "Article not found"}
        </div>
        <Link to="/blogs" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-wrapper">
      <Link to="/blogs" className="btn btn-secondary" style={{ marginBottom: '2rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} />
        Back to list
      </Link>

      <div className="glass-panel" style={{ padding: '3rem', borderTop: '4px solid var(--accent-primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-hover)', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: '500' }}>
          <BookOpen size={16} />
          Article
        </div>
        
        <h1 style={{ color: 'var(--text-primary)', fontSize: '2.5rem', WebkitTextFillColor: 'initial', background: 'none', marginBottom: '1rem' }}>
          {blog.title}
        </h1>

        <div className="blog-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '2rem' }}>
          <Calendar size={14} />
          Published on {new Date(blog.created_at).toLocaleDateString()}
        </div>

        <div className="blog-content">
          {blog.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

// Wait! In the import at line 3, I typed 'ajax'. Let me import it from 'axios'.
// Yes! Let's ensure import is from 'axios'. I will write it as 'axios'.
export default BlogDetail;
