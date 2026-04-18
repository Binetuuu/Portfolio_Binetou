// src/components/Hero.jsx

function Hero() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="accueil" className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />

      <div className="hero-content">
        <p className="hero-eyebrow">Développeuse Full-Stack</p>

        <h1>
          Bonjour, je suis<br />
          <span>Binetou Seye</span>
        </h1>

        <p className="hero-desc">
          Je conçois et développe des applications web modernes,
          performantes et accessibles. Passionnée par le code propre
          et les interfaces qui font la différence.
        </p>

        <div className="hero-actions">
          <button
            className="btn btn-gold"
            onClick={() => scrollTo("projets")}
          >
            Voir mes projets
          </button>
          <button
            className="btn btn-outline"
            onClick={() => scrollTo("contact")}
          >
            Me contacter
          </button>
        </div>
      </div>

      <div className="hero-scroll">
        <div className="hero-scroll-line" />
        <span>Défiler</span>
      </div>
    </section>
  );
}

export default Hero;
