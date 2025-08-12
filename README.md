# Portfolio – GitHub Pages (User Site)
Déployez ce portfolio comme page principale : `https://<votre-username>.github.io`.

## Étapes
1. Dézippez ce dossier.
2. Créez un dépôt **public** nommé **`<votre-username>.github.io`** sur GitHub.
3. Poussez **tous** les fichiers (y compris `.github/workflows/deploy.yml`) sur la branche `main`.
4. Le workflow va builder et déployer automatiquement. L’URL : `https://<votre-username>.github.io`.

## Développement local
```bash
npm install
npm run dev
# build:
npm run build
```

## Notes
- Vite + React 18 + Tailwind
- Sections About / Projects; Contacts intégré dans About
- Effet titre : **pas d’animation**. Au survol, **une** police + **une** couleur de la palette sont appliquées; on revient à la normale en sortie.
