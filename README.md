# Portfolio de Vivien Barbeau

Portfolio statique, sans framework ni étape de build. Le site est directement compatible avec GitHub Pages.

## Prévisualisation locale

```bash
python3 -m http.server 8080
```

Ouvrir ensuite `http://localhost:8080`.

## Publication sur GitHub Pages

1. Créer un dépôt GitHub public et y pousser le contenu de ce dossier.
2. Dans **Settings > Pages**, choisir **Deploy from a branch**.
3. Sélectionner la branche `main`, le dossier `/ (root)`, puis enregistrer.

Le site sera publié à l'adresse `https://<utilisateur>.github.io/<depot>/`. Pour une adresse sans nom de dépôt, nommer le dépôt `<utilisateur>.github.io`.

## Lettres de recommandation

Ne jamais déposer les originaux dans le dépôt public. Placer uniquement des copies en image dans `assets/recommandations/` après avoir masqué les numéros de téléphone, adresses e-mail, adresses postales et signatures. Vérifier également les métadonnées des images avant publication.
