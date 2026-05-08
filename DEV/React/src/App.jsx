// src/App.jsx — Point d'entrée : assemble toutes les sections
import "./index.css";
import Navbar  from "./components/Navbar";
import Hero    from "./components/Hero";
import About   from "./components/About";
import Dossier from "./components/Dossier";
import Contact from "./components/Contact";
import Footer  from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Dossier />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
