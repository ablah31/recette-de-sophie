document.addEventListener("DOMContentLoaded", function() {
    // Fonction pour afficher les recettes
    function afficherRecettes(recettes) {
        const recettesContainer = document.getElementById('recettes-container');
        recettesContainer.innerHTML = '';

        recettes.forEach(recette => {
            const recetteDiv = document.createElement('div');
            recetteDiv.classList.add('recette');

            // Générer le lien en fonction de la source
            let lienRecette = '';

            switch (recette.Source.toLowerCase()) {
                case 'la cuisine de bernard':
                    lienRecette = `https://lacuisinedebernard.com/${encodeURIComponent(recette.Recette)}/`;
                    break;
                case "c'est ma fournée":
                    lienRecette = `https://www.cestmafournee.com/search?q=${encodeURIComponent(recette.Recette)}`;
                    break;
                case 'alter gusto':
                    lienRecette = `https://www.altergusto.fr/?s=${encodeURIComponent(recette.Recette)}`;
                    break;
                case 'papilles et pupilles':
                    lienRecette = `https://www.papillesetpupilles.fr/?s=${encodeURIComponent(recette.Recette)}`;
                    break;
                case 'pankaj blog':
                    lienRecette = `https://www.pankaj-blog.com/?s=${encodeURIComponent(recette.Recette)}`;
                    break;
                case 'un déjeuner de soleil':
                    lienRecette = `https://www.undejeunerdesoleil.com/?s=${encodeURIComponent(recette.Recette)}`;
                    break;
                default:
                    lienRecette = '#'; // Lien par défaut, peut être modifié selon les besoins
            }

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

    // Appel initial pour afficher toutes les recettes
    fetch('recette.json')
        .then(response => response.json())
        .then(data => {
            afficherRecettes(data);

            // Ajouter un écouteur d'événements pour la recherche
            const searchInput = document.getElementById('search');
            searchInput.addEventListener('input', function() {
                const searchTerm = searchInput.value.toLowerCase();
                const recettes = Array.from(document.querySelectorAll('.recette'));

                recettes.forEach(recette => {
                    const recetteTitle = recette.querySelector('h2').textContent.toLowerCase();
                    const recetteCategory = recette.querySelector('.categorie').textContent.toLowerCase();
                    const recetteSource = recette.querySelector('p:nth-of-type(2)').textContent.toLowerCase();

                    if (recetteTitle.includes(searchTerm) || recetteCategory.includes(searchTerm) || recetteSource.includes(searchTerm)) {
                        recette.style.display = 'block';
                    } else {
                        recette.style.display = 'none';
                    }
                });
            });
        })
        .catch(error => console.error('Erreur de chargement du fichier JSON:', error));
});
