document.addEventListener("DOMContentLoaded", function() {
    const toggleFormButton = document.getElementById('toggle-form-btn');
    const ajouterRecetteForm = document.getElementById('ajouter-recette-form');

    toggleFormButton.addEventListener('click', function() {
        // Basculer l'affichage du formulaire
        if (ajouterRecetteForm.style.display === 'none') {
            ajouterRecetteForm.style.display = 'block';
        } else {
            ajouterRecetteForm.style.display = 'none';
        }
    });

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

    // Fonction pour afficher les recettes
    function afficherRecettes(recettes) {
        const recettesContainer = document.getElementById('recettes-container');
        recettesContainer.innerHTML = '';

        recettes.forEach(recette => {
            const recetteDiv = document.createElement('div');
            recetteDiv.classList.add('recette');

            // Générer le lien en fonction de la source
            let lienRecette = '';

            switch (recette.source.toLowerCase()) {
                case 'la cuisine de bernard':
                    lienRecette = `https://lacuisinedebernard.com/${encodeURIComponent(recette.nom)}/`;
                    break;
                case "c'est ma fournée":
                    lienRecette = `https://www.cestmafournee.com/search?q=${encodeURIComponent(recette.nom)}`;
                    break;
                case 'alter gusto':
                    lienRecette = `https://www.altergusto.fr/?s=${encodeURIComponent(recette.nom)}`;
                    break;
                case 'papilles et pupilles':
                    lienRecette = `https://www.papillesetpupilles.fr/?s=${encodeURIComponent(recette.nom)}`;
                    break;
                case 'pankaj blog':
                    lienRecette = `https://www.pankaj-blog.com/?s=${encodeURIComponent(recette.nom)}`;
                    break;
                case 'un déjeuner de soleil':
                    lienRecette = `https://www.undejeunerdesoleil.com/?s=${encodeURIComponent(recette.nom)}`;
                    break;
                default:
                    lienRecette = '#'; // Lien par défaut, peut être modifié selon les besoins
            }

            recetteDiv.innerHTML = `
                <h2><a href="${lienRecette}" target="_blank">${recette.nom}</a></h2>
                <p class="categorie">Catégorie: ${recette.categorie}</p>
                <p>Source: ${recette.source}</p>
                <p class="etoiles">Nombre d'étoiles: ${recette.etoiles}</p>
                <p class="commentaires">Commentaires: ${recette.commentaires}</p>
                <p class="ingredients">Ingrédients: ${recette.ingredients}</p>
            `;

            recettesContainer.appendChild(recetteDiv);
        });
    }

    // Ajouter un écouteur d'événements pour le formulaire d'ajout de recette
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
            nom: nomRecetteInput.value,
            categorie: categorieInput.value,
            source: sourceInput.value,
            etoiles: etoilesInput.value,
            commentaires: commentairesInput.value,
            ingredients: ingredientsInput.value
        };

        // Envoyer la nouvelle recette au serveur
        //console.log(JSON.stringify(nouvelleRecette));
        fetch('http://localhost:3000/recettes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nouvelleRecette)
            
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de la recette');
            }
            console.log('Recette ajoutée avec succès !');
            // Actualiser l'affichage des recettes après l'ajout
            return fetch('http://localhost:3000/recettes');
        })
        .then(response => response.json())
        .then(data => {
            afficherRecettes(data);
        })
        .catch(error => console.error(error));
    });

    // Afficher toutes les recettes au chargement initial
    fetch('http://localhost:3000/recettes')
        .then(response => response.json())
        .then(data => {
            afficherRecettes(data);
        })
        .catch(error => console.error('Erreur de chargement des recettes:', error));
});
