import { useState, useLayoutEffect, createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext(null);

function readStoredSession() {
  try {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      return {
        user: JSON.parse(storedUser),
        token: storedToken,
      };
    }
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return { user: null, token: null };
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [{ user, token }, setSession] = useState(() => ({
    user: null,
    token: null,
  }));
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    /* Hydrate from localStorage once; guards need loading until this runs. */
    /* eslint-disable react-hooks/set-state-in-effect */
    setSession(readStoredSession());
    setLoading(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/users/login', { email, password });

      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        setSession({ user: data.data, token: data.token });
        return { success: true };
      }

      return {
        success: false,
        message: data.message || 'Login failed',
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setSession({ user: null, token: null });
    navigate('/login');
  }, [navigate]);

  const isAuthenticated = () => Boolean(user && token);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- hook is tied to AuthProvider for discoverability
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
