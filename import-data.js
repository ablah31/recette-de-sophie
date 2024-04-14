const sqlite3 = require('sqlite3').verbose();

// Chemin vers le fichier de base de données SQLite
const dbPath = 'recette_sophie.db';

// Créer une connexion à la base de données
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur lors de la connexion à la base de données:', err.message);
  } else {
    console.log('Connexion à la base de données SQLite réussie.');
  }
});

// Lire les données du fichier JSON
const recettesData = require('./recette.json');

// Insérer les données dans la base de données
recettesData.forEach(recette => {
    const Recette = recette.Recette;
    const Catégorie = recette['Catégorie'];
    const Source = recette.Source;
    const NombreEtoiles = recette['Nombre d\'étoiles']; // Utilisez une clé entre crochets pour accéder à la propriété avec un nom contenant des espaces
    const Commentaires = recette.Commentaires;
    const Ingrédients = recette.Ingrédients;
    
  const query = `INSERT INTO recettes (nom, categorie, source, etoiles, commentaires, ingredients) VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(query, [Recette, Catégorie, Source, NombreEtoiles, Commentaires, Ingrédients], function(err) {
    if (err) {
      console.error('Erreur lors de l\'insertion de la recette:', err.message);
    } else {
      console.log('Recette insérée avec succès !');
    }
  });
});
