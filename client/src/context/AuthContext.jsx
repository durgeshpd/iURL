import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = (token) => {
    setToken(token);
    localStorage.setItem('token', token); // Save token in localStorage
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
