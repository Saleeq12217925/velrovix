import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const readStoredAuth = () => {
  try {
    return {
      user: JSON.parse(localStorage.getItem('velrovix_user')) || null,
      token: localStorage.getItem('velrovix_token') || null,
    };
  } catch {
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedAuth = readStoredAuth();
    setUser(storedAuth.user);
    setToken(storedAuth.token);
  }, []);

  const login = (authPayload) => {
    const nextUser = authPayload?.user || null;
    const nextToken = authPayload?.token || null;

    setUser(nextUser);
    setToken(nextToken);

    if (nextUser) {
      localStorage.setItem('velrovix_user', JSON.stringify(nextUser));
    }

    if (nextToken) {
      localStorage.setItem('velrovix_token', nextToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('velrovix_user');
    localStorage.removeItem('velrovix_token');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
