import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

export default function ResetPasswordForm({ onNavigate }) {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm)
      return setError("Les mots de passe ne correspondent pas.");

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Mot de passe réinitialisé");
        setTimeout(() => onNavigate("/login"), 2000);
      } else {
        setError(data.error || "Erreur inconnue");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl shadow bg-base-100 my-8">
      <h2 className="text-2xl font-bold mb-4">Nouveau mot de passe</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          required
          className="input input-bordered w-full"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          required
          className="input input-bordered w-full"
          placeholder="Confirmer mot de passe"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={loading}
        >
          {loading && <LoaderCircle className="animate-spin mr-2" size={18} />}{" "}
          Valider
        </button>
        {message && <div className="text-success text-sm">{message}</div>}
        {error && <div className="text-error text-sm">{error}</div>}
      </form>
    </div>
  );
}
