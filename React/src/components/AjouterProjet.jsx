// src/components/AjouterProjet.jsx
// Formulaire pour ajouter un nouveau projet

import { useState } from "react";

const champVide = {
  libelle: "",
  image: "",
  description: "",
  technologies: "",
  lien: "",
  annee: new Date().getFullYear(),
};

function AjouterProjet({ onAjouter }) {
  const [champs, setChamps] = useState(champVide);
  const [visible, setVisible] = useState(false);

  // Met à jour un champ du formulaire
  function handleChange(e) {
    setChamps({ ...champs, [e.target.name]: e.target.value });
  }

  // Soumet le formulaire
  function handleSubmit(e) {
    e.preventDefault();
    if (!champs.libelle.trim()) {
      alert("Le libellé est obligatoire.");
      return;
    }
    onAjouter(champs);
    setChamps(champVide);
    setVisible(false);
  }

  if (!visible) {
    return (
      <button className="btn btn-primary" onClick={() => setVisible(true)}>
        + Nouveau projet
      </button>
    );
  }

  return (
    <form className="form-ajout" onSubmit={handleSubmit}>
      <h2>Ajouter un projet</h2>

      <label>Libellé *</label>
      <input
        name="libelle"
        value={champs.libelle}
        onChange={handleChange}
        placeholder="Nom du projet"
        required
      />

      <label>Image (URL)</label>
      <input
        name="image"
        value={champs.image}
        onChange={handleChange}
        placeholder="https://..."
      />

      <label>Description</label>
      <textarea
        name="description"
        value={champs.description}
        onChange={handleChange}
        rows={3}
        placeholder="Décrivez votre projet..."
      />

      <label>Technologies</label>
      <input
        name="technologies"
        value={champs.technologies}
        onChange={handleChange}
        placeholder="React, Node.js, ..."
      />

      <label>Lien GitHub / Demo</label>
      <input
        name="lien"
        value={champs.lien}
        onChange={handleChange}
        placeholder="https://github.com/..."
      />

      <label>Année</label>
      <input
        name="annee"
        type="number"
        value={champs.annee}
        onChange={handleChange}
        min={2000}
        max={2100}
      />

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Enregistrer
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setVisible(false)}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

export default AjouterProjet;
