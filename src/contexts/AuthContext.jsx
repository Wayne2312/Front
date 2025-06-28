import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [error, setError] = useState('');

  console.log('AuthProvider: Initializing with user:', user, 'token:', token);

  useEffect(() => {
    console.log('AuthProvider: Token state:', token);
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      localStorage.removeItem('user');
      setError('Please log in to continue');
    }
  }, [token]);

  const login = async (identifier, password, navigate) => {
    try {
      console.log('AuthProvider: Logging in with identifier:', identifier);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { identifier, password });
      const { token, username, email } = response.data;
      console.log('AuthProvider: Login successful, token:', token);
      setToken(token);
      setUser({ username, email });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username, email }));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setError('');
      navigate('/dashboard');
      return { username, email };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      console.error('AuthProvider: Login error:', err.response?.data || err.message);
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (username, email, password, navigate) => {
    try {
      console.log('AuthProvider: Registering user:', username);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { username, email, password });
      const { token } = response.data;
      console.log('AuthProvider: Registration successful, token:', token);
      setToken(token);
      setUser({ username, email });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username, email }));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setError('');
      navigate('/dashboard');
      return { username, email };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      console.error('AuthProvider: Registration error:', err.response?.data || err.message);
      setError(message);
      throw new Error(message);
    }
  };

  const logout = (navigate) => {
    console.log('AuthProvider: Logging out');
    setToken(null);
    setUser(null);
    setError('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const verifyToken = async (navigate) => {
    if (!token) {
      console.log('AuthProvider: No token, redirecting to login');
      setError('Please log in to continue');
      navigate('/login');
      return;
    }
    try {
      console.log('AuthProvider: Verifying token');
      await axios.get(`${import.meta.env.VITE_API_URL}/habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('AuthProvider: Token verified');
      setError('');
    } catch (err) {
      console.error('AuthProvider: Token verification failed:', err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('AuthProvider: Unauthorized, logging out');
        logout(navigate);
      }
      setError('Session expired, please log in again');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, error, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
