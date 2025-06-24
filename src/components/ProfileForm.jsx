import React, { useEffect, useState } from "react";
import { LoaderCircle, UploadCloud } from "lucide-react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import API_URL from "../config";
import { getAvatarUrl } from "../utils/avatarUrl";

const isValidDate = (dateStr) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateStr;
};

export default function ProfileForm({
  editing,
  setEditing,
  userData,
  readOnly,
  onAvatarChange,
}) {
  const { user, token, updateUserInContext } = useAuth();
  const isMe = !userData || (user && userData && user.id === userData.id);

  const [form, setForm] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const source = userData || user;
    if (source) {
      setForm({
        ...source,
        birth_date: source.birth_date?.substring(0, 10) || "",
      });
      setAvatarPreview(null);
    }
  }, [userData, user]);

  useEffect(() => {
    if (!editing) {
      const source = userData || user;
      setAvatarPreview(
        source?.avatar ? getAvatarUrl(source.avatar, true) : null
      );
      setAvatarFile(null);
    }
  }, [editing, userData, user]);

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      const previewUrl = URL.createObjectURL(e.target.files[0]);
      setAvatarFile(e.target.files[0]);
      setAvatarPreview(previewUrl);
      if (onAvatarChange) onAvatarChange(previewUrl);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");

    const idToUse = isMe ? user?.id : userData?.id;
    const effectiveToken = token || localStorage.getItem("token");

    if (!idToUse || !effectiveToken) {
      setError("Session expirée. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    const allowedFields = [
      "username",
      "first_name",
      "last_name",
      "sub_prefecture",
      "village",
      "phone",
    ];

    const formData = new FormData();

    for (const key of allowedFields) {
      let value = form[key];
      if (typeof value === "string") value = value.trim();
      if (value) formData.append(key, value);
    }

    if (form.birth_date) {
      if (!isValidDate(form.birth_date)) {
        setError("La date de naissance doit être au format YYYY-MM-DD.");
        setLoading(false);
        return;
      }
      formData.append("birth_date", form.birth_date);
    }

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const res = await axios.put(`${API_URL}/user/${idToUse}`, formData, {
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
        },
      });

      if (res.data && res.data.user) {
        updateUserInContext(res.data.user, true);
        setMsg("Profil mis à jour avec succès !");
        if (setEditing) setEditing(false);
        setAvatarPreview(null);
        setAvatarFile(null);
      } else {
        setError("Mise à jour échouée (données serveur inattendues)");
      }
    } catch (err) {
      let errMsg = "Une erreur est survenue";
      if (err.response) {
        if (err.response.status === 422) {
          if (err.response.data?.errors) {
            errMsg = Object.entries(err.response.data.errors)
              .map(
                ([field, errors]) =>
                  `${field}: ${
                    Array.isArray(errors) ? errors.join(", ") : errors
                  }`
              )
              .join("; ");
          } else if (err.response.data?.error) {
            errMsg = err.response.data.error;
          }
        } else if (err.response.status === 413) {
          errMsg = "Image trop volumineuse (max 2 Mo).";
        } else if (err.response.data?.error) {
          errMsg = err.response.data.error;
        } else if (err.response.data?.message) {
          errMsg = err.response.data.message;
        }
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!form) {
    return (
      <div className="flex justify-center items-center h-full min-h-[120px]">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {!editing || readOnly ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg w-full">
          {[
            { label: "Prénom", key: "first_name" },
            { label: "Nom", key: "last_name" },
            { label: "Sous-préfecture", key: "sub_prefecture" },
            { label: "Village", key: "village" },
            { label: "Téléphone", key: "phone" },
            { label: "Date de naissance", key: "birth_date" },
            { label: "Email", key: "email" },
            { label: "Rôle", key: "role" },
          ].map(({ label, key }) => (
            <div key={key}>
              <div className="text-gray-500 text-xs">{label}</div>
              <div className="font-medium">{form[key] || "-"}</div>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Nom d'utilisateur", name: "username" },
              { label: "Prénom", name: "first_name" },
              { label: "Nom", name: "last_name" },
              { label: "Sous-préfecture", name: "sub_prefecture" },
              { label: "Village", name: "village" },
              { label: "Téléphone", name: "phone" },
              { label: "Date de naissance", name: "birth_date", type: "date" },
            ].map(({ label, name, type = "text" }) => (
              <div key={name}>
                <label className="label">{label}</label>
                <input
                  type={type}
                  name={name}
                  className="input input-bordered w-full"
                  value={form[name] || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full"
                value={form.email || ""}
                disabled
              />
            </div>
            <div>
              <label className="label">Rôle</label>
              <input
                type="text"
                name="role"
                className="input input-bordered w-full"
                value={form.role || ""}
                disabled
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <label className="btn btn-sm btn-accent cursor-pointer text-white border-blue-400 bg-blue-700">
              <UploadCloud size={16} className="mr-1" />
              Changer avatar
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Aperçu avatar"
                className="rounded-full w-16 h-16 object-cover border ml-4"
              />
            )}
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin mr-2" size={18} />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </button>
            <button
              type="button"
              className="btn btn-ghost flex-1 text-white border-blue-400 bg-blue-700"
              onClick={() => setEditing(false)}
              disabled={loading}
            >
              Annuler
            </button>
          </div>

          {msg && <div className="alert alert-success mt-4">{msg}</div>}
          {error && <div className="alert alert-error mt-4">{error}</div>}
        </form>
      )}
    </div>
  );
}
