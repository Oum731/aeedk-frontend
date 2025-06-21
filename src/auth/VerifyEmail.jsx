import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from "../config";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/user/verify/${token}`);
        if (res.ok) {
          navigate("/login");
        } else {
          const data = await res.json();
          setError(data.error || "Erreur de vérification.");
        }
      } catch {
        setError("Erreur de connexion au serveur.");
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
      {error ? (
        <div className="text-error text-lg">{error}</div>
      ) : (
        <div className="text-primary text-lg">Vérification en cours...</div>
      )}
    </div>
  );
}
