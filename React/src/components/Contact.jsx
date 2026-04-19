// src/components/Contact.jsx
import { useState, useEffect, useRef } from "react";

function Contact() {
  const [champs, setChamps] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [envoye, setEnvoye] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.15 }
    );
    ref.current?.querySelectorAll(".fade-up").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handleChange(e) {
    setChamps({ ...champs, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!champs.nom || !champs.email || !champs.message) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    // Simulation d'envoi (à remplacer par un vrai appel API)
    setEnvoye(true);
    setTimeout(() => { setEnvoye(false); setChamps({ nom: "", email: "", sujet: "", message: "" }); }, 4000);
  }

  return (
    <section id="contact" className="section" ref={ref}>
      <div className="section-header fade-up">
        <p className="section-eyebrow">Me contacter</p>
        <h2 className="section-title">Travaillons <span>ensemble</span></h2>
        <p className="section-subtitle">
          Vous avez un projet en tête ? Je serais ravie d'en discuter avec vous.
        </p>
      </div>

      <div className="contact-grid">
        {/* Infos de contact */}
        <div className="contact-info fade-up">
          <p>
            Disponible pour des missions freelance, des collaborations ou
            des opportunités d'emploi. N'hésitez pas à me contacter !
          </p>

          <div className="contact-item">
            <div className="contact-icon">✉</div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "2px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Email</div>
              <div>seye10bineta@gmail.com</div>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">◎</div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "2px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Localisation</div>
              <div>Dakar, Sénégal</div>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">⬡</div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "2px", letterSpacing: "0.1em", textTransform: "uppercase" }}>LinkedIn</div>
              <div>linkedin.com/in/binetou-seye</div>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">{}</div>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "2px", letterSpacing: "0.1em", textTransform: "uppercase" }}>GitHub</div>
              <div>github.com/Binetuuu</div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="contact-form-box fade-up">
          <h3>Envoyer un message</h3>

          {envoye ? (
            <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--gold)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✓</div>
              <p style={{ fontFamily: "var(--font-head)", fontSize: "1.2rem" }}>Message envoyé !</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.5rem" }}>Je vous répondrai dans les plus brefs délais.</p>
            </div>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label>Nom *</label>
                  <input name="nom" value={champs.nom} onChange={handleChange} placeholder="Votre nom" />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input name="email" type="email" value={champs.email} onChange={handleChange} placeholder="votre@email.com" />
                </div>
              </div>

              <div className="form-group">
                <label>Sujet</label>
                <input name="sujet" value={champs.sujet} onChange={handleChange} placeholder="Objet de votre message" />
              </div>

              <div className="form-group">
                <label>Message *</label>
                <textarea name="message" rows={5} value={champs.message} onChange={handleChange} placeholder="Décrivez votre projet ou votre demande..." />
              </div>

              <button
                className="btn btn-gold"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={handleSubmit}
              >
                Envoyer le message →
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;
