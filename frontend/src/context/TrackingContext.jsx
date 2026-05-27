import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const TrackingContext = createContext();

export const TrackingProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  const location = useLocation();
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });
  const [locationDenied, setLocationDenied] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0); // Navigation bar visual counter

  const pageStartTimeRef = useRef(Date.now());
  const lastHeartbeatTimeRef = useRef(Date.now());
  const locationRef = useRef(location.pathname);
  const coordinatesRef = useRef({ latitude: null, longitude: null });

  // Update refs to avoid closure stale state
  useEffect(() => {
    locationRef.current = location.pathname;
  }, [location.pathname]);

  // Request browser geolocation once
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoordinates(coords);
          coordinatesRef.current = coords;
          setLocationDenied(false);
        },
        (error) => {
          console.warn("Geolocation access denied or failed", error.message);
          setLocationDenied(true);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setLocationDenied(true);
    }
  }, []);

  // API helper to send activity logs
  const sendTrackingData = async (page, duration) => {
    if (!token) return; // Only track authenticated sessions
    if (duration <= 0) return;

    try {
      await axios.post('track/', {
        current_page: page,
        session_duration: duration,
        latitude: coordinatesRef.current.latitude,
        longitude: coordinatesRef.current.longitude,
      });
      console.log(`Tracked: ${page} for ${duration}s`);
    } catch (e) {
      console.error("Failed to send tracking data", e);
    }
  };

  // 1. Navigation tracking (when moving between pages)
  useEffect(() => {
    if (!token) return;

    const previousPage = locationRef.current;
    pageStartTimeRef.current = Date.now();
    lastHeartbeatTimeRef.current = Date.now();

    return () => {
      // Triggered on page unmount / route change
      const elapsedSeconds = Math.round((Date.now() - pageStartTimeRef.current) / 1000);
      sendTrackingData(previousPage, elapsedSeconds);
    };
  }, [location.pathname, token]);

  // 2. Periodic heartbeat & Navbar counter
  useEffect(() => {
    if (!token) return;

    // Reset navbar duration display on page change
    setSessionSeconds(0);

    const interval = setInterval(() => {
      // Update visual counter in navigation
      setSessionSeconds((prev) => prev + 1);

      // Check if we should send a heartbeat (every 20 seconds)
      const now = Date.now();
      const elapsedSinceHeartbeat = Math.round((now - lastHeartbeatTimeRef.current) / 1000);

      if (elapsedSinceHeartbeat >= 20) {
        sendTrackingData(locationRef.current, elapsedSinceHeartbeat);
        lastHeartbeatTimeRef.current = now;
        pageStartTimeRef.current = now; // reset session start for remainder calculation
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [location.pathname, token]);

  return (
    <TrackingContext.Provider value={{ coordinates, locationDenied, sessionSeconds }}>
      {children}
    </TrackingContext.Provider>
  );
};
