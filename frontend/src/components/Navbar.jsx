import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TrackingContext } from '../context/TrackingContext';
import { LogOut, BookOpen, BarChart3, Clock, User as UserIcon, Home, Info } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { sessionSeconds } = useContext(TrackingContext) || { sessionSeconds: 0 };
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <nav className="navbar">
      {/* Caret Logo Badge styled after the screenshot */}
      <div className="nav-logo" onClick={() => navigate(user ? '/home' : '/')}>
        <div className="nav-logo-icon" style={{ backgroundColor: '#05fa09', color: '#000000', marginRight: '0.25rem' }}>▲</div>
        <span>User Tracking System</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <ul className="nav-links">
          {user ? (
            <>
              <li>
                <NavLink to="/home" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <Home size={15} />
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/blogs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <BookOpen size={15} />
                  Blogs
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <Home size={15} />
                Landing
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Info size={15} />
              About
            </NavLink>
          </li>
          {user?.role === 'admin' && (
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <BarChart3 size={15} />
                Dashboard
              </NavLink>
            </li>
          )}
        </ul>

        <div className="nav-actions">
          {user ? (
            <>
              {/* Page stay timer */}
              <div className="timer-badge" title="Session duration on current page">
                <div className="timer-dot"></div>
                <Clock size={13} style={{ marginRight: '1px' }} />
                <span>{formatTime(sessionSeconds)}</span>
              </div>

              {/* User badge details */}
              <div className={`user-badge ${user.role}`}>
                <UserIcon size={13} />
                <span>{user.username}</span>
              </div>

              <button className="btn btn-secondary" style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }} onClick={handleLogout}>
                <LogOut size={13} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link" style={{ padding: '0.5rem 0.75rem' }}>Login</NavLink>
              <NavLink to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
