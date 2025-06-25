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

  const textOutline = {
    textShadow: `
      -2px -2px 0 #000,  
       2px -2px 0 #000,  
      -2px  2px 0 #000,  
       2px  2px 0 #000
    `,
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4 text-gray-800">
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-1">
          À Propos
        </h1>
        <p className="text-center font-medium">
          <span className="font-semibold">
            Association des Élèves et Étudiants du Département de Kouto (AEEDK)
          </span>
        </p>
      </div>

      {/* Carrousel d'images inspirantes */}
      <div className="flex justify-center my-4">
        <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow border-2 border-blue-100 bg-gray-100">
          <img
            src={images[index]}
            alt="Inspirations Kouto"
            className="w-full h-full object-cover transition duration-500"
            draggable={false}
          />
        </div>
      </div>

      {/* Vidéo présentation */}
      <div className="w-full flex justify-center my-8">
        <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-2xl aspect-video bg-gray-200">
          <iframe
            src="https://www.youtube.com/embed/iMbYPk-Q0t4"
            title="Présentation AEEDK"
            className="w-full h-full"
            allowFullScreen
            aria-label="Présentation vidéo AEEDK"
          ></iframe>
        </div>
      </div>

      <div className="bg-[#1D4ED8] rounded-lg p-4 mb-4 shadow-sm text-white">
        <h2 className="text-lg font-bold mb-2 text-center">Notre mission</h2>
        <ul className="list-disc pl-6 space-y-1 text-base">
          <li>
            Créer un réseau de solidarité entre élèves et étudiants du
            département de Kouto.
          </li>
          <li>
            Promouvoir l’excellence académique, la citoyenneté et l’entraide
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

      <div className="bg-[#1D4ED8] rounded-lg p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white text-sm md:text-base">
        <div>
          <span
            className="block font-bold text-2xl px-4 py-1 rounded"
            style={textOutline}
          >
            +500
          </span>
          <span className="block">membres AEEDK</span>
        </div>
        <div>
          <span
            className="block font-bold text-2xl px-4 py-1 rounded"
            style={textOutline}
          >
            10+
          </span>
          <span className="block">événements annuels</span>
        </div>
        <div>
          <span
            className="block font-bold text-2xl px-4 py-1 rounded"
            style={textOutline}
          >
            48
          </span>
          <span className="block">villages représentés</span>
        </div>
        <div>
          <span
            className="block font-bold text-2xl px-4 py-1 rounded"
            style={textOutline}
          >
            5
          </span>
          <span className="block">sous-préfectures</span>
        </div>
      </div>

      <div className="my-10">
        <h3 className="text-xl font-semibold text-[#1D4ED8] mb-3 text-center">
          Les 5 sous-préfectures du département de Kouto
        </h3>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center text-sm sm:text-base font-medium text-gray-700 mb-4">
          <li className="bg-blue-50 rounded p-2 shadow">Kouto</li>
          <li className="bg-blue-50 rounded p-2 shadow">Gbon</li>
          <li className="bg-blue-50 rounded p-2 shadow">Sianhala</li>
          <li className="bg-blue-50 rounded p-2 shadow">Blességué</li>
          <li className="bg-blue-50 rounded p-2 shadow">Kolia</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mt-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-lg mb-1 text-[#1D4ED8]">
            Coordonnées
          </h3>
          <span>
            <strong>Siège :</strong> Kouto, Région de la Bagoué, Côte d’Ivoire
          </span>
          <span>
            <strong>Email :</strong>{" "}
            <a
              href="mailto:contact.aeedk@gmail.com"
              className="text-[#1D4ED8] underline"
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
              href="https://facebook.com/aeedk"
              className="text-blue-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook AEEDK
            </a>
          </span>
          <span>
            <strong>Président actuel :</strong>{" "}
            <span className="text-[#1D4ED8] font-medium">
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
            draggable={false}
          />
        </div>
      </div>

      <div className="text-center text-base italic text-[#1D4ED8] mt-8 mb-4">
        « Unis pour la réussite, la solidarité et l’excellence à Kouto et
        ailleurs »
      </div>
    </div>
  );
}
