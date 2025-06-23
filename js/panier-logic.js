// --- Fonctions de gestion du Panier ---

function getPanier() {
    const panier = localStorage.getItem('eclaria_panier');
    return panier ? JSON.parse(panier) : [];
}

function savePanier(panier) {
    localStorage.setItem('eclaria_panier', JSON.stringify(panier));
    mettreAJourCompteurPanier(); // Mettre à jour le compteur global
    // Si la fonction afficherPanier existe sur la page courante (ex: panier.html), l'appeler
    if (typeof afficherPanier === 'function') {
        afficherPanier();
    }
    // Si la fonction afficherRecapitulatifCommande existe (ex: livraison.html)
    if (typeof afficherRecapitulatifCommande === 'function') {
        afficherRecapitulatifCommande();
    }
    // Si la fonction afficherRecapitulatifCommandePaiement existe (ex: paiement.html)
    if (typeof afficherRecapitulatifCommandePaiement === 'function') {
        afficherRecapitulatifCommandePaiement();
    }
}

function getNombreTotalArticles() {
    const panier = getPanier();
    return panier.reduce((total, item) => total + (item.quantite || 0), 0); // Assurer que item.quantite est un nombre
}

function mettreAJourCompteurPanier() {
    const nombreArticles = getNombreTotalArticles();
    const compteursPanier = document.querySelectorAll('.cart-counter'); 

    compteursPanier.forEach(compteur => {
        if (compteur) {
            if (nombreArticles > 0) {
                compteur.textContent = nombreArticles;
                compteur.style.display = 'flex'; 
            } else {
                compteur.style.display = 'none';
            }
        }
    });

    const cartLink = document.querySelector('.cart-icon-new');
    if (cartLink) {
        // Le lien pointera toujours vers panier.html, qui gérera l'affichage si vide.
        cartLink.href = 'panier.html';
    }
}

function ajouterAuPanier(idProduit, nomProduit, prixUnitaire, imageSrc, quantiteAjoutee = 1) {
    let panier = getPanier();
    const itemExistant = panier.find(item => item.idProduit === idProduit);
    const qte = parseInt(quantiteAjoutee);

    if (qte <= 0) {
        console.warn("La quantité ajoutée doit être supérieure à zéro.");
        return;
    }

    if (itemExistant) {
        itemExistant.quantite = parseInt(itemExistant.quantite) + qte;
    } else {
        panier.push({ 
            idProduit, 
            nomProduit, 
            prixUnitaire: parseFloat(prixUnitaire), 
            imageSrc, 
            quantite: qte 
        });
    }
    savePanier(panier);
    
    // Notification gérée localement sur la page produit si nécessaire
    console.log(`${qte} x ${nomProduit} ajouté(s) au panier.`);
}

function modifierQuantite(idProduit, nouvelleQuantite) {
    let panier = getPanier();
    const itemIndex = panier.findIndex(item => item.idProduit === idProduit);
    
    if (itemIndex > -1) {
        const qte = parseInt(nouvelleQuantite);
        if (qte > 0 && qte <= 10) { // Limite max de 10 par item
            panier[itemIndex].quantite = qte;
        } else if (qte <= 0) {
            panier.splice(itemIndex, 1); // Supprimer si quantité est 0 ou moins
        } else if (qte > 10) {
            panier[itemIndex].quantite = 10; // Plafonner à 10
            alert("La quantité maximale par article est de 10.");
        }
    }
    savePanier(panier);
}

function supprimerArticle(idProduit) {
    let panier = getPanier();
    panier = panier.filter(item => item.idProduit !== idProduit);
    savePanier(panier);
}

// Initialiser le compteur au chargement du script,
// mais s'assurer que le DOM est prêt pour manipuler .cart-counter
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mettreAJourCompteurPanier);
} else {
    mettreAJourCompteurPanier();
}

console.log('panier-logic.js chargé.');
