import React from "react";
import {
  Facebook,
  Mail,
  MapPin,
  Phone,
  ArrowUp,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer px-6 py-8 bg-base-200 text-base-content border-t border-base-300 mt-12">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-10 md:gap-0">
        <div>
          <a
            href="/"
            className="text-2xl font-bold text-blue-700 mb-2 inline-block"
          >
            AEEDK
          </a>
          <p className="text-sm mb-2">
            Association des Étudiants et Élèves Département de Kouto
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="mailto:contact.aeedk@gmail.com"
              className="hover:text-accent transition"
              title="Email"
            >
              <Mail size={22} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition"
              title="Facebook"
            >
              <Facebook size={22} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition"
              title="Instagram"
            >
              <Instagram size={22} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition"
              title="LinkedIn"
            >
              <Linkedin size={22} />
            </a>
          </div>
        </div>

        <div>
          <div className="font-semibold mb-2">Contacts</div>
          <div className="flex items-center gap-2 text-sm mb-1">
            <MapPin size={18} /> KOUTO, Région de la BAGOUE, Côte d'Ivoire
          </div>
          <div className="flex items-center gap-2 text-sm mb-1">
            <Phone size={18} />
            <a href="tel:+22512345678" className="link link-hover">
              +225 12 34 56 78
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail size={18} />
            <a
              href="mailto:contact.aeedk@gmail.com"
              className="link link-hover"
            >
              contact.aeedk@gmail.com
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3">
          <a href="#about" className="link link-hover">
            À propos
          </a>
          <a href="#actu" className="link link-hover">
            Actualités
          </a>
          <a href="#contact" className="link link-hover">
            Contact
          </a>
        </div>
      </div>
      <div className="w-full text-center mt-8 text-xs text-blue-700">
        &copy; {new Date().getFullYear()} AEEDK. Tous droits réservés.
      </div>
    </footer>
  );
}
