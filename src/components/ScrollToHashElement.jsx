import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHashElement() {
  const location = useLocation();
  const lastHash = useRef("");

  useEffect(() => {
    const hash = location.hash;
    if (hash && hash !== lastHash.current) {
      lastHash.current = hash;
      const id = hash.replace(/^#/, "");
      let attempts = 0;

      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (attempts < 10) {
          attempts++;
          setTimeout(tryScroll, 100);
        }
      };
      tryScroll();
    }
  }, [location]);

  return null;
}
