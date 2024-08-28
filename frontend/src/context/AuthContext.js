import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component that will wrap the app
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, role: null });

  // Check for an existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAuth({ token, role: decodedToken.role });
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, []);

  const login = (token) => {
    const decodedToken = jwtDecode(token);
    setAuth({ token, role: decodedToken.role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setAuth({ token: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
