import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";
import API_URL from "../config";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

export default function ResetPasswordForm({ token, onNavigate }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!PASSWORD_REGEX.test(password)) {
      return "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";
    }
    if (password !== confirm) {
      return "Les mots de passe ne correspondent pas.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
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
          disabled={loading || !!validate()}
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
