import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Cpu, ShieldAlert, CheckCircle, ArrowLeft } from 'lucide-react';

const About = () => {
  return (
    <div className="animated-page" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={16} />
        Back to Landing
      </Link>

      <div className="glass-panel" style={{ padding: '3rem', borderTop: '4px solid var(--accent-primary)', marginBottom: '2rem' }}>
        <h1 className="neon-title" style={{ fontSize: '2.25rem', marginBottom: '1.25rem' }}>
          About User Tracking System
        </h1>
        <p style={{ fontSize: '1.05rem', marginBottom: '2rem' }}>
          The User Tracking System is designed as a centralized analytics system. It helps administrators monitor how readers browse content pages, which items get the most attention, where users access pages from, and how active sessions distribute globally.
        </p>

        <h3 style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Technological Framework
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div className="feature-icon-box" style={{ padding: '0.5rem', width: '36px', height: '36px', flexShrink: 0 }}>
              <Cpu size={16} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>React JS & Vite</h4>
              <p style={{ fontSize: '0.85rem' }}>Dynamic Single-Page client with Vanilla CSS styles, React Router, and a global active session timer tracker.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div className="feature-icon-box" style={{ padding: '0.5rem', width: '36px', height: '36px', flexShrink: 0, color: 'var(--accent-secondary)' }}>
              <Layers size={16} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Django REST Framework</h4>
              <p style={{ fontSize: '0.85rem' }}>Python API layer enforcing secure JWT tokens, custom user models, and aggregate database analytical summaries.</p>
            </div>
          </div>
        </div>

        <h3 style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Privacy & Security Standards
        </h3>
        <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          User transparency is a key element of the User Tracking System:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <CheckCircle size={16} style={{ color: 'var(--accent-success)', marginTop: '0.15rem', flexShrink: 0 }} />
            <span><strong>JWT Protections</strong>: Session tokens are stored securely in local storage. All endpoints (except auth routes) require authentication.</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <CheckCircle size={16} style={{ color: 'var(--accent-success)', marginTop: '0.15rem', flexShrink: 0 }} />
            <span><strong>User Permission Controls</strong>: Geolocation captures are only active if you explicitly grant permission in browser popups. Otherwise, coordinates default to blank.</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <CheckCircle size={16} style={{ color: 'var(--accent-success)', marginTop: '0.15rem', flexShrink: 0 }} />
            <span><strong>Clean Exit Logic</strong>: Background heartbeats ensure page stay records are stored even if you close the tab without clicking log out.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
