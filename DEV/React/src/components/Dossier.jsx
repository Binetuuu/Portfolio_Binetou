// src/components/Dossier.jsx
import { useState, useEffect, useRef } from "react";
import Projet from "./Projet";
import AjouterProjet from "./AjouterProjet";
import DetaillerProjet from "./DetaillerProjet";
import { fetchProjets, ajouterProjet, supprimerProjet, modifierProjet } from "../api";

function Dossier() {
  const [projets, setProjets] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [projetActif, setProjetActif] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [toast, setToast] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".fade-up").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [projets]);

  useEffect(() => {
    fetchProjets()
      .then(setProjets)
      .catch(() => setErreur("Impossible de contacter le serveur. Lancez json-server."))
      .finally(() => setChargement(false));
  }, []);

  function afficherToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  async function handleAjouter(data) {
    try {
      const cree = await ajouterProjet(data);
      setProjets(prev => [...prev, cree]);
      setShowForm(false);
      afficherToast("Projet ajouté ✓");
    } catch { alert("Erreur lors de l'ajout."); }
  }

  async function handleSupprimer(id) {
    if (!window.confirm("Supprimer ce projet ?")) return;
    try {
      await supprimerProjet(id);
      setProjets(prev => prev.filter(p => p.id !== id));
      if (projetActif?.id === id) setProjetActif(null);
      afficherToast("Projet supprimé ✓");
    } catch { alert("Erreur lors de la suppression."); }
  }

  async function handleEditer(id, data) {
    try {
      const modifie = await modifierProjet(id, data);
      setProjets(prev => prev.map(p => p.id === id ? modifie : p));
      setProjetActif(modifie);
      afficherToast("Projet modifié ✓");
    } catch { alert("Erreur lors de la modification."); }
  }

  const projetsFiltres = projets.filter(p =>
    p.libelle.toLowerCase().includes(recherche.toLowerCase()) ||
    (p.technologies || "").toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <section id="projets" className="section section-alt" ref={ref}>
      <div className="section-header fade-up">
        <p className="section-eyebrow">Mes réalisations</p>
        <h2 className="section-title">Projets <span>récents</span></h2>
        <p className="section-subtitle">Une sélection de projets que j'ai conçus et développés.</p>
      </div>

      <div className="projets-controls fade-up">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input
            className="search-input"
            type="text"
            placeholder="Rechercher par nom ou technologie..."
            value={recherche}
            onChange={e => setRecherche(e.target.value)}
          />
        </div>
        <span className="projets-count">{projetsFiltres.length} projet(s)</span>
        <button className="btn btn-gold" onClick={() => setShowForm(true)}>+ Ajouter</button>
      </div>

      {showForm && <AjouterProjet onAjouter={handleAjouter} onFermer={() => setShowForm(false)} />}
      {projetActif && <DetaillerProjet projet={projetActif} onAnnuler={() => setProjetActif(null)} onEditer={handleEditer} />}

      {chargement && <p style={{color:"var(--text-muted)",textAlign:"center",padding:"3rem 0"}}>Chargement…</p>}
      {erreur && <p style={{color:"var(--danger)",textAlign:"center",padding:"3rem 0"}}>{erreur}</p>}

      {!chargement && !erreur && (
        <div className="projets-grid">
          {projetsFiltres.map((p, i) => (
            <div key={p.id} className="fade-up" style={{transitionDelay:`${i*0.07}s`}}>
              <Projet projet={p} onVoirDetail={setProjetActif} onSupprimer={handleSupprimer} />
            </div>
          ))}
        </div>
      )}
      {!chargement && !erreur && projetsFiltres.length === 0 && (
        <p style={{color:"var(--text-muted)",textAlign:"center",padding:"3rem 0"}}>Aucun projet trouvé.</p>
      )}
      {toast && <div className="toast">{toast}</div>}
    </section>
  );
}
export default Dossier;
