import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  async function login(email, password) {
    const res = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    localStorage.setItem("token", res.data.access_token);
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
