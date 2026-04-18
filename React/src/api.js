// src/api.js
// Service d'accès à l'API REST (json-server sur http://localhost:3001)

const BASE_URL = "http://localhost:3001/projets";

// Récupérer tous les projets
export async function fetchProjets() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Erreur lors du chargement des projets");
  return res.json();
}

// Récupérer un projet par son id
export async function fetchProjetById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Projet introuvable");
  return res.json();
}

// Ajouter un nouveau projet
export async function ajouterProjet(projet) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projet),
  });
  if (!res.ok) throw new Error("Erreur lors de l'ajout du projet");
  return res.json();
}

// Modifier un projet existant
export async function modifierProjet(id, projet) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projet),
  });
  if (!res.ok) throw new Error("Erreur lors de la modification");
  return res.json();
}

// Supprimer un projet
export async function supprimerProjet(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
}
