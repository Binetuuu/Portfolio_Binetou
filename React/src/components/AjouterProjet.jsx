// src/components/AjouterProjet.jsx
import { useState } from "react";
const vide = { libelle:"", image:"", description:"", technologies:"", lien:"", annee: new Date().getFullYear() };

function AjouterProjet({ onAjouter, onFermer }) {
  const [champs, setChamps] = useState(vide);
  function handleChange(e) { setChamps({ ...champs, [e.target.name]: e.target.value }); }
  function handleSubmit(e) {
    e.preventDefault();
    if (!champs.libelle.trim()) { alert("Libellé obligatoire."); return; }
    onAjouter(champs);
    setChamps(vide);
  }
  function handleBackdrop(e) { if (e.target === e.currentTarget) onFermer(); }
  return (
    <div className="form-overlay" onClick={handleBackdrop}>
      <div className="form-modal">
        <h2>Nouveau <span>projet</span></h2>
        <div className="form-row">
          <div className="form-group"><label>Libellé *</label><input name="libelle" value={champs.libelle} onChange={handleChange} placeholder="Nom du projet" /></div>
          <div className="form-group"><label>Année</label><input name="annee" type="number" value={champs.annee} onChange={handleChange} /></div>
        </div>
        <div className="form-group"><label>Description</label><textarea name="description" rows={3} value={champs.description} onChange={handleChange} placeholder="Décrivez votre projet..." /></div>
        <div className="form-row">
          <div className="form-group"><label>Technologies</label><input name="technologies" value={champs.technologies} onChange={handleChange} placeholder="React, Node.js, ..." /></div>
          <div className="form-group"><label>Lien GitHub / Démo</label><input name="lien" value={champs.lien} onChange={handleChange} placeholder="https://..." /></div>
        </div>
        <div className="form-group"><label>Image (URL)</label><input name="image" value={champs.image} onChange={handleChange} placeholder="https://..." /></div>
        <div className="form-actions">
          <button className="btn btn-gold" onClick={handleSubmit}>Enregistrer</button>
          <button className="btn btn-outline" onClick={onFermer}>Annuler</button>
        </div>
      </div>
    </div>
  );
}
export default AjouterProjet;
