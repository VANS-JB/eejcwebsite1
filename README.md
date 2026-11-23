# Site officiel de l'EEJ-C

Site web Vite + React + Tailwind CSS de l'EEJ-C, Église des Envoyés de Jésus-Christ.

## Installation

```bash
npm install
```

## Commandes

```bash
npm run dev
npm run build
npm run preview
```

`npm run dev` démarre le frontend Vite et l'API Express. En production, lancez d'abord
`npm run build`, puis `npm start`.

## Configuration

Copiez `.env.example` vers `.env`, puis renseignez au minimum :

- un `ADMIN_PASSWORD` long, unique et aléatoire ;
- les paramètres SMTP nécessaires aux formulaires ;
- l'adresse officielle dans `CONTACT_TO`.

Le fichier `.env` ne doit jamais être ajouté à Git. Le serveur de production doit être
exposé uniquement derrière HTTPS.

`PUBLIC_URL` doit contenir l'adresse publique complète du site afin de générer les liens
de désinscription. `DATA_DIR` indique le dossier persistant qui contient les annonces,
les prédications et les abonnés (par défaut `./data`).

## Pages publiques

- `/annexes` présente les lieux de culte et leurs itinéraires.
- `/programmes` reprend le calendrier hebdomadaire et les annonces.
- `/messages` archive les prédications ; chaque prédication publiée a sa propre URL.

Ces pages sont pré-rendues au build. Les nouvelles prédications sont aussi rendues à la demande par Express et ajoutées au sitemap dynamique.

## Administration

L'espace `/admin` permet de gérer les annonces et les prédications. Pour publier un message, renseignez la date, le jour du culte (lundi, mercredi, vendredi ou dimanche), le titre, le prédicateur et le résumé. Ajoutez au moins un lien HTTPS vidéo ou audio ; les deux formats peuvent être ajoutés. Les messages sont conservés dans `data/messages.json`.

Les connexions et formulaires publics
sont limités afin de réduire les tentatives automatisées. Les données de newsletter sont
stockées localement dans `data/newsletter.json` : ce fichier doit être sauvegardé et son
accès réservé au compte qui exécute le serveur.

La rubrique Newsletter de l'administration affiche les abonnés et permet d'envoyer une
campagne. Chaque destinataire reçoit un lien personnel de désinscription. Pour une liste
supérieure à 500 personnes, utilisez un prestataire spécialisé afin de respecter les
quotas d'envoi et améliorer la délivrabilité.

## Structure

- `index.html`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `vite.config.ts`
- `src/`

## Notes

- Le projet utilise Tailwind CSS 4 via `@tailwindcss/vite`.
- Le code source React démarre depuis `src/main.tsx`.
