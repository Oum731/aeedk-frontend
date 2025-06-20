import React, { useState, useEffect } from "react";
import plage from "../assets/plage1.jpeg";

const images = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
];

export default function Apropos() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setTimeout(
      () => setIndex((i) => (i + 1) % images.length),
      3500
    );
    return () => clearTimeout(timer);
  }, [index]);

  // Style de texte pour l'effet "contour" noir (shadow dans 4 directions)
  const textOutline = {
    textShadow: `
      -2px -2px 0 #000,  
       2px -2px 0 #000,  
      -2px  2px 0 #000,  
       2px  2px 0 #000
    `,
  };

  return (
    <div className="max-w-4xl mx-auto py-2 px-1 sm:px-4">
      <div className="mb-2 mt-2">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-1 text-blue-700">
          À Propos
        </h1>
        <p className="text-center font-medium text-base text-black">
          <span className="font-semibold">
            Association des Élèves et Étudiants du Département de Kouto
          </span>
        </p>
      </div>

      <div className="w-full flex justify-center my-8">
        <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-2xl aspect-video bg-gray-200">
          <iframe
            src="https://www.youtube.com/embed/iMbYPk-Q0t4"
            title="Présentation AEEDK"
            className="w-full h-full"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="bg-[#1D4ED8]/100 rounded-lg p-4 mb-4 shadow-sm">
        <h2 className="text-lg font-bold mb-2 text-white text-center">
          Notre mission
        </h2>
        <ul className="list-disc pl-6 space-y-1 text-base text-white">
          <li>
            Créer un réseau de solidarité entre élèves et étudiants du
            département de Kouto.
          </li>
          <li>
            Promouvoir l’excellence académique, la citoyenneté, et l’entraide
            sociale.
          </li>
          <li>
            Organiser des événements éducatifs, culturels et sportifs ouverts à
            tous.
          </li>
          <li>
            Encourager le retour au village et la valorisation de la culture
            locale.
          </li>
          <li>
            Faciliter l’insertion professionnelle et le mentorat pour les plus
            jeunes.
          </li>
        </ul>
      </div>

      <div className="bg-[#1D4ED8]/100 rounded-lg p-4 mb-4 text-sm md:text-base flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <span
            className="block font-bold text-white text-2xl px-4 py-1 rounded"
            style={textOutline}
          >
            +500
          </span>
          <span className="block text-white">membres, élèves & étudiants</span>
        </div>
        <div>
          <span
            className="block font-bold text-white text-2xl px-4 py-1 rounded"
            style={textOutline}
          >
            10+
          </span>
          <span className="block text-white">événements annuels</span>
        </div>
        <div>
          <span
            className="block font-bold text-white text-2xl px-4 py-1 rounded"
            style={textOutline}
          >
            30+
          </span>
          <span className="block text-white">villages représentés</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3 items-center">
        <div className="flex flex-col gap-1 justify-center text-white">
          <h3 className="font-semibold text-lg mb-1 text-[#1D4ED8]">
            Coordonnées
          </h3>
          <span>
            <strong>Siège :</strong> Kouto, Région de la Bagoué, Côte d’Ivoire
          </span>
          <span>
            <strong>Email :</strong>{" "}
            <a
              className="text-[#1D4ED8] underline"
              href="mailto:contact.aeedk@gmail.com"
            >
              contact.aeedk@gmail.com
            </a>
          </span>
          <span>
            <strong>Téléphone :</strong> +225 07 07 07 07 07
          </span>
          <span>
            <strong>Réseaux sociaux :</strong>{" "}
            <a
              className="text-blue-400 underline"
              href="https://facebook.com/aeedk"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook AEEDK
            </a>
          </span>
          <span>
            <strong>Président actuel :</strong>{" "}
            <span className="font-medium text-[#1D4ED8]">
              M. DEMBELE BAKARY
            </span>
          </span>
          <span>
            <strong>Année de création :</strong> 2003
          </span>
        </div>
        <div className="w-full h-56 md:h-72 rounded-lg overflow-hidden shadow flex items-center justify-center">
          <img
            src={plage}
            alt="Kouto Côte d'Ivoire"
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      </div>

      <div className="text-center text-base italic text-[#1D4ED8] mt-8 mb-1">
        « Unis pour la réussite, la solidarité et l’excellence à Kouto et
        ailleurs »
      </div>
    </div>
  );
}
