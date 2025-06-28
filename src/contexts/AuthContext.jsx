import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Verify token validity
      verifyToken();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      localStorage.removeItem("user");
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      // Use a lightweight endpoint to verify token (e.g., fetch user habits)
      await axios.get(`${import.meta.env.VITE_API_URL}/habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setError("");
    } catch (err) {
      const message = err.response?.data?.message || "Invalid token";
      if (err.response?.status === 401 || err.response?.status === 403) {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setError("Session expired, please log in again");
      }
    }
  };

  const login = async (identifier, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { identifier, password });
      const { token, username, email } = response.data;
      setToken(token);
      setUser({ username, email });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ username, email }));
      setError("");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { username, email, password });
      const { token } = response.data;
      setToken(token);
      setUser({ username, email });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ username, email }));
      setError("");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setError("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
