// src/components/Dossier.jsx
// Composant principal qui gère la liste des projets :
//   - chargement depuis l'API
//   - ajout / suppression / modification
//   - affichage de la liste et du détail

import { useState, useEffect } from "react";
import Projet from "./Projet";
import AjouterProjet from "./AjouterProjet";
import DetaillerProjet from "./DetaillerProjet";
import {
  fetchProjets,
  ajouterProjet,
  supprimerProjet,
  modifierProjet,
} from "../api";

function Dossier() {
  const [projets, setProjets]           = useState([]);    // liste complète
  const [recherche, setRecherche]       = useState("");    // filtre de recherche
  const [projetActif, setProjetActif]   = useState(null);  // projet sélectionné
  const [chargement, setChargement]     = useState(true);  // indicateur de chargement
  const [erreur, setErreur]             = useState(null);  // message d'erreur

  // Charger les projets au montage
  useEffect(() => {
    fetchProjets()
      .then(setProjets)
      .catch(() => setErreur("Impossible de contacter le serveur. Lancez json-server."))
      .finally(() => setChargement(false));
  }, []);

  // ── Ajouter un projet ────────────────────────────────────────
  async function handleAjouter(nouveauProjet) {
    try {
      const cree = await ajouterProjet(nouveauProjet);
      setProjets([...projets, cree]);
    } catch {
      alert("Erreur lors de l'ajout.");
    }
  }

  // ── Supprimer un projet ──────────────────────────────────────
  async function handleSupprimer(id) {
    if (!window.confirm("Supprimer ce projet ?")) return;
    try {
      await supprimerProjet(id);
      setProjets(projets.filter((p) => p.id !== id));
      // Si le projet supprimé était affiché en détail, on ferme
      if (projetActif && projetActif.id === id) setProjetActif(null);
    } catch {
      alert("Erreur lors de la suppression.");
    }
  }

  // ── Modifier un projet ───────────────────────────────────────
  async function handleEditer(id, donnees) {
    try {
      const modifie = await modifierProjet(id, donnees);
      setProjets(projets.map((p) => (p.id === id ? modifie : p)));
      setProjetActif(modifie);
    } catch {
      alert("Erreur lors de la modification.");
    }
  }

  // ── Filtrer les projets selon la recherche ───────────────────
  const projetsFiltres = projets.filter((p) =>
    p.libelle.toLowerCase().includes(recherche.toLowerCase())
  );

  // ── Rendu ────────────────────────────────────────────────────
  return (
    <div className="dossier">
      {/* En-tête */}
      <header className="portfolio-header">
        <h1>Mon Portfolio</h1>
        <p>Bienvenue sur ma vitrine de projets</p>
      </header>

      {/* Zone de contrôle : recherche + ajout */}
      <div className="controls">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Rechercher un projet..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />
        <AjouterProjet onAjouter={handleAjouter} />
      </div>

      {/* États : chargement / erreur */}
      {chargement && <p className="msg-info">Chargement des projets…</p>}
      {erreur    && <p className="msg-erreur">{erreur}</p>}

      {/* Détail d'un projet sélectionné */}
      {projetActif && (
        <DetaillerProjet
          projet={projetActif}
          onAnnuler={() => setProjetActif(null)}
          onEditer={handleEditer}
        />
      )}

      {/* Liste des projets */}
      {!chargement && !erreur && (
        <>
          <p className="compteur">
            {projetsFiltres.length} projet(s) trouvé(s)
          </p>
          <div className="grille">
            {projetsFiltres.map((p) => (
              <Projet
                key={p.id}
                projet={p}
                onSupprimer={handleSupprimer}
                onSelectionner={setProjetActif}
              />
            ))}
          </div>
          {projetsFiltres.length === 0 && (
            <p className="msg-info">Aucun projet ne correspond à votre recherche.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Dossier;
