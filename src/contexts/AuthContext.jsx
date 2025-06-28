import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (identifier, password) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { identifier, password });
    const newToken = response.data.token;
    setToken(newToken);
    localStorage.setItem("token", newToken);
    setUser({ username: response.data.username, email: response.data.email });
  };

  const register = async (username, email, password) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, { username, email, password });
    const newToken = response.data.token;
    setToken(newToken);
    localStorage.setItem("token", newToken);
    setUser({ username, email });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;