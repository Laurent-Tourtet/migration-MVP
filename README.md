
# SQL Converter

## Description

**SQL Converter** est une application web permettant de convertir et gérer des données SQL, avec des fonctionnalités d'authentification, de gestion d'utilisateurs, et des opérations avancées comme la réinitialisation de mot de passe. L'application utilise une architecture moderne avec plusieurs technologies intégrées pour offrir une expérience fluide et sécurisée.

## Fonctionnalités

- Authentification des utilisateurs (inscription, connexion, réinitialisation de mot de passe)
- Système de gestion des utilisateurs avec Directus
- Envoi d'e-mails de confirmation et de réinitialisation de mot de passe
- Intégration des paiements via Stripe pour des abonnements
- API REST et Webhooks pour interagir avec d'autres services
- Protection des routes avec des politiques de sécurité comme CORS et HTTPS

## Stack utilisée

### Frontend

- **SvelteKit** : Framework frontend pour créer des applications web rapides avec une syntaxe simple et réactive.
- **Tailwind CSS** : Utilisé pour le style, offrant une solution légère et personnalisable pour le design de l'interface utilisateur.

### Backend

- **Directus** : Un CMS/API open-source pour gérer le contenu et les données directement dans une base de données SQL.
- **Node.js** : Serveur pour gérer les requêtes API et intégrer les fonctionnalités backend comme les webhooks.
- **Stripe API** : Pour gérer les paiements en ligne et les abonnements des utilisateurs.

### Base de données

- **PostgreSQL** : Base de données relationnelle utilisée pour stocker les données des utilisateurs et des transactions.
  
### Infrastructure

- **Docker** : Conteneurisation des différents services (Directus, PostgreSQL, NGINX) pour une gestion facilitée du déploiement.
- **NGINX** : Serveur web utilisé comme proxy inverse pour gérer les connexions et assurer la sécurité avec HTTPS.

### Sécurité

- **HTTPS avec Let's Encrypt** : Certificats SSL gratuits pour sécuriser les échanges entre le serveur et les utilisateurs.
- **CORS (Cross-Origin Resource Sharing)** : Pour gérer les requêtes entre le frontend (SvelteKit) et le backend (Directus), tout en contrôlant les origines autorisées.
- **Gestion des fichiers sensibles** : Blocage de l'accès aux fichiers sensibles (comme `.env`) dans NGINX.

## Installation

### Prérequis

- **Docker** installé
- **Node.js** et **npm** pour le frontend
- **Stripe** et **Directus** correctement configurés

### Étapes

1. Clonez ce dépôt :

   \`\`\`bash
   git clone https://github.com/username/sql-converter.git
   \`\`\`

2. Configurez les variables d'environnement :

   Copiez le fichier `.env.example` et renommez-le en `.env`. Complétez les variables nécessaires (comme celles pour Stripe et Directus).

3. Lancer l'application avec Docker :

   \`\`\`bash
   docker-compose up -d
   \`\`\`

   Cette commande démarre les conteneurs pour Directus, PostgreSQL, et NGINX.

4. Accédez à l'interface Directus à l'adresse suivante :

   \`\`\`
   https://yourdomaine:8055
   \`\`\`

5. Pour le frontend (SvelteKit), allez dans le dossier `frontend` et lancez le serveur :

   \`\`\`bash
   cd frontend
   npm install
   npm run dev
   \`\`\`

   Vous pourrez alors accéder au frontend de l'application sur \`http://localhost:3000\`.

## Déploiement

Pour déployer l'application en production :

1. Assurez-vous que les certificats SSL sont en place via Let's Encrypt (générés automatiquement lors du premier lancement avec NGINX).
2. Utilisez des variables d'environnement spécifiques à la production dans votre fichier `.env`.

## Contribution

Les contributions sont les bienvenues. Veuillez ouvrir une *issue* avant de soumettre une *pull request* pour discuter des changements que vous proposez.

---

## Auteur

- **Ton Nom**
- [Ton Email](mailto:contact@yautedev.fr)
- [Ton Profil LinkedIn](https://www.linkedin.com/in/tourtet-laurent/)

---

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.

