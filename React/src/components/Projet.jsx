// src/components/Projet.jsx
// Affiche le libellé, l'image d'un projet et un bouton Supprimer

function Projet({ projet, onSupprimer, onSelectionner }) {
  return (
    <div className="projet-card">
      <img
        src={projet.image}
        alt={projet.libelle}
        className="projet-img"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/400x200?text=Projet";
        }}
      />
      <div className="projet-body">
        {/* Le libellé est une ancre cliquable → affiche le détail */}
        <h3 className="projet-titre">
          <a
            href="#detail"
            onClick={(e) => {
              e.preventDefault();
              onSelectionner(projet);
            }}
          >
            {projet.libelle}
          </a>
        </h3>
        <p className="projet-tech">{projet.technologies}</p>
        <button
          className="btn btn-danger"
          onClick={() => onSupprimer(projet.id)}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default Projet;
