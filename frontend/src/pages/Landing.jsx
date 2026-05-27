import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MapPin, Shield, Activity, ArrowRight, Gauge, Layers, Play } from 'lucide-react';

const Landing = () => {
  const { token } = useContext(AuthContext);

  return (
    <div className="hero-section animated-page">
      {/* Centered Antigravity-style badge */}
      <div className="hero-badge-logo fade-in-el">
        <div className="hero-badge-logo-dot" style={{ backgroundColor: '#05fa09', color: '#000000' }}>▲</div>
        <span>User Tracking System</span>
      </div>
      
      {/* Huge bold display heading */}
      <h1 className="fade-in-el" style={{ maxWidth: '850px', margin: '0 auto 1.5rem auto' }}>
        Experience liftoff with the next-gen tracking system
      </h1>
      
      {/* Subtitle */}
      <p className="hero-subtitle fade-in-el">
        A centralized, real-time analytics platform monitoring user interactions, sessions duration, page routes activity, and geography tracking.
      </p>

      {/* Pill-shaped buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }} className="fade-in-el">
        {token ? (
          <>
            <Link to="/home" className="btn btn-primary">
              <Play size={15} style={{ fill: 'currentColor' }} />
              Enter Workspace
            </Link>
            <Link to="/blogs" className="btn btn-secondary">
              Browse Blogs
            </Link>
          </>
        ) : (
          <>
            <Link to="/register" className="btn btn-primary">
              Get Started for Free
              <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </>
        )}
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        <div className="feature-item">
          <div className="feature-icon-box">
            <Activity size={20} />
          </div>
          <h3>Session Analytics</h3>
          <p>Collects live stay duration statistics for each page and triggers exit cleanup saves automatically when you leave.</p>
        </div>

        <div className="feature-item">
          <div className="feature-icon-box" style={{ color: 'var(--accent-secondary)' }}>
            <MapPin size={20} />
          </div>
          <h3>Location Heatmap</h3>
          <p>Maps user locations in real time on an interactive dark/light world map layout utilizing latitude and longitude metrics.</p>
        </div>

        <div className="feature-item">
          <div className="feature-icon-box" style={{ color: 'var(--accent-success)' }}>
            <Gauge size={20} />
          </div>
          <h3>Centralized Console</h3>
          <p>Admin panel provides live statistics cards, Recharts page views breakdown, and scrollable logs tracking user history.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
