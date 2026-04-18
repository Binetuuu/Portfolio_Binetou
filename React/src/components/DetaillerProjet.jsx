// src/components/DetaillerProjet.jsx
// Affiche les informations complètes d'un projet
// Bouton Annuler → ferme le détail
// Bouton Editer  → passe en mode édition

import { useState } from "react";

function DetaillerProjet({ projet, onAnnuler, onEditer }) {
  const [enEdition, setEnEdition] = useState(false);
  const [champs, setChamps] = useState({ ...projet });

  function handleChange(e) {
    setChamps({ ...champs, [e.target.name]: e.target.value });
  }

  function handleSauvegarder(e) {
    e.preventDefault();
    onEditer(projet.id, champs);
    setEnEdition(false);
  }

  // ── Mode lecture ──────────────────────────────────────────────
  if (!enEdition) {
    return (
      <div className="detail-card">
        <img
          src={projet.image}
          alt={projet.libelle}
          className="detail-img"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/800x300?text=Projet";
          }}
        />
        <div className="detail-body">
          <h2>{projet.libelle}</h2>
          <p className="detail-annee">Année : {projet.annee}</p>
          <p className="detail-desc">{projet.description}</p>
          <p>
            <strong>Technologies :</strong> {projet.technologies}
          </p>
          {projet.lien && (
            <p>
              <strong>Lien :</strong>{" "}
              <a href={projet.lien} target="_blank" rel="noreferrer">
                {projet.lien}
              </a>
            </p>
          )}

          <div className="form-actions">
            <button
              className="btn btn-primary"
              onClick={() => setEnEdition(true)}
            >
              Éditer
            </button>
            <button className="btn btn-secondary" onClick={onAnnuler}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Mode édition ──────────────────────────────────────────────
  return (
    <form className="form-ajout" onSubmit={handleSauvegarder}>
      <h2>Éditer le projet</h2>

      <label>Libellé *</label>
      <input
        name="libelle"
        value={champs.libelle}
        onChange={handleChange}
        required
      />

      <label>Image (URL)</label>
      <input
        name="image"
        value={champs.image}
        onChange={handleChange}
      />

      <label>Description</label>
      <textarea
        name="description"
        value={champs.description}
        onChange={handleChange}
        rows={3}
      />

      <label>Technologies</label>
      <input
        name="technologies"
        value={champs.technologies}
        onChange={handleChange}
      />

      <label>Lien</label>
      <input
        name="lien"
        value={champs.lien}
        onChange={handleChange}
      />

      <label>Année</label>
      <input
        name="annee"
        type="number"
        value={champs.annee}
        onChange={handleChange}
      />

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Sauvegarder
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setEnEdition(false)}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default DetaillerProjet;
