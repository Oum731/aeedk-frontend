import React, { useState, useEffect, useRef } from "react";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API_URL from "../config";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      setError("Lien de réinitialisation invalide.");
    } else {
      passwordInputRef.current?.focus();
    }
  }, [token]);

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
    setMessage("");
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
        setMessage(data.message || "Mot de passe réinitialisé.");
        setRedirecting(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.error || "Erreur inconnue.");
      }
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl shadow bg-base-100 my-8">
      <h2 className="text-2xl font-bold mb-4">Nouveau mot de passe</h2>
      {error && !token ? (
        <div className="text-error text-sm" role="alert">
          {error}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 relative"
          noValidate
          aria-describedby="form-error form-message"
        >
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              id="password"
              aria-describedby="form-error"
              aria-invalid={!!error}
              className="input input-bordered w-full pr-10"
              placeholder="Nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || redirecting}
              ref={passwordInputRef}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
              aria-label={
                showPassword ? "Masquer mot de passe" : "Afficher mot de passe"
              }
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              id="confirm-password"
              aria-describedby="form-error"
              aria-invalid={!!error}
              className="input input-bordered w-full pr-10"
              placeholder="Confirmer mot de passe"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading || redirecting}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
              aria-label={
                showConfirm ? "Masquer confirmation" : "Afficher confirmation"
              }
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={loading || !!validate() || redirecting}
          >
            {loading && (
              <LoaderCircle className="animate-spin mr-2" size={18} />
            )}
            {redirecting ? "Redirection..." : "Valider"}
          </button>

          {message && (
            <div
              id="form-message"
              className="text-success text-sm"
              role="alert"
            >
              {message}
            </div>
          )}
          {error && (
            <div id="form-error" className="text-error text-sm" role="alert">
              {error}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
