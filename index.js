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

    // Fonction pour ajouter une recette
    function ajouterRecette(nouvelleRecette) {
        // Récupérer les recettes existantes depuis le fichier JSON
        fetch('recette.json')
            .then(response => response.json())
            .then(data => {
                // Ajouter la nouvelle recette aux recettes existantes
                data.push(nouvelleRecette);

                // Mettre à jour le fichier JSON avec la nouvelle recette
                return fetch('recette.json', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            })
            .then(() => {
                // Après avoir ajouté la recette, recharger et afficher toutes les recettes
                fetch('recette.json')
                    .then(response => response.json())
                    .then(data => {
                        afficherRecettes(data);
                    })
                    .catch(error => console.error('Erreur lors du chargement des recettes:', error));
            })
            .catch(error => console.error('Erreur lors de l\'ajout de la recette:', error));
    }

    // Ajouter un écouteur d'événements pour le formulaire d'ajout de recette
    const ajouterRecetteForm = document.getElementById('ajouter-recette-form');
    ajouterRecetteForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche la soumission du formulaire de recharger la page

        // Récupérer les données du formulaire
        const nomRecetteInput = document.getElementById('nom-recette');
        const categorieInput = document.getElementById('categorie');
        const sourceInput = document.getElementById('source');
        const etoilesInput = document.getElementById('etoiles');
        const commentairesInput = document.getElementById('commentaires');
        const ingredientsInput = document.getElementById('ingredients');

        // Créer un objet représentant la nouvelle recette
        const nouvelleRecette = {
            "Recette": nomRecetteInput.value,
            "Catégorie": categorieInput.value,
            "Source": sourceInput.value,
            "Nombre d'étoiles": etoilesInput.value,
            "Commentaires": commentairesInput.value,
            "Ingrédients": ingredientsInput.value
        };

        // Ajouter la nouvelle recette
        ajouterRecette(nouvelleRecette);

        // Réinitialiser le formulaire après l'ajout de la recette
        ajouterRecetteForm.reset();
    });

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

    // Afficher toutes les recettes au chargement initial
    fetch('recette.json')
        .then(response => response.json())
        .then(data => {
            afficherRecettes(data);
        })
        .catch(error => console.error('Erreur de chargement du fichier JSON:', error));
});
