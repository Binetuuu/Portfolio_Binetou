// src/components/Projet.jsx
function Projet({ projet, onVoirDetail, onSupprimer }) {
  const techs = projet.technologies
    ? projet.technologies.split(",").map((t) => t.trim())
    : [];

  return (
    <div className="projet-card">
      <div className="projet-card-img-wrap">
        {projet.image ? (
          <img src={projet.image} alt={projet.libelle} />
        ) : (
          <span>— image du projet —</span>
        )}
      </div>
      <div className="projet-card-body">
        <p className="projet-card-year">{projet.annee}</p>
        <h3 className="projet-card-title" onClick={() => onVoirDetail(projet)}>
          {projet.libelle}
        </h3>
        <p className="projet-card-desc">{projet.description}</p>
        {techs.length > 0 && (
          <div className="projet-card-tech">
            {techs.map((t) => <span key={t} className="tech-pill">{t}</span>)}
          </div>
        )}
        <div className="projet-card-actions">
          <button className="btn btn-gold btn-sm" onClick={() => onVoirDetail(projet)}>
            Voir détail →
          </button>
          <button className="btn-danger-sm" onClick={() => onSupprimer(projet.id)}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
export default Projet;
