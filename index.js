document.addEventListener("DOMContentLoaded", function() {
    const ajouterRecetteForm = document.getElementById('ajouter-recette-form');

    ajouterRecetteForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche la soumission du formulaire de recharger la page

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
                // Effacer le formulaire après l'ajout de la recette
                ajouterRecetteForm.reset();
                
                // Mettre à jour l'affichage des recettes sur la page
                afficherRecettes(data);
            })
            .catch(error => console.error('Erreur lors de l\'ajout de la recette:', error));
    });

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
        })
        .catch(error => console.error('Erreur de chargement du fichier JSON:', error));
});
