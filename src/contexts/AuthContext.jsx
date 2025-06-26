import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import API_URL from "../config";

const DEFAULT_AVATAR = "/default-avatar.png";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const tk = token || localStorage.getItem("token");
        if (tk) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${tk}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if ([401, 403].includes(error.response?.status)) logout();
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      if (savedUser && savedToken) {
        let userObj = JSON.parse(savedUser);
        setToken(savedToken);
        userObj = fixAvatar(userObj);
        setUser(userObj);
        try {
          const res = await axios.get(`${API_URL}/user/${userObj.id}`);
          const latestUser = res.data.user || res.data;
          if (latestUser?.id) updateUserInContext(latestUser);
          else setError("Impossible de retrouver l'utilisateur.");
        } catch (err) {
          if ([401, 403].includes(err.response?.status)) logout();
          else setError("Erreur réseau temporaire, veuillez réessayer.");
        }
      }
      setLoading(false);
    };
    initializeAuth();
    // eslint-disable-next-line
  }, []);

  const fixAvatar = (userObj) => {
    if (
      !userObj.avatar ||
      typeof userObj.avatar !== "string" ||
      userObj.avatar.trim() === "" ||
      userObj.avatar === "avatar.jpeg"
    ) {
      userObj.avatar = DEFAULT_AVATAR;
    }
    if (
      !userObj.avatar_url ||
      typeof userObj.avatar_url !== "string" ||
      userObj.avatar_url.trim() === "" ||
      userObj.avatar_url === "avatar.jpeg"
    ) {
      userObj.avatar_url = userObj.avatar;
    }
    return userObj;
  };

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/user/login`, {
        identifier,
        password,
      });
      const { user: userData, token: jwtToken } = res.data;
      if (!userData?.confirmed) {
        return {
          success: false,
          error: "Veuillez confirmer votre email avant de vous connecter.",
        };
      }
      updateUserInContext(userData);
      setToken(jwtToken);
      localStorage.setItem("token", jwtToken);
      return { success: true };
    } catch (err) {
      let errorMsg = "Erreur de connexion";
      if (err.response?.status === 422 && err.response.data?.errors) {
        errorMsg = Object.values(err.response.data.errors).flat().join(" / ");
      } else {
        errorMsg = err.response?.data?.error || err.message || errorMsg;
      }
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
      let errorMsg = "Erreur d'inscription";
      if (err.response?.status === 422 && err.response.data?.errors) {
        errorMsg = Object.values(err.response.data.errors).flat().join(" / ");
      } else {
        errorMsg = err.response?.data?.error || errorMsg;
      }
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const fetchUser = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/user/${user.id}`);
      const userObj = res.data.user || res.data;
      if (userObj?.id) {
        updateUserInContext(userObj);
      } else {
        setError("Erreur lors de la mise à jour du profil");
      }
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) logout();
      setError("Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  const updateUserInContext = (userData) => {
    if (!userData?.id) {
      logout();
      return;
    }
    userData = fixAvatar(userData);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
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
