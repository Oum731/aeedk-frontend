import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [resetStatus, setResetStatus] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reset = params.get("reset");
    const verified = params.get("verified");

    if (reset) setResetStatus(reset);
    if (verified) setVerifyStatus(verified);

    if (reset || verified) {
      const cleanUrl = location.pathname;
      window.history.replaceState(null, "", cleanUrl);
    }
  }, [location]);

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

    if (result.success) {
      navigate("/home");
    } else {
      if (
        result.error &&
        result.error.toLowerCase().includes("confirmer votre email")
      ) {
        setError(
          "Votre compte n’est pas encore activé. Veuillez vérifier votre boîte mail et cliquer sur le lien de confirmation. Si vous ne trouvez pas l’email, pensez à regarder dans vos spams."
        );
      } else {
        setError(result.error || "Erreur lors de la connexion.");
      }
    }
  };

  if (user) return null;

  return (
    <div className="max-w-md mx-auto p-6 rounded-xl shadow bg-base-100 my-8">
      <h2 className="text-2xl font-bold mb-4">Connexion</h2>

      {(resetStatus || verifyStatus) && (
        <div
          className={`text-sm p-3 rounded mb-4 ${
            resetStatus === "success" || verifyStatus === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {resetStatus === "success" && (
            <>
              Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.
            </>
          )}
          {resetStatus === "fail" && (
            <>Le lien de réinitialisation est invalide ou expiré.</>
          )}
          {verifyStatus === "success" && (
            <>Email confirmé avec succès. Vous pouvez vous connecter.</>
          )}
          {verifyStatus === "fail" && (
            <>Le lien de confirmation est invalide ou expiré.</>
          )}
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

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium">
            Mot de passe
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            required
            className="input input-bordered w-full mt-1 pr-10"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-9 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
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

        {error && (
          <div className="bg-red-100 text-red-800 text-sm p-3 rounded mt-2">
            {error}
          </div>
        )}

        <button
          className="btn btn-primary w-full"
          disabled={loading}
          type="submit"
        >
          {loading && <LoaderCircle className="animate-spin mr-2" size={18} />}
          Se connecter
        </button>
      </form>

      <p className="text-sm text-right mt-4">
        <button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => navigate("/forgot-password")}
        >
          Mot de passe oublié ?
        </button>
      </p>
    </div>
  );
}
