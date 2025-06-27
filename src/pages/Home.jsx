import React, { useState, useEffect, useRef } from "react";
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

export default function Home({ onNavigate }) {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const sectionRefs = {
    accueil: useRef(null),
    actu: useRef(null),
    contact: useRef(null),
    about: useRef(null),
  };

  useEffect(() => {
    const handler = (e) => {
      if (!e.detail) return;
      if (sectionRefs[e.detail] && sectionRefs[e.detail].current) {
        sectionRefs[e.detail].current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };
    window.addEventListener("navigateSection", handler);
    return () => window.removeEventListener("navigateSection", handler);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 250);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionNav = (id) => {
    if (sectionRefs[id] && sectionRefs[id].current) {
      sectionRefs[id].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    if (onNavigate) onNavigate(id);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-white">
      <section
        id="accueil"
        ref={sectionRefs.accueil}
        className="w-full max-w-7xl px-4 sm:px-6 md:px-8 py-10 flex flex-col items-center text-center space-y-7"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 drop-shadow-lg">
          Bienvenue sur notre Plateforme
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-3xl">
          Découvrez la plateforme de l'Association des Élèves et Étudiants du
          Département de Kouto.
          <br />
          <span className="font-semibold text-blue-700">
            Ensemble, partageons l'information, la solidarité et l'excellence !
          </span>
        </p>
        <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1.2}
            centeredSlides
            loop
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              renderBullet: (index, className) =>
                `<span class="${className}" style="background-color: #1D4ED8"></span>`,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            className="relative w-full h-[36vw] min-h-[18rem] max-h-[35rem] md:h-[32rem]"
          >
            {carouselImages.map((image, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.jpg";
                    }}
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
      </section>

      <section
        id="actu"
        ref={sectionRefs.actu}
        className="w-full max-w-7xl px-4 sm:px-6 md:px-8 py-8 rounded-xl shadow-xl mt-8 bg-white scroll-mt-28 sm:scroll-mt-24 md:scroll-mt-32"
      >
        <Actu />
      </section>
      <section
        id="contact"
        ref={sectionRefs.contact}
        className="w-full max-w-7xl px-4 sm:px-6 md:px-8 py-8 rounded-xl shadow-xl mt-8 bg-white scroll-mt-28 sm:scroll-mt-24 md:scroll-mt-32"
      >
        <Contact />
      </section>
      <section
        id="about"
        ref={sectionRefs.about}
        className="w-full max-w-7xl px-4 sm:px-6 md:px-8 py-8 rounded-xl shadow-xl mt-8 bg-white scroll-mt-28 sm:scroll-mt-24 md:scroll-mt-32"
      >
        <Apropos />
      </section>

      {showTopBtn && (
        <button
          className="fixed bottom-10 right-10 btn btn-circle z-50"
          aria-label="Haut de page"
          style={{
            background: "#1D4ED8",
            color: "#fff",
            border: "none",
            boxShadow: "0 4px 24px 0 rgba(0,0,0,.2)",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp size={26} />
        </button>
      )}
    </div>
  );
}
