# xpc.fr — site vitrine XPC

Page marketing statique bilingue (FR/EN) hébergée sur GitHub Pages.

## Développement
- `npm ci` puis `npm run validate` (HTML) et `npm test` (contenu/accessibilité).
- Fichiers publiés : `site/`. Déploiement automatique sur push `main` (GitHub Pages).

## DNS
Domaine `xpc.fr` géré chez OVH : enregistrements `A` de l'apex vers les IP GitHub
Pages (185.199.108–111.153) et `CNAME www` → `xpc-fr.github.io`.
