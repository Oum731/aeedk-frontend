import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoaderCircle } from "lucide-react";

export default function LoginForm({ onNavigate, reset, verified }) {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.identifier || !form.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    const result = await login(form.identifier.trim(), form.password);
    setLoading(false);

    if (result.success && onNavigate) {
      onNavigate("/home");
    } else if (!result.success) {
      setError(result.error || "Erreur lors de la connexion.");
    }
  };

  if (user) return null;

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl shadow bg-base-100 my-8">
      <h2 className="text-2xl font-bold mb-4">Connexion</h2>
      {reset === "success" && (
        <div className="text-success text-sm mb-2">
          Mot de passe réinitialisé. Vous pouvez vous connecter.
        </div>
      )}
      {verified === "success" && (
        <div className="text-success text-sm mb-2">
          Email confirmé. Vous pouvez vous connecter.
        </div>
      )}
      {reset === "fail" && (
        <div className="text-error text-sm mb-2">
          Erreur de réinitialisation de mot de passe.
        </div>
      )}
      {verified === "fail" && (
        <div className="text-error text-sm mb-2">
          Erreur de confirmation d'email.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium">
            Email ou nom d'utilisateur
          </label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            required
            className="input input-bordered w-full mt-1"
            placeholder="Email ou nom d'utilisateur"
            value={form.identifier}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="input input-bordered w-full mt-1"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button
          className="btn btn-primary w-full"
          disabled={loading}
          type="submit"
        >
          {loading && <LoaderCircle className="animate-spin mr-2" size={18} />}
          Se connecter
        </button>

        {error && <div className="text-error text-sm mt-2">{error}</div>}
      </form>

      <p className="text-sm text-right mt-4">
        <button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => onNavigate("/forgot-password")}
        >
          Mot de passe oublié ?
        </button>
      </p>
    </div>
  );
}
