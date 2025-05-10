// src/lib/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://record-backend-a5nk.onrender.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setIsAuthenticated(!!storedToken);
    setToken(storedToken);
    setLoading(false);
  }, []);

  async function login(email, password) {
    try {
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.access_token);
      setToken(res.data.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Let the caller handle (e.g., show toast)
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loading, token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
