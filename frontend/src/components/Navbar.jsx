import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TrackingContext } from '../context/TrackingContext';
import { LogOut, BookOpen, BarChart3, Clock, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { sessionSeconds } = useContext(TrackingContext) || { sessionSeconds: 0 };
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Format seconds to mm:ss format
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate(user?.role === 'admin' ? '/dashboard' : '/blogs')}>
        <BarChart3 className="accent-icon" size={24} style={{ color: '#8b5cf6' }} />
        <span>Vanguard Analytics</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {user && (
          <ul className="nav-links">
            <li>
              <NavLink to="/blogs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <BookOpen size={16} />
                  Blogs
                </div>
              </NavLink>
            </li>
            {user.role === 'admin' && (
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <BarChart3 size={16} />
                    Dashboard
                  </div>
                </NavLink>
              </li>
            )}
          </ul>
        )}

        <div className="nav-actions">
          {user ? (
            <>
              {/* Pulse timer tracking duration */}
              <div className="timer-badge" title="Time spent on current page">
                <div className="timer-dot"></div>
                <Clock size={14} style={{ marginRight: '2px' }} />
                <span>{formatTime(sessionSeconds)}</span>
              </div>

              {/* User role details */}
              <div className={`user-badge ${user.role}`}>
                <UserIcon size={14} />
                <span>{user.username}</span>
              </div>

              <button className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={handleLogout}>
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
