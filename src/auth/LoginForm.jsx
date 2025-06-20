import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoaderCircle } from "lucide-react";

export default function LoginForm({ onNavigate }) {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(form.identifier, form.password);
    setLoading(false);
    if (result.success && onNavigate) onNavigate("/home");
    else if (!result.success)
      setError(result.error || "Erreur lors de la connexion.");
  };

  if (user) return null;

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl shadow bg-base-100 my-8">
      <h2 className="text-2xl font-bold mb-4">Connexion</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="identifier"
          required
          className="input input-bordered w-full"
          placeholder="Email ou nom d'utilisateur"
          value={form.identifier}
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
        <button
          className="btn btn-primary w-full"
          disabled={loading}
          type="submit"
        >
          {loading && <LoaderCircle className="animate-spin mr-2" size={18} />}
          Se connecter
        </button>
        {error && <div className="text-error">{error}</div>}
      </form>
    </div>
  );
}
