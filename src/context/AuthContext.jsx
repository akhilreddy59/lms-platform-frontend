import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for active session
    const storedUser = localStorage.getItem('lms_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('lms_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call latency
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@xebia.com' && password === 'admin123') {
          const authenticatedUser = {
            email: 'admin@xebia.com',
            role: 'Admin',
            name: 'Xebia Administrator',
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80',
          };
          localStorage.setItem('lms_user', JSON.stringify(authenticatedUser));
          setUser(authenticatedUser);
          resolve(authenticatedUser);
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 800);
    });
  };

  const logout = () => {
    localStorage.removeItem('lms_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
