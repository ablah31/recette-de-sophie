const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware pour analyser les données JSON
app.use(express.json());

// Ajoutez un middleware pour permettre CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permettre à tous les domaines d'accéder à votre API, à des fins de développement
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

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


// Définir une route pour créer une nouvelle recette
app.post('/recettes', (req, res) => {
  // Récupérer les données de la nouvelle recette à partir du corps de la requête
  const nouvelleRecette = req.body;

console.log(req.body); // Vérifiez les données reçues dans la console

  // Insérer la nouvelle recette dans la base de données
  const query = `INSERT INTO recettes (nom, categorie, source, etoiles, commentaires, ingredients) VALUES (?, ?, ?, ?, ?, ?)`;
  const ajoutRecette = [req.body.nom, nouvelleRecette.categorie, nouvelleRecette.source, nouvelleRecette.etoiles, nouvelleRecette.commentaires, nouvelleRecette.ingredients];
  db.run(query,ajoutRecette, function(err) {
      if (err) {
          console.error('Erreur lors de l\'insertion de la recette:', err.message);
          res.status(500).send('Erreur serveur lors de l\'insertion de la recette');
      } else {
          console.log('Recette insérée avec succès !');
          res.status(201).send('Recette insérée avec succès !');
      }
  });
});

// Définir une route pour récupérer toutes les recettes
app.get('/recettes', (req, res) => {
    const query = `SELECT * FROM recettes`;

    db.all(query, (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des recettes:', err.message);
            res.status(500).send('Erreur serveur');
        } else {
            res.json(rows);
            console.log("Serveur ok");
        }
    });
});




// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});
