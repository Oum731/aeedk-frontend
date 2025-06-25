import React from "react";
import ContactForm from "../components/ContactForm";
import { MapPin, Mail, Phone, Clock, MessageCircle } from "lucide-react";
import rencontre from "../assets/rencontre.jpeg";

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-2 py-4">
      <h1 className="text-4xl font-bold mb-2 text-center text-blue-700">
        Contactez-nous
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Nous sommes à votre écoute pour toute question, suggestion ou
        collaboration.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Colonne coordonnées + formulaire */}
        <div className="flex-1 space-y-8">
          <div className="bg-base-200 rounded-xl p-6 shadow space-y-5">
            <h2 className="text-xl font-bold mb-2 text-blue-700">
              Nos coordonnées
            </h2>
            <div className="flex items-center gap-3">
              <MapPin className="text-blue-600" />
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Centre+Culturel+de+Kouto,+Côte+d'Ivoire"
                target="_blank"
                rel="noopener noreferrer"
                className="link font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300"
                title="Voir l’itinéraire sur Google Maps"
              >
                Centre Culturel de Kouto, Région de la Bagoué, Côte d'Ivoire
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-blue-600" />
              <a
                href="tel:+22512345678"
                className="link focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                +225 12 34 56 78
              </a>
              {/* Optionnel : bouton WhatsApp */}
              <a
                href="https://wa.me/22512345678"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-green-600 hover:text-green-800"
                title="Contacter sur WhatsApp"
                aria-label="Contacter sur WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600" />
              <a
                href="mailto:contact.aeedk@gmail.com"
                className="link focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                contact.aeedk@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" />
              <span>Lundi - Vendredi : 8h – 17h</span>
            </div>
          </div>

          <div className="bg-base-200 rounded-xl p-6 shadow">
            <ContactForm />
          </div>
        </div>

        {/* Colonne carte + image */}
        <div className="flex-1 w-full flex flex-col gap-4">
          <div className="h-[350px] bg-base-200 rounded-xl shadow overflow-hidden mb-2 relative">
            <iframe
              title="Centre Culturel de Kouto"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "350px" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31721.229111979546!2d-6.423095252073819!3d9.89380993367686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfb37e29720cf553%3A0xd01a418ffb55cb3f!2sCentre%20Culturel%20de%20Kouto!5e0!3m2!1sfr!2sci!4v1719222208137!5m2!1sfr!2sci"
            ></iframe>
            <span className="absolute bottom-2 left-2 bg-white bg-opacity-80 px-3 py-1 rounded text-sm shadow-md">
              <strong>Itinéraire :</strong>{" "}
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Centre+Culturel+de+Kouto,+Côte+d'Ivoire"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cliquez ici
              </a>
            </span>
          </div>
          <div className="w-full rounded-xl overflow-hidden shadow">
            <img
              src={rencontre}
              alt="Rencontre associative AEEDK"
              className="object-cover w-full h-80"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
