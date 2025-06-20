import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoaderCircle } from "lucide-react";

export default function RegisterForm({ onNavigate }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    phone: "",
    sub_prefecture: "",
    village: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files[0]) {
      setForm((form) => ({ ...form, avatar: files[0] }));
      setAvatarPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((form) => ({ ...form, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const cleanedForm = {
      ...form,
      email: form.email.trim().toLowerCase(),
      username: form.username.trim(),
    };
    const data = new FormData();
    Object.keys(cleanedForm).forEach((key) => {
      if (cleanedForm[key]) data.append(key, cleanedForm[key]);
    });
    const result = await register(data);
    setLoading(false);
    if (result.success) {
      if (onNavigate) onNavigate("/login");
    } else {
      setError(result.error || "Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl shadow bg-base-100 my-8">
      <h2 className="text-2xl font-bold mb-4">Inscription</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-3"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="username"
          required
          className="input input-bordered w-full"
          placeholder="Nom d'utilisateur"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          required
          className="input input-bordered w-full"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          required
          className="input input-bordered w-full"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
        />
        <div className="flex gap-2">
          <input
            type="text"
            name="first_name"
            required
            className="input input-bordered w-full"
            placeholder="Prénom"
            value={form.first_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            required
            className="input input-bordered w-full"
            placeholder="Nom"
            value={form.last_name}
            onChange={handleChange}
          />
        </div>
        <input
          type="date"
          name="birth_date"
          required
          className="input input-bordered w-full"
          value={form.birth_date}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          required
          className="input input-bordered w-full"
          placeholder="Téléphone"
          value={form.phone}
          onChange={handleChange}
        />
        <div className="flex gap-2">
          <input
            type="text"
            name="sub_prefecture"
            required
            className="input input-bordered w-full"
            placeholder="Sous-préfecture"
            value={form.sub_prefecture}
            onChange={handleChange}
          />
          <input
            type="text"
            name="village"
            required
            className="input input-bordered w-full"
            placeholder="Village"
            value={form.village}
            onChange={handleChange}
          />
        </div>
        <label className="flex flex-col gap-2">
          <span className="font-medium">Photo de profil (optionnel)</span>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleChange}
          />
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Aperçu avatar"
              className="w-16 h-16 rounded-full mt-2"
            />
          )}
        </label>
        <button
          className="btn btn-primary w-full"
          disabled={loading}
          type="submit"
        >
          {loading && <LoaderCircle className="animate-spin mr-2" size={18} />}
          S'inscrire
        </button>
        {error && <div className="text-error">{error}</div>}
      </form>
    </div>
  );
}
