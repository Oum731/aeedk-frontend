import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
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
      return { success: true, message: "Inscription réussie." };
    } catch (err) {
      setError(err.response?.data?.error || "Erreur d'inscription");
      setLoading(false);
      return { success: false, error: err.response?.data?.error };
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  async function fetchUser() {
    setLoading(true);
    setError(null);
    try {
      if (!user?.id) throw new Error("Aucun utilisateur connecté");
      const res = await axios.get(`${API_URL}/user/${user.id}`);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      setUser(null);
      setError("Session expirée ou connexion impossible");
      localStorage.removeItem("user");
    }
    setLoading(false);
  }

  function updateUserInContext(userData) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
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
