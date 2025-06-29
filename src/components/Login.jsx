import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Configure axios interceptors (could also be moved to a separate config file)
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  axios.interceptors.response.use(response => response, error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      navigate('/login');
    }
    return Promise.reject(error);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
        identifier,
        password
      });

      // Store token and user data
      localStorage.setItem('authToken', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      // Update app state and redirect
      onLogin({ 
        username: response.data.username, 
        email: response.data.email 
      });
      navigate('/');

    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
            Username or Email
          </label>
          <input
            id="identifier"
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
            minLength="6"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-2 rounded text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
