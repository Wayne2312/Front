import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("AuthContext: Token state:", token);
    if (token) {
      console.log("AuthContext: Setting axios Authorization header:", `Bearer ${token}`);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      console.log("AuthContext: No token, removing Authorization header");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      localStorage.removeItem("user");
      setError("Please log in to continue");
    }
  }, [token]);

  axios.interceptors.request.use(
    (config) => {
      console.log("AuthContext: Outgoing request:", {
        url: config.url,
        headers: config.headers,
      });
      return config;
    },
    (error) => {
      console.error("AuthContext: Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  const login = async (identifier, password, navigate) => {
    try {
      console.log("AuthContext: Logging in with identifier:", identifier);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { identifier, password });
      const { token, username, email } = response.data;
      console.log("AuthContext: Login successful, token:", token);
      setToken(token);
      setUser({ username, email });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ username, email }));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setError("");
      navigate("/dashboard");
      return { username, email };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      console.error("AuthContext: Login error:", err.response?.data || err.message);
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (username, email, password, navigate) => {
    try {
      console.log("AuthContext: Registering user:", username);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { username, email, password });
      const { token } = response.data;
      console.log("AuthContext: Registration successful, token:", token);
      setToken(token);
      setUser({ username, email });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ username, email }));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setError("");
      navigate("/dashboard");
      return { username, email };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      console.error("AuthContext: Registration error:", err.response?.data || err.message);
      setError(message);
      throw new Error(message);
    }
  };

  const logout = (navigate) => {
    console.log("AuthContext: Logging out user");
    setToken(null);
    setUser(null);
    setError("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const verifyToken = async (navigate) => {
    if (!token) {
      console.log("AuthContext: No token, redirecting to login");
      setError("Please log in to continue");
      navigate("/login");
      return;
    }
    try {
      console.log("AuthContext: Verifying token with GET /api/habits");
      await axios.get(`${import.meta.env.VITE_API_URL}/habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("AuthContext: Token verified successfully");
      setError("");
    } catch (err) {
      console.error("AuthContext: Token verification failed:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log("AuthContext: Unauthorized, logging out");
        logout(navigate);
      }
      setError("Session expired, please log in again");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, error, verifyToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
