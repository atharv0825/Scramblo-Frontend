import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserDetails } from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user on app start if token exists
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        setIsLoggedIn(true);

        try {
          const res = await getUserDetails();
          setUser(res.data);
        } catch (err) {
          console.error("Error loading user", err);
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // ✅ Login
  const login = async (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);

    try {
      const res = await getUserDetails();
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user after login", err);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await getUserDetails();
      setUser(res.data);
    } catch (err) {
      console.error("Error refreshing user", err);
    }
  };
  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};