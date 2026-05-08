const mongoose = require('mongoose');

/**
 * Connexion à MongoDB via Mongoose.
 * La chaîne de connexion est lue depuis la variable d'environnement MONGO_URI.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur de connexion MongoDB : ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
