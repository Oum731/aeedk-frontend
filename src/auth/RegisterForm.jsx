import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
const EMAIL_REGEX = /^[\w\.-]+@[\w\.-]+\.\w+$/;

const PASSWORD_REQUIREMENTS = [
  "Au moins 8 caractères",
  "Une majuscule",
  "Une minuscule",
  "Un chiffre",
  "Un caractère spécial (@$!%*?&.)",
];

export default function RegisterForm({ onNavigate }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar" && files?.length) {
      setForm((prev) => ({ ...prev, avatar: files[0] }));
      setAvatarPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!EMAIL_REGEX.test(form.email)) return "Email invalide";
    if (!PASSWORD_REGEX.test(form.password))
      return "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";
    if (form.password !== form.confirm_password)
      return "Les mots de passe ne correspondent pas";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);

    const cleanedForm = {
      ...form,
      email: form.email.trim().toLowerCase(),
      username: form.username.trim(),
    };

    const formData = new FormData();
    Object.entries(cleanedForm).forEach(([key, value]) => {
      if (key !== "confirm_password" && value) formData.append(key, value);
    });

    const result = await register(formData);
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

      <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded mb-4">
        <p>Votre mot de passe doit contenir :</p>
        <ul className="list-disc ml-6">
          {PASSWORD_REQUIREMENTS.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="username"
          className="input input-bordered w-full"
          placeholder="Nom d'utilisateur"
          required
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          className="input input-bordered w-full"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
        />
        {form.email && !EMAIL_REGEX.test(form.email) && (
          <p className="text-sm text-warning mt-1">
            L’adresse email semble invalide. Exemple : nom@example.com
          </p>
        )}

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="input input-bordered w-full pr-10"
            placeholder="Mot de passe"
            required
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
            aria-label={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {form.password && !PASSWORD_REGEX.test(form.password) && (
          <p className="text-sm text-warning mt-1">
            Le mot de passe ne respecte pas les critères ci-dessus.
          </p>
        )}

        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirm_password"
            className="input input-bordered w-full pr-10"
            placeholder="Confirmer le mot de passe"
            required
            value={form.confirm_password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
            aria-label={
              showConfirm
                ? "Masquer la confirmation"
                : "Afficher la confirmation"
            }
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            name="first_name"
            className="input input-bordered w-full"
            placeholder="Prénom"
            required
            value={form.first_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            className="input input-bordered w-full"
            placeholder="Nom"
            required
            value={form.last_name}
            onChange={handleChange}
          />
        </div>

        <input
          type="date"
          name="birth_date"
          className="input input-bordered w-full"
          placeholder="Date de naissance"
          required
          value={form.birth_date}
          onChange={handleChange}
        />

        <input
          type="tel"
          name="phone"
          className="input input-bordered w-full"
          placeholder="Téléphone"
          required
          value={form.phone}
          onChange={handleChange}
        />

        <div className="flex gap-2">
          <input
            type="text"
            name="sub_prefecture"
            className="input input-bordered w-full"
            placeholder="Sous-préfecture"
            required
            value={form.sub_prefecture}
            onChange={handleChange}
          />
          <input
            type="text"
            name="village"
            className="input input-bordered w-full"
            placeholder="Village"
            required
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
              className="w-16 h-16 rounded-full mt-2 object-cover"
            />
          )}
        </label>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading || !!validateForm()}
        >
          {loading && <LoaderCircle className="animate-spin mr-2" size={18} />}
          S'inscrire
        </button>
        {error && <div className="text-error text-sm mt-2">{error}</div>}
      </form>
    </div>
  );
}
