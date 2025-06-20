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
              <span>KOUTO,Région de la BAGOUE, Côte d'Ivoire</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-primary" />
              <a href="tel:+22512345678" className="link link-hover">
                +225 12 34 56 78
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="text-primary" />
              <a href="mailto:contact@gmail.com" className="link link-hover">
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
              title="Localisation Association"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "350px" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12687.491195366669!2d-4.0082565!3d5.3453177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfb84ddc5b27f4a5%3A0x5c508b72271e5df4!2sAbidjan!5e0!3m2!1sfr!2sci!4v1717356431372!5m2!1sfr!2sci"
            ></iframe>
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
