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
              src="https://www.google.com/maps/place/H%C3%94TEL+PRINTEMPS+KATANA/@9.8926808,-6.4222343,17z/data=!3m1!4b1!4m9!3m8!1s0xfb37f73737de579:0xd56f91d6b7dac154!5m2!4m1!1i2!8m2!3d9.8926755!4d-6.4196594!16s%2Fg%2F11t01ctqlm?entry=ttu&g_ep=EgoyMDI1MDYxNy4wIKXMDSoASAFQAw%3D%3D"
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
