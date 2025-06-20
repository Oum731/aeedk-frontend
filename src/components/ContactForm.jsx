import React, { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      await axios.post(`${API_URL}/contact/send/`, form);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      alert("Erreur lors de l'envoi");
    }
    setLoading(false);
  };

  return (
    <form
      className="bg-base-200 p-4 rounded shadow flex flex-col gap-3 max-w-lg mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center gap-2 mb-2">
        <Mail size={20} />
        <h3 className="font-bold text-lg">Contactez-nous</h3>
      </div>
      <input
        className="input input-bordered"
        placeholder="Nom"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        className="input input-bordered"
        type="email"
        placeholder="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        className="input input-bordered"
        placeholder="Sujet"
        name="subject"
        value={form.subject}
        onChange={handleChange}
        required
      />
      <textarea
        className="textarea textarea-bordered"
        rows={4}
        placeholder="Message"
        name="message"
        value={form.message}
        onChange={handleChange}
        required
      />
      <button className="btn btn-primary" disabled={loading}>
        {loading ? "Envoi..." : "Envoyer"}
      </button>
      {success && (
        <div className="alert alert-success flex items-center gap-3 mt-4 rounded-xl shadow-md px-4 py-3 text-green-800 bg-green-50 border border-green-300">
          <svg
            className="w-6 h-6 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <div>
            <div className="font-bold">Message envoyé !</div>
            <div className="text-sm mt-1">
              Merci de nous avoir contactés. Un responsable reviendra vers vous
              très bientôt.
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
