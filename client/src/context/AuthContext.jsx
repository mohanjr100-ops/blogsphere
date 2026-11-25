import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { TOKEN_STORAGE_KEY } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        register,
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
