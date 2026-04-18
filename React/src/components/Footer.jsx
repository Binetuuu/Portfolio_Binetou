// src/components/Footer.jsx

function Footer() {
  const annee = new Date().getFullYear();

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo">Binetou.</div>

        <ul className="footer-links">
          {[["accueil","Accueil"],["about","À propos"],["projets","Projets"],["contact","Contact"]].map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>
                {label}
              </a>
            </li>
          ))}
        </ul>

        <p className="footer-copy">
          © {annee} <span>Binetou Seye</span>. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
