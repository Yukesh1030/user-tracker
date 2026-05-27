import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TrackingContext } from '../context/TrackingContext';
import { User, BookOpen, Shield, Clock, Compass, Cpu, Activity } from 'lucide-react';

// Import local generated illustrations
import aiNetworkGrid from '../assets/ai_network_grid.png';
import aiAnalyticsFlow from '../assets/ai_analytics_flow.png';

const Home = () => {
  const { user } = useContext(AuthContext);
  const tracking = useContext(TrackingContext);
  const coordinates = tracking ? tracking.coordinates : { latitude: null, longitude: null };

  return (
    <div className="animated-page">
      {/* Welcome header panel */}
      <div className="glass-panel home-welcome-panel">
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>
          Hello, <span style={{ color: '#02b305' }}>@{user?.username}</span>!
        </h1>
        <p>Welcome to your tracking workspace. Your active session metrics are monitored by our background engine.</p>
      </div>

      <div className="home-grid">
        {/* Left Column: AI features and Quick nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Quick Nav */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={18} style={{ color: 'var(--text-primary)' }} />
              Quick Navigation
            </h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Begin generating user logs! Read blogs to see how the session timer updates your stats in real-time.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/blogs" className="btn btn-primary">
                <BookOpen size={16} />
                Browse Blogs
              </Link>
              {user?.role === 'admin' && (
                <Link to="/dashboard" className="btn btn-secondary">
                  <Shield size={16} />
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* AI Tech integration showcase */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', marginTop: '1rem', marginBottom: '0.25rem', letterSpacing: '-0.02em' }}>
              AI Integration Systems
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Feature 1 */}
              <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <img src={aiNetworkGrid} alt="AI Neural Flow Telemetry" className="ai-showcase-img" />
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Cpu size={18} style={{ color: '#02b305' }} />
                    AI Neural Flow Telemetry
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Our AI models map route changes and stay duration logs. By analyzing active user telemetry vectors, the system can determine content engagement scoreboards in real-time.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <img src={aiAnalyticsFlow} alt="Predictive Traffic Clustering" className="ai-showcase-img" />
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={18} style={{ color: '#0ea5e9' }} />
                    Predictive Traffic Clustering
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Integrates with browser geolocation coordinates. Utilizing user latitude and longitude feeds, the system processes regional density maps to predict traffic demands.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: User details and Geolocation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Profile Card */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={18} />
              Profile Details
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Username</span>
                <strong>{user?.username}</strong>
              </div>
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</span>
                <strong>{user?.email || 'None'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>System Role</span>
                <span className={`user-badge ${user?.role === 'admin' ? 'admin' : ''}`} style={{ display: 'inline-flex', marginTop: '0.25rem' }}>
                  {user?.role === 'admin' ? 'Administrator' : 'Normal User'}
                </span>
              </div>
            </div>
          </div>

          {/* Location details */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={18} style={{ color: 'var(--accent-success)' }} />
              Live Geolocation
            </h3>
            {coordinates.latitude ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem' }}>Coordinates successfully captured from browser:</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <code className="table-badge page">Lat: {coordinates.latitude.toFixed(5)}</code>
                  <code className="table-badge page">Lng: {coordinates.longitude.toFixed(5)}</code>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Coordinates blocked or loading. Make sure you enable geolocation permission in your browser popups.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
