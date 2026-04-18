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
          <span>Binetou Rassoul Seye</span>
        </h1>

        <em className="hero-desc">
         Développeur fullstack passionné, je crée des applications web modernes, rapides et sécurisées, en maîtrisant
        l’ensemble de la chaîne technique : frontend, backend, bases de données et infrastructure. J’exploite également
        mes compétences en réseaux, systèmes, cloud (AWS), DevOps et data analyse pour concevoir des solutions complètes
        et intelligentes. Mon ambition est de concevoir des produits performants, évolutifs et centrés sur
        l’utilisateur, capables de répondre à des problématiques réelles avec efficacité.
        </em>

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
