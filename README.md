# 🇲🇷 E-Visa Mauritanie

Plateforme de demande de visa électronique pour la Mauritanie.

## 📋 Table des matières

- [Démarrage rapide](#getting-started)
- [🛡️ Système d'Administration](#système-dadministration)
- [🔐 Authentification](#authentification)
- [📝 Formulaire de demande](#formulaire-de-demande)
- [🌍 Internationalisation](#internationalisation)
- [🚀 Déploiement](#deploy-on-vercel)

---

## 🛡️ Système d'Administration

### Accès rapide
Le projet inclut un système d'administration complet pour gérer les demandes de visa.

**Documentation complète:**
- 📖 **[Guide de démarrage rapide](./ADMIN_QUICK_START.md)** - Commencez en 3 étapes
- 📚 **[Documentation complète](./ADMIN_SETUP.md)** - Guide détaillé
- 📋 **[Changelog](./ADMIN_CHANGELOG.md)** - Liste des modifications

### Installation rapide

```bash
# 1. Mettre à jour la base de données
npx prisma generate
npx prisma db push

# 2. Créer un administrateur
node scripts/create-admin.js admin@example.com MotDePasse123 "Admin"

# 3. Démarrer l'application
npm run dev

# 4. Se connecter et accéder à /admin
```

### Fonctionnalités Admin
- ✅ Dashboard avec statistiques en temps réel
- ✅ Gestion des demandes de visa
- ✅ Filtrage et recherche avancés
- ✅ Mise à jour des statuts
- ✅ Historique des modifications
- ✅ Interface responsive
- ✅ Mode sombre/clair

### Scripts disponibles
```bash
# Créer un admin
node scripts/create-admin.js <email> <password> [name]

# Promouvoir un utilisateur
node scripts/promote-to-admin.js <email>

# Lister les admins
node scripts/list-admins.js

# Rétrograder un admin
node scripts/demote-admin.js <email>
```

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
