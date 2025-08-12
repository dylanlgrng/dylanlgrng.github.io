# Mon portfolio – GitHub Pages (v5)

- Dynamic cycling de police/couleur **pendant le survol** (Chrome/Safari/Windows OK)
- Polices **système uniquement** (aucune webfont) pour compatibilité
- Contenus faciles dans `src/content/site.json`
- Workflow Pages sur **master + main** et fallback `404.html`

## Modifier les contenus
- Profil / contacts / compétences / photo : `src/content/site.json` → `about`
- Projets : dans `projects` (id, title, image, summary, description)
- Images locales : placez-les dans `public/images/` puis référencez `images/nom.jpg`

## Déployer
Uploadez tout le dossier dans votre repo `<username>.github.io` (branche master ou main). L'action GitHub build et publie.
