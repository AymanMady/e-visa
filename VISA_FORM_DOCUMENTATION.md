# Documentation du Formulaire de Demande de Visa E-Visa

## Vue d'ensemble

Le système de demande de visa électronique est un formulaire multi-étapes complet qui permet aux utilisateurs de soumettre leur demande de visa pour la Mauritanie de manière structurée et intuitive.

## Architecture du Formulaire

### 6 Étapes du Formulaire

Le formulaire est divisé en 6 étapes distinctes :

#### Étape 1 : Informations Générales
- **Champs requis** :
  - Email
  - Numéro de téléphone
  - Objet du voyage (Tourisme, Affaires, Famille, Médical, Culture/Sports, Autre)
  - Date d'arrivée prévue
  - Nombre d'entrées (Double ou Multiple)
  - Adresse en Mauritanie
- **Champs optionnels** :
  - Description détaillée de l'objet du voyage

#### Étape 2 : Informations sur le Passeport
- **Champs requis** :
  - Numéro de passeport
  - Type de passeport (Standard, Service, Diplomatique)
  - Date d'émission
  - Date d'expiration
  - Lieu d'émission

#### Étape 3 : Informations sur le Voyageur
- **Champs requis** :
  - Titre (M., Mme, Mlle)
  - Prénom
  - Nom de famille
  - Date de naissance
  - Lieu de naissance
  - Nationalité
  - Sexe (Homme, Femme)
  - Profession

#### Étape 4 : Téléchargement de Photo
- **Requis** : Photo de passeport
- **Format** : JPEG, PNG
- **Taille maximale** : 5 MB
- **Exigences** : Photo récente de type passeport, fond clair, visage clairement visible

#### Étape 5 : Documents Justificatifs
- **Optionnel** : Téléchargement de documents supplémentaires
- **Types acceptés** : Réservation d'hôtel, lettre d'invitation, billets d'avion, etc.
- **Format** : PDF, PNG, JPG
- **Taille maximale** : 10 MB par fichier
- **Nombre de fichiers** : Illimité

#### Étape 6 : Révision et Soumission
- Résumé complet de toutes les informations saisies
- Vérification finale avant soumission
- Confirmation des conditions d'utilisation

## Fonctionnalités

### Gestion de l'État
- Utilisation de React `useState` pour gérer toutes les données du formulaire
- Persistance des données entre les étapes
- Navigation fluide entre les étapes

### Validation
- Validation en temps réel des champs
- Messages d'erreur clairs et spécifiques
- Validation par étape avant de passer à la suivante
- Champs requis clairement indiqués par un astérisque (*)

### Navigation
- Boutons "Précédent" et "Suivant" pour naviguer entre les étapes
- Indicateur de progression visuel en haut du formulaire
- Possibilité de revenir en arrière pour modifier les informations
- Clic sur les étapes pour navigation rapide

### Upload de Fichiers
- Zone de glisser-déposer intuitive
- Prévisualisation des fichiers téléchargés
- Possibilité de supprimer des documents
- Indication claire de la taille et du format acceptés

### Interface Utilisateur
- Design moderne et responsive
- Support du mode sombre/clair
- Animations fluides avec Framer Motion
- Messages de feedback clairs pour l'utilisateur

## API Endpoints

### 1. Créer une Demande de Visa
**Endpoint**: `POST /api/visa-application/create`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "generalInfo": {
    "email": "user@example.com",
    "phone": "+222 XX XX XX XX",
    "travelPurpose": "tourism",
    "arrivalDate": "2025-01-15",
    "numberOfEntries": 2,
    "addressInMauritania": "Hotel Mauritania, Nouakchott",
    "purposeDescription": "Vacation trip"
  },
  "passportInfo": {
    "documentNumber": "P1234567",
    "documentType": "standard",
    "issueDate": "2020-01-01",
    "expiryDate": "2030-01-01",
    "placeOfIssue": "Paris, France"
  },
  "travelerInfo": {
    "title": "mr",
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1990-01-01",
    "birthPlace": "Paris, France",
    "nationality": "French",
    "gender": "male",
    "occupation": "Engineer"
  },
  "visaTypeId": "optional-visa-type-id"
}
```

**Response**:
```json
{
  "message": "Visa application created successfully",
  "applicationNumber": "EVS-XXXXXXX-XXXXX",
  "applicationId": "application-id"
}
```

### 2. Télécharger des Fichiers
**Endpoint**: `POST /api/visa-application/upload`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body**:
```json
{
  "applicationId": "application-id",
  "fileType": "photo",
  "fileName": "photo.jpg",
  "fileData": "base64-encoded-data",
  "mimeType": "image/jpeg"
}
```

### 3. Lister les Demandes
**Endpoint**: `GET /api/visa-application/list`

**Headers**:
```
Authorization: Bearer {token}
```

### 4. Récupérer une Demande Spécifique
**Endpoint**: `GET /api/visa-application/{id}`

**Headers**:
```
Authorization: Bearer {token}
```

### 5. Mettre à Jour une Demande
**Endpoint**: `PUT /api/visa-application/{id}`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

## Base de Données (Prisma Schema)

Le système utilise MongoDB avec Prisma ORM. Les modèles principaux sont :

- **User** : Informations sur l'utilisateur
- **VisaApplication** : Demande de visa principale
- **GeneralInfo** : Informations générales de la demande
- **PassportInfo** : Informations sur le passeport
- **TravelerInfo** : Informations sur le voyageur
- **Photo** : Photo du voyageur
- **Document** : Documents justificatifs
- **StatusHistory** : Historique des changements de statut
- **Payment** : Informations de paiement
- **VisaType** : Types de visa disponibles
- **Agent** : Agents qui traitent les demandes

## Sécurité

### Authentification
- Tous les endpoints nécessitent un token JWT valide
- Vérification de l'appartenance de l'application à l'utilisateur
- Protection contre l'accès non autorisé

### Validation
- Validation côté client et serveur
- Vérification des types de fichiers
- Limitation de la taille des fichiers
- Sanitisation des données

## Flux de Travail

1. **Connexion Utilisateur**
   - L'utilisateur doit être connecté pour accéder au formulaire
   - Redirection vers la page de connexion si non authentifié

2. **Remplissage du Formulaire**
   - Navigation séquentielle à travers les 6 étapes
   - Validation à chaque étape
   - Possibilité de revenir en arrière

3. **Téléchargement de Fichiers**
   - Upload de la photo (requis)
   - Upload de documents justificatifs (optionnel)

4. **Révision et Soumission**
   - Vérification de toutes les informations
   - Soumission finale
   - Génération d'un numéro de demande unique

5. **Confirmation**
   - Affichage du numéro de demande
   - Email de confirmation
   - Redirection vers la page d'accueil

## Statuts de Demande

- **pending** : Demande en attente de traitement
- **processing** : Demande en cours de traitement
- **approved** : Demande approuvée
- **rejected** : Demande rejetée
- **cancelled** : Demande annulée

## Améliorations Futures Possibles

1. **Upload de Fichiers Réel**
   - Intégration avec un service de stockage cloud (AWS S3, Cloudinary)
   - Compression automatique des images
   - Validation de la qualité de la photo

2. **Paiement en Ligne**
   - Intégration avec des passerelles de paiement
   - Calcul automatique des frais de visa
   - Génération de reçus

3. **Notifications**
   - Emails de confirmation
   - Notifications de changement de statut
   - Rappels automatiques

4. **Multi-langue**
   - Support pour Français, Arabe, Anglais
   - Traduction automatique des documents

5. **Tableau de Bord**
   - Suivi en temps réel des demandes
   - Historique des demandes
   - Téléchargement du visa électronique

6. **Vérification Biométrique**
   - Reconnaissance faciale
   - Vérification de la validité du passeport

## Technologies Utilisées

- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Backend** : Next.js API Routes
- **Base de Données** : MongoDB avec Prisma ORM
- **Authentification** : JWT (jsonwebtoken)
- **Validation** : Validation côté client et serveur

## Installation et Configuration

### Prérequis
- Node.js 18+
- MongoDB
- npm ou yarn

### Variables d'Environnement
```env
DATABASE_URL="mongodb+srv://..."
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Installation
```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Support

Pour toute question ou problème, veuillez contacter l'équipe de support technique.

