import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TrackingContext } from '../context/TrackingContext';
import { BookOpen, Calendar, ArrowRight, Loader2, Navigation } from 'lucide-react';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const tracking = useContext(TrackingContext);
  const locationDenied = tracking ? tracking.locationDenied : false;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('blogs/');
        setBlogs(response.data);
      } catch (err) {
        console.error("Error fetching blogs", err);
        setError("Failed to load blogs. Please ensure your backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="loading-spinner" size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <p>Loading the latest content...</p>
      </div>
    );
  }

  return (
    <div className="blog-list-wrapper">
      <div className="blog-header">
        <h1>Vanguard Insights</h1>
        <p>Explore articles on React, APIs, analytics dashboards, and web development.</p>
        
        {locationDenied && (
          <div className="geo-disclaimer">
            <Navigation size={14} />
            <span>Geolocation is blocked. Geolocation coordinates will not be tracked on the map dashboard until permissions are granted.</span>
          </div>
        )}
      </div>

      {error ? (
        <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '0 auto' }}>
          {error}
        </div>
      ) : blogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No blog posts found. Check backend seeding status.</p>
        </div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <div className="glass-panel blog-card" key={blog.id}>
              <div>
                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-excerpt">{blog.content}</p>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span className="blog-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} />
                    {new Date(blog.created_at).toLocaleDateString()}
                  </span>
                  <Link to={`/blogs/${blog.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                    Read More
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
