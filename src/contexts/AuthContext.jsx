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
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setToken(savedToken);
          const res = await axios.get(`${API_URL}/user/${parsedUser.id}`, {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          updateUserInContext(res.data);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const tk = token || localStorage.getItem("token");
        if (tk) config.headers.Authorization = `Bearer ${tk}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) logout();
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_URL}/user/login`, {
        identifier,
        password,
      });

      const { user: userData, token: jwtToken } = res.data;

      if (!userData.confirmed) {
        throw new Error(
          "Veuillez confirmer votre email avant de vous connecter."
        );
      }

      updateUserInContext(userData);
      setToken(jwtToken);
      localStorage.setItem("token", jwtToken);

      return { success: true };
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.message || "Erreur de connexion";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/user/register`, formData);
      return {
        success: true,
        message: "Inscription réussie. Vérifiez votre email.",
      };
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Erreur d'inscription";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const fetchUser = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_URL}/user/${user.id}`);
      updateUserInContext(res.data);
    } catch {
      setError("Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  const updateUserInContext = (userData, bustAvatarCache = false) => {
    const updatedUser = {
      ...userData,
      avatar: getAvatarUrl(userData.avatar, bustAvatarCache),
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

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

export const useAuth = () => useContext(AuthContext);
