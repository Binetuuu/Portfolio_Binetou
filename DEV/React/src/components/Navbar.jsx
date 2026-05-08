// src/components/Navbar.jsx
import { useState, useEffect } from "react";

const liens = [
  { id: "accueil", label: "Accueil" },
  { id: "about",   label: "À propos" },
  { id: "projets", label: "Projets" },
  { id: "contact", label: "Contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState("accueil");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      // Détection de la section active
      liens.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) setActive(id);
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-logo">folio.Binetou</div>
      <ul className="nav-links">
        {liens.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={active === id ? "active" : ""}
              onClick={(e) => { e.preventDefault(); scrollTo(id); }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
