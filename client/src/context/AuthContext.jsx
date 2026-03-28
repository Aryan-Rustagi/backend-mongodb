import { useState, createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [{ user, token }, setSession] = useState(readStoredSession);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/users/login', { email, password });

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

  // Session is restored synchronously in useState(readStoredSession); no async boot step.
  const loading = false;

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
