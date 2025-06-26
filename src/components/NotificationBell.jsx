import React, { useEffect, useState, useRef } from "react";
import { Bell, CheckCircle, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import API_URL from "../config";

export default function NotificationBell() {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnreadCount = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/notifications/unread_count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(res.data.unread_count || 0);
    } catch {}
  };

  const fetchNotifications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data || []);
      setUnreadCount(res.data.filter((n) => !n.is_read).length);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchUnreadCount();
  }, [token]);

  const markAsRead = async (id) => {
    if (!token) return;
    try {
      await axios.post(
        `${API_URL}/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Notifications"
        className="relative focus:outline-none"
        onClick={() => {
          if (!open) fetchNotifications();
          setOpen(!open);
        }}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white border rounded shadow-lg z-50">
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-semibold text-lg">Notifications</h3>
            <button
              aria-label="Fermer"
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          {loading && <p className="p-4">Chargement...</p>}
          {!loading && notifications.length === 0 && (
            <p className="p-4 text-center text-gray-600">Aucune notification</p>
          )}
          {!loading &&
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 border-b last:border-none cursor-pointer flex justify-between items-center ${
                  notif.is_read ? "bg-gray-50" : "bg-blue-50 font-semibold"
                }`}
                onClick={() => markAsRead(notif.id)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") markAsRead(notif.id);
                }}
              >
                <span>{notif.message}</span>
                {notif.is_read && (
                  <CheckCircle size={16} className="text-green-600" />
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
