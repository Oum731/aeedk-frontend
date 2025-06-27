import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil, Shield, ShieldOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const API_URL =
  import.meta.env.VITE_API_URL || "https://aeedk-backend.onrender.com/api";

function getAge(birth_date) {
  if (!birth_date) return "-";
  const dob = new Date(birth_date);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const color =
    type === "success"
      ? "bg-green-50 border-green-400 text-green-700"
      : type === "error"
      ? "bg-red-50 border-red-400 text-red-700"
      : "bg-blue-50 border-blue-400 text-blue-700";
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      style={{ background: "rgba(0,0,0,0.13)", animation: "fadeIn 0.17s" }}
      onClick={onClose}
    >
      <div
        className={`px-5 py-3 border rounded-xl shadow-lg flex items-center gap-3 min-w-[200px] max-w-xs ${color} text-center`}
        onClick={(e) => e.stopPropagation()}
      >
        {type === "success" ? (
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : type === "error" ? (
          <svg
            className="w-5 h-5 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : null}
        <div>{msg}</div>
      </div>
    </div>
  );
}

export default function UserManager({ onNavigate }) {
  const { user, token, updateUserInContext, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "membre",
    confirmed: false,
    sub_prefecture: "",
    village: "",
    birth_date: "",
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [toast, setToast] = useState({ msg: "", type: "" });

  useEffect(() => {
    if (user?.role === "admin" && token) fetchUsers();
  }, [user, token]);

  const showToast = (msg, type = "success", time = 2200) => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), time);
  };

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API_URL}/user/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data.users || []);
    } catch (err) {
      showToast(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Impossible de charger les utilisateurs.",
        "error"
      );
      setUsers([]);
    }
  };

  const handleDelete = (userId) => setConfirmDeleteId(userId);

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/user/admin/users/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== confirmDeleteId));
      showToast("Utilisateur supprimé.", "success");
      setConfirmDeleteId(null);
    } catch (err) {
      showToast(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Suppression impossible.",
        "error"
      );
      setConfirmDeleteId(null);
    }
  };

  const handleEdit = (u) => {
    setEditUser(u);
    setForm({
      username: u.username,
      email: u.email,
      first_name: u.first_name || "",
      last_name: u.last_name || "",
      role: u.role,
      confirmed: !!u.confirmed,
      sub_prefecture: u.sub_prefecture || "",
      village: u.village || "",
      birth_date: u.birth_date || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      const response = await axios.put(
        `${API_URL}/user/admin/users/${editUser.id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editUser.id ? { ...u, ...response.data.user } : u
        )
      );
      if (user.id === editUser.id && form.role !== "admin") {
        updateUserInContext(response.data.user);
        logout();
        if (onNavigate) onNavigate("/");
        return;
      }
      setEditUser(null);
      setForm({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        role: "membre",
        confirmed: false,
        sub_prefecture: "",
        village: "",
        birth_date: "",
      });
      showToast("Modifications enregistrées.", "success");
    } catch (err) {
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de la modification.";
      if (err.response?.status === 422 && err.response?.data?.errors) {
        msg = Object.values(err.response.data.errors).flat().join(" / ");
      }
      showToast(msg, "error");
    }
  };

  const handleToggleAdmin = async (u) => {
    try {
      const response = await axios.put(
        `${API_URL}/user/admin/users/${u.id}`,
        { ...u, role: u.role === "admin" ? "membre" : "admin" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user.id === u.id ? { ...user, ...response.data.user } : user
        )
      );
      if (user.id === u.id && u.role === "admin") {
        updateUserInContext(response.data.user);
        logout();
        if (onNavigate) onNavigate("/");
        return;
      }
      showToast("Changement de rôle effectué.", "success");
    } catch (err) {
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Changement de rôle impossible.";
      if (err.response?.status === 422 && err.response?.data?.errors) {
        msg = Object.values(err.response.data.errors).flat().join(" / ");
      }
      showToast(msg, "error");
    }
  };

  if (!user?.role || user.role !== "admin")
    return <div className="p-4 text-warning">Accès admin uniquement</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-2">
      <Toast
        msg={toast.msg}
        type={toast.type}
        onClose={() => setToast({ msg: "", type: "" })}
      />
      <h2 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h2>
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl p-6 shadow max-w-xs w-full flex flex-col gap-4">
            <h4 className="text-lg font-bold text-error">Confirmation</h4>
            <div>
              Supprimer cet utilisateur ? Cette action est irréversible.
            </div>
            <div className="flex gap-3 mt-3">
              <button className="btn btn-error flex-1" onClick={confirmDelete}>
                Supprimer
              </button>
              <button
                className="btn btn-ghost flex-1"
                onClick={() => setConfirmDeleteId(null)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      {editUser && (
        <form
          onSubmit={handleUpdate}
          className="mb-8 bg-base-100 p-6 rounded-xl shadow max-w-2xl"
        >
          <h3 className="text-lg font-bold mb-2">
            Modifier l'utilisateur{" "}
            <span className="text-accent">{editUser.username}</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              className="input input-bordered"
              placeholder="Nom d'utilisateur"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
              required
            />
            <input
              className="input input-bordered"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
            <input
              className="input input-bordered"
              placeholder="Prénom"
              value={form.first_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, first_name: e.target.value }))
              }
            />
            <input
              className="input input-bordered"
              placeholder="Nom"
              value={form.last_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, last_name: e.target.value }))
              }
            />
            <input
              className="input input-bordered"
              placeholder="Sous-préfecture"
              value={form.sub_prefecture}
              onChange={(e) =>
                setForm((f) => ({ ...f, sub_prefecture: e.target.value }))
              }
            />
            <input
              className="input input-bordered"
              placeholder="Village"
              value={form.village}
              onChange={(e) =>
                setForm((f) => ({ ...f, village: e.target.value }))
              }
            />
            <input
              className="input input-bordered"
              type="date"
              value={form.birth_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, birth_date: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-4 items-center mt-3">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                className="toggle toggle-accent"
                checked={form.role === "admin"}
                onChange={() =>
                  setForm((f) => ({
                    ...f,
                    role: f.role === "admin" ? "membre" : "admin",
                  }))
                }
              />
              <span className="font-medium">Admin</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                className="toggle"
                checked={form.confirmed}
                onChange={() =>
                  setForm((f) => ({ ...f, confirmed: !f.confirmed }))
                }
              />
              <span className="font-medium">Confirmé</span>
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="btn btn-primary" type="submit">
              Enregistrer
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => setEditUser(null)}
            >
              Annuler
            </button>
          </div>
        </form>
      )}
      <div className="w-full bg-base-100 rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-base-200">
            <tr>
              <th className="px-5 py-4 text-left">Nom</th>
              <th className="px-5 py-4 text-left">Email</th>
              <th className="px-5 py-4 text-left">Prénom/Nom</th>
              <th className="px-5 py-4 text-left">Sous-préfecture</th>
              <th className="px-5 py-4 text-left">Village</th>
              <th className="px-5 py-4 text-left">Âge</th>
              <th className="px-5 py-4 text-left">Rôle</th>
              <th className="px-5 py-4 text-left">Confirmé</th>
              <th className="px-5 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-accent/10">
                <td className="px-5 py-4 font-semibold">{u.username}</td>
                <td className="px-5 py-4">{u.email}</td>
                <td className="px-5 py-4">
                  {u.first_name} {u.last_name}
                </td>
                <td className="px-5 py-4">{u.sub_prefecture || "-"}</td>
                <td className="px-5 py-4">{u.village || "-"}</td>
                <td className="px-5 py-4">{getAge(u.birth_date)}</td>
                <td className="px-5 py-4">
                  <span
                    className={`badge ${
                      u.role === "admin" ? "badge-info" : "badge-ghost"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {u.confirmed ? (
                    <span className="badge badge-success">Oui</span>
                  ) : (
                    <span className="badge badge-warning">Non</span>
                  )}
                </td>
                <td className="px-5 py-4 flex gap-1 items-center">
                  <button
                    className="btn btn-xs btn-info"
                    title="Modifier"
                    onClick={() => handleEdit(u)}
                  >
                    <Pencil size={14} />
                  </button>
                  {u.role !== "admin" && (
                    <button
                      className="btn btn-xs btn-error"
                      title="Supprimer"
                      onClick={() => handleDelete(u.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  {u.role !== "admin" ? (
                    <button
                      className="btn btn-xs btn-success"
                      title="Promouvoir admin"
                      onClick={() => handleToggleAdmin(u)}
                    >
                      <Shield size={14} />
                    </button>
                  ) : (
                    user.id !== u.id && (
                      <button
                        className="btn btn-xs"
                        title="Retirer admin"
                        onClick={() => handleToggleAdmin(u)}
                      >
                        <ShieldOff size={14} />
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
