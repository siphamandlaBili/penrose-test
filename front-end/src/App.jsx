import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Pages
import Login from './pages/Login';
import OTPVerification from './pages/OTPVerification';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import ServicesDashboard from './pages/ServicesDashboard';
import SubscriptionsDashboard from './pages/SubscriptionsDashboard';
import Profile from './pages/Profile';

// Set up axios defaults
axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.withCredentials = true;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [socket, setSocket] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('/user/profile');
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    // Connect to Socket.IO server when authenticated
    if (isAuthenticated) {
      const newSocket = io('http://localhost:3000', {
        withCredentials: true
      });

      newSocket.on('connect', () => {
        console.log('Connected to Socket.IO server');
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [isAuthenticated]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route 
            path="/" 
            element={
              !isAuthenticated ? (
                <Login setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/verify-otp" 
            element={
              !isAuthenticated ? (
                <OTPVerification setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? (
                <Dashboard socket={socket} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="services" element={<ServicesDashboard />} />
            <Route path="subscriptions" element={<SubscriptionsDashboard />} />
            <Route path="profile" element={<Profile setIsAuthenticated={setIsAuthenticated} />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
    
}

export default App
