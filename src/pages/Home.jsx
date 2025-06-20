import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ArrowUp } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Actu from "./Actu";
import Contact from "./Contact";
import Apropos from "./Apropos";
import cadeau from "../assets/cadeau.jpeg";
import equipemixte from "../assets/equipemixte.jpeg";
import plage3 from "../assets/plage3.jpeg";
import remise from "../assets/remise.jpeg";
import prefet from "../assets/prefet.jpeg";

const carouselImages = [
  { url: cadeau, alt: "Remise de cadeaux", caption: "Événements caritatifs" },
  { url: equipemixte, alt: "Équipe mixte", caption: "Activités sportives" },
  { url: plage3, alt: "Sortie à la plage", caption: "Loisirs et détente" },
  {
    url: remise,
    alt: "Cérémonie de remise",
    caption: "Reconnaissance académique",
  },
  {
    url: prefet,
    alt: "Rencontre officielle",
    caption: "Engagement communautaire",
  },
];

export default function Home() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 250);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="flex flex-col items-center min-h-screen w-full"
      style={{ backgroundColor: "#fff" }}
    >
      <section
        id="accueil"
        className="flex flex-col pt-0 justify-center items-center w-[90vw] max-w-7xl min-h-[90vh] mx-auto py-10"
      >
        <div className="w-full h-full text-center pt-0 space-y-7 flex flex-col items-center justify-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 drop-shadow-lg">
            Bienvenue sur notre Platforme
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
            Découvrez la plateforme de l'Association des Élèves et Étudiants du
            Département de Kouto.
            <br />
            <span className="font-semibold" style={{ color: "#1D4ED8" }}>
              Ensemble, partageons l'information, la solidarité et
              l'excellence !
            </span>
          </p>

          {/* Swiper SANS bg-white */}
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1.2}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                renderBullet: (index, className) => {
                  return `<span class="${className}" style="background-color: #1D4ED8"></span>`;
                },
              }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              className="relative w-full h-[36vw] min-h-[18rem] max-h-[35rem] md:h-[32rem] transition-all"
            >
              {carouselImages.map((image, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full h-full rounded-2xl overflow-hidden transition-transform duration-300 swiper-slide">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover object-center transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <p className="text-white text-lg font-semibold text-center tracking-wide drop-shadow-lg">
                        {image.caption}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <div
                className="swiper-button-next after:!text-[32px]"
                style={{ color: "#1D4ED8" }}
              ></div>
              <div
                className="swiper-button-prev after:!text-[32px]"
                style={{ color: "#1D4ED8" }}
              ></div>
            </Swiper>
          </div>
        </div>
      </section>

      <section
        id="actu"
        className="w-[90vw] max-w-7xl min-h-[80vh] mx-auto pt-8 bg-white px-4 sm:px-6 md:px-8 py-8 rounded-xl shadow-xl mt-8"
      >
        <Actu />
      </section>

      <section
        id="contact"
        className="w-[90vw] max-w-7xl min-h-[80vh] mx-auto pt-8 bg-white px-4 sm:px-6 md:px-8 py-8 rounded-xl shadow-xl mt-8 mb-10"
      >
        <div className="max-w-6xl mx-auto">
          <Contact />
        </div>
      </section>
      <section
        id="about"
        className="w-[90vw] max-w-7xl min-h-[80vh] mx-auto pt-8 bg-white px-4 sm:px-6 md:px-8 py-8 rounded-xl shadow-xl mt-8"
      >
        <div className="max-w-6xl mx-auto">
          <Apropos />
        </div>
      </section>
      {showTopBtn && (
        <button
          className="fixed bottom-10 right-10 btn btn-circle z-50"
          style={{
            background: "#1D4ED8",
            color: "#fff",
            border: "none",
            boxShadow: "0 4px 24px 0 rgba(0,0,0,.2)",
          }}
          title="Haut de page"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp size={26} />
        </button>
      )}
    </div>
  );
}
