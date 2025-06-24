import React from "react";
import ContactForm from "../components/ContactForm";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import rencontre from "../assets/rencontre.jpeg";

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-2">
      <h1 className="text-4xl font-bold mb-2 text-center text-primary">
        Contactez-nous
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Nous sommes à votre écoute pour toute question, suggestion ou
        collaboration.
      </p>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 space-y-8">
          <div className="bg-base-200 rounded-xl p-6 shadow space-y-5">
            <h2 className="text-xl font-bold mb-2 text-blue-700">
              Nos coordonnées
            </h2>
            <div className="flex items-center gap-3">
              <MapPin className="text-primary" />
              <span>KOUTO, Région de la BAGOUE, Côte d'Ivoire</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-primary" />
              <a href="tel:+22512345678" className="link link-hover">
                +225 12 34 56 78
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-primary" />
              <a
                href="mailto:contact.aeedk@gmail.com"
                className="link link-hover"
              >
                contact.aeedk@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-primary" />
              <span>Lundi - Vendredi : 8h – 17h</span>
            </div>
          </div>

          <div className="bg-base-200 rounded-xl p-6 shadow">
            <ContactForm />
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="h-[350px] bg-base-200 rounded-xl shadow overflow-hidden mb-4">
            <iframe
              title="Centre Culturel de Kouto"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "350px" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/place/Kouto,+C%C3%B4te+d'Ivoire/@9.8922317,-6.4213372,15z/data=!3m1!4b1!4m6!3m5!1s0xfb37e29720cf553:0xd01a418ffb55cb3f!8m2!3d9.8938829!4d-6.4103979!16zL20vMDU2a214?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D"
            ></iframe>
            <span>
              <strong>Itinéraire :</strong>{" "}
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Centre+Culturel+de+Kouto,+Côte+d'Ivoire"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                ici
              </a>
            </span>
          </div>
          <div className="w-full rounded-xl overflow-hidden shadow">
            <img
              src={rencontre}
              alt="Notre association"
              className="object-cover w-full h-86"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
