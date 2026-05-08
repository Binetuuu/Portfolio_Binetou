// src/components/About.jsx
import { useEffect, useRef } from "react";

const competences = [
  "React", "JavaScript", "Node.js", "Express",
  "MongoDB", "PostgreSQL", "HTML/CSS", "Git",
  "REST API", "Figma", "Docker", "Tailwindcss",
];

function About() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.15 }
    );
    ref.current?.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section" ref={ref}>
      <div className="about-grid">

        {/* Visuel */}
        <div className="about-visual fade-up">
          <div className="about-avatar">BRS</div>
          {/* <div className="about-badge">
            <strong>3+</strong>
            ans d'expérience
          </div> */}
        </div>

        {/* Texte */}
        <div className="about-text">
          <div className="section-header fade-up">
            <p className="section-eyebrow">À propos de moi</p>
            <h2 className="section-title">
              Passion pour le <span>code</span>
            </h2>
          </div>

          <p className="fade-up">
           En formation en développement web, je développe des compétences en création d’applications full-stack, notamment avec React. J’aime transformer des idées en interfaces simples, efficaces et agréables à utiliser.
          </p>
          <p className="fade-up">
            Mon approche allie rigueur technique et sensibilité design pour
            livrer des produits qui répondent aux besoins réels des utilisateurs.
          </p>

          <div className="skills-list fade-up">
            {competences.map((c) => (
              <span key={c} className="skill-tag">{c}</span>
            ))}
          </div>

          <div style={{ marginTop: "2rem" }} className="fade-up">
            <button
              className="btn btn-gold"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Travaillons ensemble
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

export default About;
