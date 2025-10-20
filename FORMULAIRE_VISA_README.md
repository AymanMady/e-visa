# Formulaire de Demande de Visa E-Visa - Résumé du Projet

## 🎯 Objectif
Créer un formulaire complet multi-étapes pour les demandes de visa électronique pour la Mauritanie avec toutes les fonctionnalités nécessaires.

## ✅ Ce qui a été complété

### 1. Composant de Formulaire Principal (`/src/components/RequestForm/index.tsx`)
Un formulaire interactif en 6 étapes avec :

#### Étape 1 : Informations Générales
- Email, téléphone
- Objet du voyage (tourisme, affaires, famille, etc.)
- Date d'arrivée
- Nombre d'entrées (double ou multiple)
- Adresse en Mauritanie
- Description détaillée du but du voyage

#### Étape 2 : Informations sur le Passeport
- Numéro de passeport
- Type de passeport (standard, service, diplomatique)
- Dates d'émission et d'expiration
- Lieu d'émission

#### Étape 3 : Informations sur le Voyageur
- Titre, prénom, nom
- Date et lieu de naissance
- Nationalité
- Sexe et profession

#### Étape 4 : Téléchargement de Photo
- Zone de glisser-déposer
- Validation du format (JPEG, PNG)
- Limite de taille (5 MB)
- Prévisualisation

#### Étape 5 : Documents Justificatifs
- Upload multiple de documents
- Support PDF, JPEG, PNG
- Liste des documents téléchargés
- Suppression possible

#### Étape 6 : Révision et Soumission
- Résumé complet de toutes les informations
- Vérification finale
- Bouton de soumission

### 2. API Routes Créées

#### `/src/pages/api/visa-application/create.ts`
- **POST** : Créer une nouvelle demande de visa
- Génération automatique du numéro de demande
- Sauvegarde dans MongoDB via Prisma
- Création de l'historique des statuts

#### `/src/pages/api/visa-application/upload.ts`
- **POST** : Télécharger des fichiers (photo et documents)
- Support base64
- Validation de la taille et du type
- Stockage des métadonnées dans la base de données

#### `/src/pages/api/visa-application/list.ts`
- **GET** : Récupérer toutes les demandes d'un utilisateur
- Inclut toutes les informations liées
- Triées par date de création

#### `/src/pages/api/visa-application/[id].ts`
- **GET** : Récupérer une demande spécifique
- **PUT** : Mettre à jour une demande (si statut pending ou rejected)
- Vérification des permissions

### 3. Fichiers de Types TypeScript (`/src/types/visa.ts`)
- Interfaces complètes pour tous les modèles
- Enums pour les statuts, types, etc.
- Types pour les données du formulaire

### 4. Constantes (`/src/constants/visa.ts`)
- Options pour les sélecteurs
- Limites de téléchargement de fichiers
- Statuts et couleurs
- Endpoints API
- Routes de l'application
- Expressions régulières pour validation

### 5. Fonctions Utilitaires (`/src/utils/visa-helpers.ts`)
Plus de 30 fonctions helper incluant :
- Validation d'email, téléphone, passeport
- Vérification d'expiration de passeport
- Formatage de dates
- Validation de fichiers
- Conversion en base64
- Gestion des tokens JWT
- Fonctions de formatage

### 6. Documentation (`VISA_FORM_DOCUMENTATION.md`)
Documentation complète incluant :
- Architecture du système
- Description de chaque étape
- Exemples d'API
- Schéma de base de données
- Flux de travail
- Guide d'installation

## 🎨 Fonctionnalités Clés

### Interface Utilisateur
- ✅ Design moderne et responsive
- ✅ Support mode sombre/clair
- ✅ Animations fluides (Framer Motion)
- ✅ Indicateur de progression visuel
- ✅ Messages d'erreur clairs

### Gestion de l'État
- ✅ useState pour toutes les données
- ✅ Persistance entre les étapes
- ✅ Validation en temps réel
- ✅ Gestion des erreurs

### Navigation
- ✅ Boutons Précédent/Suivant
- ✅ Navigation par clic sur les étapes
- ✅ Validation avant changement d'étape
- ✅ Retour en arrière possible

### Sécurité
- ✅ Authentification JWT requise
- ✅ Vérification des permissions
- ✅ Validation côté client et serveur
- ✅ Sanitisation des données

### Upload de Fichiers
- ✅ Drag & drop intuitif
- ✅ Validation de taille et format
- ✅ Prévisualisation
- ✅ Gestion multiple de fichiers

## 📂 Structure des Fichiers Créés/Modifiés

```
e-visa/
├── src/
│   ├── components/
│   │   └── RequestForm/
│   │       └── index.tsx (✨ MODIFIÉ - Formulaire complet)
│   ├── pages/
│   │   └── api/
│   │       └── visa-application/
│   │           ├── create.ts (✨ NOUVEAU)
│   │           ├── upload.ts (✨ NOUVEAU)
│   │           ├── list.ts (✨ NOUVEAU)
│   │           └── [id].ts (✨ NOUVEAU)
│   ├── types/
│   │   └── visa.ts (✨ NOUVEAU)
│   ├── constants/
│   │   └── visa.ts (✨ NOUVEAU)
│   └── utils/
│       └── visa-helpers.ts (✨ NOUVEAU)
├── VISA_FORM_DOCUMENTATION.md (✨ NOUVEAU)
└── FORMULAIRE_VISA_README.md (✨ NOUVEAU - Ce fichier)
```

## 🚀 Comment Utiliser

### 1. Accéder au Formulaire
```
http://localhost:3000/request
```
**Note**: L'utilisateur doit être connecté (redirection automatique si non authentifié)

### 2. Remplir le Formulaire
- Suivez les 6 étapes
- Remplissez tous les champs requis (marqués par *)
- Validez chaque étape avant de continuer

### 3. Télécharger les Fichiers
- Étape 4 : Photo de passeport (obligatoire)
- Étape 5 : Documents justificatifs (optionnel)

### 4. Réviser et Soumettre
- Vérifiez toutes les informations à l'étape 6
- Cliquez sur "Submit Application"
- Récupérez votre numéro de demande

## 🔧 Installation

### Prérequis
- Node.js 18+
- MongoDB
- Compte MongoDB Atlas ou instance locale

### Étapes d'Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer les variables d'environnement**
Créez un fichier `.env` à la racine :
```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/evisa?retryWrites=true&w=majority"
JWT_SECRET="votre-secret-key-securise"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

3. **Générer le client Prisma**
```bash
npx prisma generate
```

4. **Pousser le schéma vers la base de données**
```bash
npx prisma db push
```

5. **Démarrer le serveur de développement**
```bash
npm run dev
```

6. **Accéder à l'application**
```
http://localhost:3000
```

## 📊 Schéma de Base de Données

Le système utilise les modèles Prisma suivants :
- **User** : Utilisateurs
- **VisaApplication** : Demandes de visa
- **GeneralInfo** : Informations générales
- **PassportInfo** : Informations passeport
- **TravelerInfo** : Informations voyageur
- **Photo** : Photos
- **Document** : Documents justificatifs
- **StatusHistory** : Historique des statuts
- **Payment** : Paiements
- **VisaType** : Types de visa
- **Agent** : Agents administrateurs

## 🔐 Authentification

Le système utilise JWT (JSON Web Tokens) pour l'authentification :

```javascript
// Exemple de requête avec authentification
const token = localStorage.getItem("token");

fetch("/api/visa-application/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify(data)
});
```

## 📝 Exemples d'Utilisation

### Créer une Demande de Visa

```javascript
const data = {
  generalInfo: {
    email: "user@example.com",
    phone: "+222 12 34 56 78",
    travelPurpose: "tourism",
    arrivalDate: "2025-01-15",
    numberOfEntries: 2,
    addressInMauritania: "Hotel Mauritania",
    purposeDescription: "Vacation"
  },
  passportInfo: {
    documentNumber: "P1234567",
    documentType: "standard",
    issueDate: "2020-01-01",
    expiryDate: "2030-01-01",
    placeOfIssue: "Paris"
  },
  travelerInfo: {
    title: "mr",
    firstName: "John",
    lastName: "Doe",
    birthDate: "1990-01-01",
    birthPlace: "Paris",
    nationality: "French",
    gender: "male",
    occupation: "Engineer"
  }
};

const response = await fetch("/api/visa-application/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify(data)
});

const result = await response.json();
console.log(result.applicationNumber); // EVS-XXXXXXX-XXXXX
```

## 🎯 Statuts de Demande

| Statut | Description | Couleur |
|--------|-------------|---------|
| **pending** | En attente de traitement | Jaune |
| **processing** | En cours de traitement | Bleu |
| **approved** | Approuvée | Vert |
| **rejected** | Rejetée | Rouge |
| **cancelled** | Annulée | Gris |

## 🌟 Améliorations Futures Possibles

1. **Stockage Cloud**
   - Intégration AWS S3 / Cloudinary pour les fichiers
   - URLs signées pour sécurité

2. **Paiement en Ligne**
   - Stripe / PayPal
   - Calcul automatique des frais
   - Génération de reçus

3. **Notifications**
   - Emails automatiques
   - SMS de confirmation
   - Notifications push

4. **Tableau de Bord**
   - Suivi des demandes
   - Historique complet
   - Téléchargement du visa

5. **Multi-langue**
   - Français, Arabe, Anglais
   - Traduction i18n

6. **Analytics**
   - Statistiques de demandes
   - Taux d'approbation
   - Temps de traitement moyen

## 🛠️ Technologies Utilisées

- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Backend** : Next.js API Routes
- **Base de Données** : MongoDB avec Prisma ORM
- **Authentification** : JWT
- **Validation** : Custom validation + Regex

## 📞 Support

Pour toute question ou problème :
- Consultez la documentation complète : `VISA_FORM_DOCUMENTATION.md`
- Vérifiez les types : `src/types/visa.ts`
- Utilisez les helpers : `src/utils/visa-helpers.ts`
- Référez-vous aux constantes : `src/constants/visa.ts`

## ✨ Résumé

✅ **Formulaire complet** avec 6 étapes
✅ **Gestion d'état** complète avec useState
✅ **4 API routes** pour CRUD operations
✅ **Validation** côté client et serveur
✅ **Upload de fichiers** avec drag & drop
✅ **Types TypeScript** complets
✅ **Fonctions utilitaires** (30+ helpers)
✅ **Documentation** complète
✅ **Sans erreurs de lint**
✅ **Responsive** et mode sombre
✅ **Sécurisé** avec JWT

Le système est maintenant **100% fonctionnel** et prêt pour le développement ! 🎉

