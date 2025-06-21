import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }

    setLoading(false);
  }, []);

  async function login(identifier, password) {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/user/login`, {
        email: identifier,
        username: identifier,
        password,
      });
      const userData = res.data.user;
      const jwtToken = res.data.token;

      setUser(userData);
      setToken(jwtToken);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", jwtToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;

      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || "Erreur de connexion");
      setLoading(false);
      return { success: false, error: err.response?.data?.error };
    }
  }

  async function register(formData) {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/user/register`, formData);
      setLoading(false);
      return {
        success: true,
        message: "Inscription réussie. Vérifiez votre email.",
      };
    } catch (err) {
      setError(err.response?.data?.error || "Erreur d'inscription");
      setLoading(false);
      return { success: false, error: err.response?.data?.error };
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  }

  async function fetchUser() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/user/${user?.id}`);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      logout();
      setError("Session expirée ou connexion impossible");
    }
    setLoading(false);
  }

  function updateUserInContext(userData) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    register,
    login,
    logout,
    fetchUser,
    setError,
    updateUserInContext,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
