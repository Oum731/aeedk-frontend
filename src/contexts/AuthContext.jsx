import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import API_URL from "../config";
import { getAvatarUrl } from "../utils/avatarUrl";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const tk = token || localStorage.getItem("token");
        if (tk) config.headers.Authorization = `Bearer ${tk}`;
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  async function login(identifier, password) {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/user/login`, {
        identifier,
        password,
      });
      const { user: userData, token: jwtToken } = res.data;
      if (!userData.confirmed) {
        setError(
          "Veuillez confirmer votre adresse email avant de vous connecter."
        );
        setLoading(false);
        return { success: false, error: "Email non confirmé." };
      }
      setUser(userData);
      setToken(jwtToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", jwtToken);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Erreur de connexion";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }

  async function register(formData) {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/user/register`, formData);
      return {
        success: true,
        message: "Inscription réussie. Vérifiez votre email.",
      };
    } catch (err) {
      const msg = err.response?.data?.error || "Erreur d'inscription";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  async function fetchUser() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/user/${user?.id}`);
      const newUser = {
        ...res.data,
        avatar: getAvatarUrl(res.data.avatar, true),
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (err) {
      logout();
      setError("Session expirée ou connexion impossible");
    } finally {
      setLoading(false);
    }
  }

  function updateUserInContext(userData, bustAvatarCache = false) {
    const updatedUser = {
      ...userData,
      avatar: getAvatarUrl(userData.avatar, bustAvatarCache),
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
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
