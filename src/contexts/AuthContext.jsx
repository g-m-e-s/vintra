import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        // In a real app, we would check a stored token's validity
        const storedUser = localStorage.getItem('vintra_user');
        
        if (storedUser) {
          // For demo purposes, we'll simply use the stored user
          // In a real app, this would verify the token with the server
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        setError('Failed to authenticate user');
        // Clear any potentially corrupted storage
        localStorage.removeItem('vintra_user');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (password) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call the API
      // For demo, we'll simulate the authentication
      const user = await authService.login(password);
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('vintra_user', JSON.stringify(user));
        return true;
      } else {
        setError('Invalid credentials');
        return false;
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear user data
    setCurrentUser(null);
    localStorage.removeItem('vintra_user');
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    error,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
