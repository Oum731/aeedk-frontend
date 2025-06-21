import React, { useEffect, useState } from "react";
import { LoaderCircle, UploadCloud } from "lucide-react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import API_URL from "../config";

export default function ProfileForm({
  editing,
  setEditing,
  userData,
  readOnly,
  onAvatarChange,
}) {
  const { user, updateUserInContext } = useAuth();
  const isMe = !userData || (user && userData && user.id === userData.id);
  const [form, setForm] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (userData) {
      setForm({
        ...userData,
        birth_date: userData.birth_date?.substring(0, 10) || "",
      });
    } else if (user) {
      setForm({
        ...user,
        birth_date: user.birth_date?.substring(0, 10) || "",
      });
    }
  }, [userData, user]);

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
    if (!idToUse) {
      setError("Impossible de déterminer l'utilisateur à mettre à jour.");
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("first_name", form.first_name || "");
      formData.append("last_name", form.last_name || "");
      formData.append("sub_prefecture", form.sub_prefecture || "");
      formData.append("village", form.village || "");
      formData.append("phone", form.phone || "");
      formData.append("birth_date", form.birth_date || "");
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      const response = await axios.put(`${API_URL}/user/${idToUse}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMsg("Profil mis à jour avec succès !");
      updateUserInContext(response.data.user);
      setAvatarFile(null);
      setAvatarPreview(null);
      if (onAvatarChange) onAvatarChange(null);
      setForm({
        ...response.data.user,
        birth_date: response.data.user.birth_date?.substring(0, 10) || "",
      });
      if (setEditing) setEditing(false);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Une erreur est survenue lors de la mise à jour"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!form)
    return (
      <div className="flex justify-center items-center h-full min-h-[120px]">
        <LoaderCircle className="animate-spin" />
      </div>
    );

  return (
    <div className="w-full">
      {!editing || readOnly ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg w-full">
          <div>
            <div className="text-gray-500 text-xs">Prénom</div>
            <div className="font-medium">{form.first_name || "-"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Nom</div>
            <div className="font-medium">{form.last_name || "-"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Sous-préfecture</div>
            <div className="font-medium">{form.sub_prefecture || "-"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Village</div>
            <div className="font-medium">{form.village || "-"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Téléphone</div>
            <div className="font-medium">{form.phone || "-"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Date de naissance</div>
            <div className="font-medium">{form.birth_date || "-"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Email</div>
            <div className="font-medium">{form.email || "-"}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">Rôle</div>
            <div className="font-medium">{form.role || "-"}</div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 mt-2 flex flex-col flex-1 h-full w-full"
        >
          <div className="flex items-center gap-4">
            <label className="btn btn-sm btn-accent cursor-pointer  text-white border-blue-400 bg-blue-700">
              <UploadCloud size={16} className="mr-1 " />
              Changer avatar
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div>
              <label className="label">Prénom</label>
              <input
                type="text"
                name="first_name"
                className="input input-bordered w-full"
                value={form.first_name || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Nom</label>
              <input
                type="text"
                name="last_name"
                className="input input-bordered w-full"
                value={form.last_name || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Sous-préfecture</label>
              <input
                type="text"
                name="sub_prefecture"
                className="input input-bordered w-full"
                value={form.sub_prefecture || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Village</label>
              <input
                type="text"
                name="village"
                className="input input-bordered w-full"
                value={form.village || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Téléphone</label>
              <input
                type="tel"
                name="phone"
                className="input input-bordered w-full"
                value={form.phone || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Date de naissance</label>
              <input
                type="date"
                name="birth_date"
                className="input input-bordered w-full"
                value={form.birth_date || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                value={form.email || ""}
                disabled
              />
            </div>
            <div>
              <label className="label">Rôle</label>
              <input
                type="text"
                name="role"
                className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                value={form.role || ""}
                disabled
              />
            </div>
          </div>
          <div className="flex gap-4 mt-2">
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
              className="btn btn-ghost flex-1  text-white border-blue-400 bg-blue-700"
              disabled={loading}
              onClick={() => setEditing && setEditing(false)}
            >
              Annuler
            </button>
          </div>
          {msg && <div className="alert alert-success mt-4">{msg}</div>}
          {error && <div className="alert alert-error mt-4">{error}</div>}
        </form>
      )}
      {!editing && msg && <div className="alert alert-success mt-4">{msg}</div>}
      {!editing && error && (
        <div className="alert alert-error mt-4">{error}</div>
      )}
    </div>
  );
}
