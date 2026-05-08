// src/components/DetaillerProjet.jsx
import { useState } from "react";

function DetaillerProjet({ projet, onAnnuler, onEditer }) {
  const [enEdition, setEnEdition] = useState(false);
  const [champs, setChamps] = useState({ ...projet });
  const techs = projet.technologies ? projet.technologies.split(",").map(t => t.trim()) : [];

  function handleChange(e) { setChamps({ ...champs, [e.target.name]: e.target.value }); }

  function handleSauvegarder(e) {
    e.preventDefault();
    if (!champs.libelle.trim()) { alert("Libellé obligatoire."); return; }
    onEditer(projet.id, champs);
    setEnEdition(false);
  }

  function handleBackdrop(e) { if (e.target === e.currentTarget) onAnnuler(); }

  if (!enEdition) return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal">
        <button className="modal-close-btn" onClick={onAnnuler}>✕</button>
        <div className="modal-img-wrap">
          {projet.image ? <img src={projet.image} alt={projet.libelle} /> : <span>— image du projet —</span>}
        </div>
        <div className="modal-body">
          <p className="modal-year">{projet.annee}</p>
          <h2 className="modal-title">{projet.libelle}</h2>
          <p className="modal-label">Description</p>
          <p className="modal-desc">{projet.description}</p>
          <p className="modal-label">Technologies</p>
          <div className="projet-card-tech" style={{marginTop:"0.5rem"}}>
            {techs.map(t => <span key={t} className="tech-pill">{t}</span>)}
          </div>
          {projet.lien && (<>
            <p className="modal-label">Lien</p>
            <a href={projet.lien} target="_blank" rel="noreferrer" className="modal-link">Voir le projet →</a>
          </>)}
          <div className="modal-actions">
            <button className="btn btn-gold btn-sm" onClick={() => setEnEdition(true)}>Éditer</button>
            <button className="btn btn-outline btn-sm" onClick={onAnnuler}>Annuler</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="form-overlay" onClick={handleBackdrop}>
      <div className="form-modal">
        <h2>Éditer <span>{projet.libelle}</span></h2>
        <div className="form-row">
          <div className="form-group"><label>Libellé *</label><input name="libelle" value={champs.libelle} onChange={handleChange} /></div>
          <div className="form-group"><label>Année</label><input name="annee" type="number" value={champs.annee} onChange={handleChange} /></div>
        </div>
        <div className="form-group"><label>Description</label><textarea name="description" rows={3} value={champs.description} onChange={handleChange} /></div>
        <div className="form-row">
          <div className="form-group"><label>Technologies</label><input name="technologies" value={champs.technologies} onChange={handleChange} /></div>
          <div className="form-group"><label>Lien</label><input name="lien" value={champs.lien || ""} onChange={handleChange} /></div>
        </div>
        <div className="form-group"><label>Image (URL)</label><input name="image" value={champs.image || ""} onChange={handleChange} /></div>
        <div className="form-actions">
          <button className="btn btn-gold" onClick={handleSauvegarder}>Sauvegarder</button>
          <button className="btn btn-outline" onClick={() => setEnEdition(false)}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default DetaillerProjet;
