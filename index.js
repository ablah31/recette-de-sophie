document.addEventListener("DOMContentLoaded", function() {
    // Charger le fichier JSON
    fetch('recette.json') // Modifiez le chemin en conséquence si nécessaire
      .then(response => response.json())
      .then(data => {
        const recettesContainer = document.getElementById('recettes-container');
        const searchInput = document.getElementById('search');
  
        // Afficher toutes les recettes au chargement initial
        afficherRecettes(data);
  
        // Ajouter un écouteur d'événements pour la recherche
        searchInput.addEventListener('input', function() {
          const searchTerm = searchInput.value.toLowerCase();
          const recettesFiltrees = data.filter(recette =>
            recette.Recette.toLowerCase().includes(searchTerm) ||
            recette.Catégorie.toLowerCase().includes(searchTerm) ||
            recette.Source.toLowerCase().includes(searchTerm)
          );
  
          // Afficher les recettes filtrées
          afficherRecettes(recettesFiltrees);
        });
      })
      .catch(error => console.error('Erreur de chargement du fichier JSON:', error));
  
    // Fonction pour afficher les recettes
    function afficherRecettes(recettes) {
      const recettesContainer = document.getElementById('recettes-container');
      recettesContainer.innerHTML = '';
  
      recettes.forEach(recette => {
        const recetteDiv = document.createElement('div');
        recetteDiv.classList.add('recette');
  
        // Ajoute un lien pour chaque recette
        const lienRecette = `https://www.undejeunerdesoleil.com/?s=${encodeURIComponent(recette.Recette)}`;
  
        recetteDiv.innerHTML = `
          <h2><a href="${lienRecette}" target="_blank">${recette.Recette}</a></h2>
          <p class="categorie">Catégorie: ${recette.Catégorie}</p>
          <p>Source: ${recette.Source}</p>
          <p class="etoiles">Nombre d'étoiles: ${recette["Nombre d'étoiles"]}</p>
          <p class="commentaires">Commentaires: ${recette.Commentaires}</p>
          <p class="ingredients">Ingrédients: ${recette.Ingrédients}</p>
        `;
  
        recettesContainer.appendChild(recetteDiv);
      });
    }
  });
  