import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

const SPECIAL_CHARS = "@ $ ! % * ? & .";
const PASSWORD_RULES = [
  {
    label: "Le mot de passe doit contenir au moins 8 caractères.",
    test: (v) => v.length >= 8,
  },
  {
    label: "Le mot de passe doit contenir au moins une lettre majuscule.",
    test: (v) => /[A-Z]/.test(v),
  },
  {
    label: `Le mot de passe doit contenir au moins un chiffre.`,
    test: (v) => /\d/.test(v),
  },
  {
    label: `Le mot de passe doit contenir au moins un caractère spécial (${SPECIAL_CHARS}).`,
    test: (v) => /[@$!%*?&.]/.test(v),
  },
];

const EMAIL_REGEX = /^[\w\.-]+@[\w\.-]+\.\w+$/;
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

const FIELDS = [
  {
    name: "username",
    label: "Nom d'utilisateur",
    type: "text",
    required: true,
  },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Mot de passe", type: "password", required: true },
  {
    name: "confirm_password",
    label: "Confirmer le mot de passe",
    type: "password",
    required: true,
  },
  { name: "first_name", label: "Prénom", type: "text", required: true },
  { name: "last_name", label: "Nom", type: "text", required: true },
  {
    name: "birth_date",
    label: "Date de naissance",
    type: "date",
    required: true,
  },
  { name: "phone", label: "Téléphone", type: "tel", required: true },
  {
    name: "sub_prefecture",
    label: "Sous-préfecture",
    type: "text",
    required: true,
  },
  { name: "village", label: "Village", type: "text", required: true },
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
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const birthDateRef = useRef();
  const isMobile = useIsMobile();
  const requiredFields = FIELDS.filter((f) => f.required).map((f) => f.name);

  const validateField = (name, value) => {
    if (requiredFields.includes(name) && !value)
      return "Ce champ est obligatoire.";
    if (name === "email" && value && !EMAIL_REGEX.test(value))
      return "L’adresse email est invalide.";
    if (name === "password" && value && !PASSWORD_REGEX.test(value))
      return "Le mot de passe ne respecte pas tous les critères.";
    if (name === "confirm_password" && value && value !== form.password)
      return "Les mots de passe ne correspondent pas.";
    return "";
  };

  const validateForm = () => {
    let errors = {};
    requiredFields.forEach((field) => {
      const value = form[field];
      const err = validateField(field, value);
      if (err) errors[field] = err;
    });
    if (form.password !== form.confirm_password) {
      errors.confirm_password = "Les mots de passe ne correspondent pas.";
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "avatar" && files?.length ? files[0] : value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "avatar" && files?.length)
      setAvatarPreview(URL.createObjectURL(files[0]));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const err = validateField(name, form[name]);
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errors = validateForm();
    setFieldErrors(errors);
    setTouched((prev) => {
      let t = { ...prev };
      requiredFields.forEach((f) => (t[f] = true));
      return t;
    });
    if (Object.keys(errors).length > 0) {
      setError("Veuillez remplir tous les champs obligatoires correctement.");
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
      <form
        onSubmit={handleSubmit}
        className="space-y-3"
        encType="multipart/form-data"
        noValidate
      >
        {FIELDS.map((field) => (
          <div key={field.name} className="mb-2">
            {field.name === "birth_date" ? (
              <div className="relative">
                <input
                  ref={birthDateRef}
                  type="date"
                  name="birth_date"
                  className={
                    "input input-bordered w-full" +
                    (touched.birth_date && fieldErrors.birth_date
                      ? " border-red-500"
                      : "")
                  }
                  value={form.birth_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  style={form.birth_date ? {} : { color: "#888" }}
                />
                {isMobile && !form.birth_date && (
                  <span
                    className="absolute left-4 top-2 text-gray-400 pointer-events-none"
                    onClick={() => birthDateRef.current?.focus()}
                  >
                    Date de naissance (obligatoire)
                  </span>
                )}
              </div>
            ) : field.name === "password" ? (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={
                    "input input-bordered w-full pr-10" +
                    (touched.password && fieldErrors.password
                      ? " border-red-500"
                      : "")
                  }
                  placeholder="Mot de passe"
                  required
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
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
                {form.password && (
                  <ul className="mt-2 text-xs">
                    {PASSWORD_RULES.map((rule, i) => {
                      const ok = rule.test(form.password);
                      return (
                        <li
                          key={i}
                          className={
                            ok
                              ? "text-green-600 flex items-center gap-1"
                              : "text-red-600 flex items-center gap-1"
                          }
                        >
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${
                              ok ? "bg-green-500" : "bg-red-400"
                            }`}
                          ></span>
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                )}
                {touched.password && fieldErrors.password && (
                  <div className="text-error text-xs mt-1">
                    {fieldErrors.password}
                  </div>
                )}
              </div>
            ) : field.name === "confirm_password" ? (
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirm_password"
                  className={
                    "input input-bordered w-full pr-10" +
                    (touched.confirm_password && fieldErrors.confirm_password
                      ? " border-red-500"
                      : "")
                  }
                  placeholder="Confirmer le mot de passe"
                  required
                  value={form.confirm_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
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
                {touched.confirm_password && fieldErrors.confirm_password && (
                  <div className="text-error text-xs mt-1">
                    {fieldErrors.confirm_password}
                  </div>
                )}
              </div>
            ) : (
              <>
                <input
                  type={field.type}
                  name={field.name}
                  className={
                    "input input-bordered w-full" +
                    (touched[field.name] && fieldErrors[field.name]
                      ? " border-red-500"
                      : "")
                  }
                  placeholder={
                    field.label + (field.required ? " (obligatoire)" : "")
                  }
                  required={field.required}
                  value={form[field.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete={field.name}
                />
                {touched[field.name] && fieldErrors[field.name] && (
                  <div className="text-error text-xs mt-1">
                    {fieldErrors[field.name]}
                  </div>
                )}
              </>
            )}
          </div>
        ))}

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
          disabled={loading}
        >
          {loading && <LoaderCircle className="animate-spin mr-2" size={18} />}
          S'inscrire
        </button>
        {error && (
          <div className="bg-red-100 text-red-800 text-sm p-3 rounded mt-2">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
