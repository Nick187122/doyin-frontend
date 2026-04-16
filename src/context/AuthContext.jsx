import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { AUTH_TOKEN_KEY, DEVICE_TOKEN_KEY } from '../services/api';

const AuthContext = createContext(null);

function getDeviceToken() {
  let token = sessionStorage.getItem(DEVICE_TOKEN_KEY);

  if (!token) {
    token = crypto.randomUUID();
    sessionStorage.setItem(DEVICE_TOKEN_KEY, token);
  }

  return token;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/me');
      setUser(res.data.user);
      setMustChangePassword(res.data.must_change_password);
    } catch {
      setUser(null);
      setMustChangePassword(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = async (email, password) => {
    const deviceToken = getDeviceToken();
    const res = await api.post('/login', { email, password, device_token: deviceToken });

    sessionStorage.setItem(AUTH_TOKEN_KEY, res.data.token);
    setUser(res.data.user);
    setMustChangePassword(res.data.must_change_password);

    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {}

    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(DEVICE_TOKEN_KEY);
    setUser(null);
    setMustChangePassword(false);
  };

  const onPasswordChanged = (token) => {
    if (token) {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    setMustChangePassword(false);
  };

  return (
    <AuthContext.Provider value={{ user, mustChangePassword, loading, login, logout, onPasswordChanged }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
