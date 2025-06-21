import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";
import API_URL from "../config";

export default function ForgotPasswordForm({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Email envoyé");
      } else {
        setError(data.error || "Erreur inconnue");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl shadow bg-base-100 my-8">
      <h2 className="text-2xl font-bold mb-4">Mot de passe oublié</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          name="email"
          required
          className="input input-bordered w-full"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={loading}
        >
          {loading && <LoaderCircle className="animate-spin mr-2" size={18} />}{" "}
          Envoyer
        </button>
        {message && <div className="text-success text-sm">{message}</div>}
        {error && <div className="text-error text-sm">{error}</div>}
      </form>
    </div>
  );
}
