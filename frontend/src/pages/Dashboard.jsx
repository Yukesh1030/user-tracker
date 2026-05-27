import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Activity, 
  Clock, 
  UserCheck, 
  MapPin, 
  BarChart, 
  ListFilter, 
  RefreshCw, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icons in Vite build environment
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalytics = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    
    try {
      const response = await axios.get('analytics/');
      setData(response.data);
      setError('');
    } catch (err) {
      console.error("Error fetching analytics data", err);
      setError("Failed to load analytics dashboard data. Please verify your administrative access.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Auto-refresh metrics every 10 seconds for real-time tracking
    const interval = setInterval(() => {
      fetchAnalytics(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Format elapsed seconds (e.g. 125s -> 2m 5s)
  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  // Format date/timestamp to readable local time
  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + 
           ' ' + date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="loading-spinner" size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <p>Gearing up the analytics dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="alert alert-danger" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => fetchAnalytics()}>
            <RefreshCw size={16} /> Retry loading
          </button>
        </div>
      </div>
    );
  }

  const { metrics, page_visits, locations, logs } = data;

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

  return (
    <div className="dashboard-grid">
      {/* Top Title and Actions */}
      <div className="dashboard-header">
        <div>
          <h1>System Control Dashboard</h1>
          <p>Real-time administrator analysis of active traffic, engagement, and user geography.</p>
        </div>
        <div className="refresh-container">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {refreshing ? 'Updating metrics...' : 'Updates automatically (10s)'}
          </span>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'spin-anim' : ''} style={refreshing ? { animation: 'spin 1s linear infinite' } : {}} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metric-cards-row">
        <div className="glass-panel metric-card">
          <div className="metric-icon-wrapper">
            <Users size={20} />
          </div>
          <div className="metric-info">
            <h4>Total Registered</h4>
            <div className="metric-value">{metrics.total_users}</div>
          </div>
        </div>

        <div className="glass-panel metric-card active">
          <div className="metric-icon-wrapper" style={{ color: 'var(--accent-success)' }}>
            <Activity size={20} />
          </div>
          <div className="metric-info">
            <h4>Online Users</h4>
            <div className="metric-value">{metrics.active_users}</div>
          </div>
        </div>

        <div className="glass-panel metric-card duration">
          <div className="metric-icon-wrapper" style={{ color: 'var(--accent-secondary)' }}>
            <Clock size={20} />
          </div>
          <div className="metric-info">
            <h4>Avg Stay Duration</h4>
            <div className="metric-value">{formatDuration(Math.round(metrics.avg_session_duration))}</div>
          </div>
        </div>

        <div className="glass-panel metric-card user">
          <div className="metric-icon-wrapper" style={{ color: 'var(--accent-warning)' }}>
            <UserCheck size={20} />
          </div>
          <div className="metric-info">
            <h4>Most Active</h4>
            <div className="metric-value" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>
              {metrics.most_active_user}
            </div>
          </div>
        </div>
      </div>

      {/* Visualizations Row */}
      <div className="visuals-row">
        {/* Recharts Bar Chart */}
        <div className="glass-panel chart-panel">
          <h3 className="panel-title">
            <BarChart size={18} style={{ color: 'var(--accent-primary)' }} />
            Page Popularity (Visits)
          </h3>
          <div className="chart-container">
            {page_visits.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No visits logged yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={page_visits}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis 
                    dataKey="page" 
                    stroke="var(--text-secondary)" 
                    fontSize={11}
                    tickFormatter={(val) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                  />
                  <YAxis stroke="var(--text-secondary)" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ 
                      background: 'var(--bg-secondary)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <Bar dataKey="views" fill="var(--accent-primary)" radius={[4, 4, 0, 0]}>
                    {page_visits.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Leaflet Map panel */}
        <div className="glass-panel map-panel">
          <h3 className="panel-title">
            <MapPin size={18} style={{ color: 'var(--accent-secondary)' }} />
            User Locations Heatmap
          </h3>
          <div className="map-container-wrapper">
            <MapContainer 
              center={[20, 0]} 
              zoom={2} 
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {locations.map((loc, idx) => (
                <Marker key={idx} position={[loc.latitude, loc.longitude]}>
                  <Popup>
                    <div>
                      <div className="map-popup-title">@{loc.username}</div>
                      <div className="map-popup-text">
                        <b>Page:</b> <code className="table-badge page">{loc.page}</code>
                      </div>
                      <div className="map-popup-text" style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Last Active: {formatTimestamp(loc.timestamp)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            {locations.length === 0 && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  width: '100%', 
                  height: '100%', 
                  background: 'rgba(10, 10, 15, 0.7)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  zIndex: 400,
                  fontSize: '0.9rem'
                }}
              >
                No active geolocated users online.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel table-panel">
        <div className="table-header-row">
          <h3 className="panel-title" style={{ margin: 0 }}>
            <ListFilter size={18} style={{ color: 'var(--accent-hover)' }} />
            Real-Time User Activity Logs
          </h3>
          <span className="table-badge" style={{ padding: '0.35rem 0.75rem' }}>
            Showing last 100 activities
          </span>
        </div>

        <div className="table-wrapper">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Page Path</th>
                <th>Stay Duration</th>
                <th>Location</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No tracking activity recorded in database yet. Log in as a normal user to generate traffic logs!
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>@{log.username}</span>
                    </td>
                    <td>
                      <code className="table-badge page">{log.page}</code>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                        {formatDuration(log.duration)}
                      </span>
                    </td>
                    <td>
                      {log.location === "Blocked" ? (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Blocked</span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                          <MapPin size={12} style={{ color: 'var(--accent-secondary)' }} />
                          {log.location}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
