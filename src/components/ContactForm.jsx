import React, { useState } from "react";
import axios from "axios";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w+$/;

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Le nom est requis.");
      return false;
    }
    if (!form.email.trim() || !EMAIL_REGEX.test(form.email.trim())) {
      toast.error("L'email est invalide.");
      return false;
    }
    if (!form.subject.trim()) {
      toast.error("Le sujet est requis.");
      return false;
    }
    if (!form.message.trim() || form.message.trim().length < 5) {
      toast.error("Le message doit contenir au moins 5 caractères.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await axios.post(`${API_URL}/contact/send/`, form);
      toast.success(
        <>
          <div className="font-bold">Message envoyé !</div>
          <div className="text-sm mt-1">
            Merci de nous avoir contactés.
            <br />
            Un responsable vous répondra très bientôt.
          </div>
        </>
      );
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    }
    setLoading(false);
  };

  return (
    <form
      className="bg-base-200 p-4 rounded shadow flex flex-col gap-3 max-w-lg mx-auto"
      onSubmit={handleSubmit}
      noValidate
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
    </form>
  );
}
