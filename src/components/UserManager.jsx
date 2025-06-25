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
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (user?.role === "admin" && token) fetchUsers();
  }, [user, token]);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      setError("");
      setMsg("");
      const { data } = await axios.get(`${API_URL}/user/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(data.users || []);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Impossible de charger les utilisateurs."
      );
      setUsers([]);
    }
  };

  // Nouvelle méthode de suppression sans alert native
  const handleDelete = (userId) => {
    setConfirmDeleteId(userId);
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_URL}/user/admin/users/${confirmDeleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMsg("Utilisateur supprimé.");
      setConfirmDeleteId(null);
      fetchUsers();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Suppression impossible."
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
    setError("");
    setMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editUser) return;
    setError("");
    setMsg("");
    try {
      const response = await axios.put(
        `${API_URL}/user/admin/users/${editUser.id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      setMsg("Modifications enregistrées.");
      fetchUsers();
    } catch (err) {
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors de la modification.";
      if (err.response?.status === 422 && err.response?.data?.errors) {
        msg = Object.values(err.response.data.errors).flat().join(" / ");
      }
      setError(msg);
    }
  };

  const handleToggleAdmin = async (u) => {
    setError("");
    setMsg("");
    try {
      const response = await axios.put(
        `${API_URL}/user/admin/users/${u.id}`,
        {
          ...u,
          role: u.role === "admin" ? "membre" : "admin",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (user.id === u.id && u.role === "admin") {
        updateUserInContext(response.data.user);
        logout();
        if (onNavigate) onNavigate("/");
        return;
      }
      setMsg("Changement de rôle effectué.");
      fetchUsers();
    } catch (err) {
      let msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Changement de rôle impossible.";
      if (err.response?.status === 422 && err.response?.data?.errors) {
        msg = Object.values(err.response.data.errors).flat().join(" / ");
      }
      setError(msg);
    }
  };

  if (!user?.role || user.role !== "admin")
    return <div className="p-4 text-warning">Accès admin uniquement</div>;

  return (
    <div className="w-full max-w-7xl mx-auto px-2">
      <h2 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h2>

      {/* MODALE de confirmation suppression */}
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
          {msg && <div className="alert alert-success mt-4">{msg}</div>}
          {error && <div className="alert alert-error mt-4">{error}</div>}
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
    </div>
  );
}
