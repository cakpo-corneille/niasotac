# 🚀 NIASOTAC - Plateforme E-Commerce Technologie

**Plateforme de vente technologique pour les revendeurs au Bénin**

---

## 📋 Vue d'Ensemble

NIASOTAC est une plateforme e-commerce complète conçue spécifiquement pour la vente de produits technologiques au Bénin. Elle permet aux revendeurs de gérer un catalogue de produits, des catégories, des promotions, et de communiquer directement avec les clients via WhatsApp.

### 🎯 Objectifs Principaux

- Présenter un catalogue de produits technologiques complet
- Gérer les catégories de façon hiérarchique et organisée
- Appliquer automatiquement des promotions et remises
- Partager des produits facilement sur WhatsApp
- Collecter les abonnements à la newsletter
- Fournir une interface admin complète pour gérer le catalogue

---

## ✨ Fonctionnalités Principales

### Pour les Clients

| Fonctionnalité | Description |
|---|---|
| 🛍️ **Catalogue** | Parcourir les produits par catégorie |
| 🔍 **Recherche** | Trouver un produit rapidement |
| 🏷️ **Promotions** | Voir les remises actives |
| 💬 **WhatsApp** | Partager un produit ou poser une question |
| 📧 **Newsletter** | S'abonner pour recevoir les nouvelles offres |
| 📱 **Responsive** | Interface optimisée pour mobile et desktop |

### Pour l'Admin

| Fonctionnalité | Description |
|---|---|
| 🎯 **Gestion Produits** | Ajouter, modifier, supprimer des produits |
| 📁 **Catégories** | Créer des catégories hiérarchiques |
| 💰 **Promotions** | Configurer des remises automatiques |
| ⭐ **Vedettes** | Mettre en avant les meilleurs produits |
| 👥 **Abonnés** | Gérer les abonnements newsletter |
| 📊 **Statistiques** | Voir les vues, clics WhatsApp, etc. |

---

## 🎨 Structure du Projet

Le projet est divisé en deux parties principales:

### **Backend (Django REST API)**
- Gère la base de données (produits, catégories, promotions)
- Fournit l'API REST pour le frontend
- Inclut l'admin Django pour la gestion complète
- Port: `8000`

### **Frontend (React + Vite)**
- Interface utilisateur moderne et responsive
- Affichage du catalogue et des promotions
- Formulaires de contact et newsletter
- Port: `5000`

---

## 🚀 Comment Utiliser

### 1. Démarrer l'Application

**Ouvrir un terminal et démarrer le backend:**
```bash
cd backend/src
python manage.py runserver 0.0.0.0:8000
```

Le backend démarre sur `http://localhost:8000`

**Le frontend démarre automatiquement** sur `http://localhost:5000` (visible dans Replit Webview)

### 2. Accéder aux Différentes Sections

| Section | URL | Accès |
|---|---|---|
| **Site Public** | http://localhost:5000 | Frontend client |
| **Admin Django** | http://localhost:8000/admin | Gérer le catalogue |
| **API** | http://localhost:8000/api/v1 | Documentation API |

### 3. Identifiants Admin

```
Utilisateur: admin
Mot de passe: admin123
```

---

## 📖 Guide Utilisateur

### Pour les Clients

1. **Parcourir les Produits**
   - Allez à la page d'accueil
   - Cliquez sur une catégorie ou utilisez la barre de recherche
   - Cliquez sur un produit pour voir les détails

2. **Partager sur WhatsApp**
   - Ouvrez un produit
   - Cliquez sur "Partager WhatsApp"
   - Le message s'ouvrira avec les infos du produit

3. **S'Abonner à la Newsletter**
   - Entrez votre email dans le formulaire
   - Vous recevrez les nouvelles offres

### Pour l'Admin

#### Ajouter un Produit

1. Allez sur `http://localhost:8000/admin`
2. Cliquez sur "Produits"
3. Cliquez sur "Ajouter Produit"
4. Remplissez les informations:
   - Nom, description, prix
   - Catégorie
   - Images
5. Sauvegardez

#### Créer une Promotion

1. Dans l'admin, allez sur "Promotions"
2. Cliquez sur "Ajouter Promotion"
3. Configurez:
   - Code (ex: NOEL2024)
   - Pourcentage ou montant de remise
   - Date de début/fin
   - Produits ou catégories concernés
4. Activez et sauvegardez

#### Gérer les Catégories

1. Dans l'admin, allez sur "Catégories"
2. Créez une hiérarchie (ex: Électronique > Téléphones > Smartphones)
3. Assignez les produits à chaque catégorie

---

## 🎯 Pages Principales

### Page d'Accueil
- Affiche les catégories principales
- Montre les produits vedettes
- Liste les nouveautés
- Bouton WhatsApp flottant

### Page Produits
- Liste complète des produits
- Filtres (catégorie, prix, en stock)
- Recherche par mot-clé
- Tri (prix, récent, etc.)

### Détail Produit
- Images du produit
- Description complète
- Prix et remises
- Stock disponible
- Bouton WhatsApp pour contacter
- Produits similaires

### Services
- Liste des services offerts
- Descriptions et tarifs

### Contact
- Formulaire de contact
- Informations de contact
- Localisation

---

## 💾 Données du Projet

Le projet inclut des données d'exemple pour tester:

- **27 catégories** organisées hiérarchiquement
- **30 produits technologiques** avec descriptions et images
- **Superuser admin** pour accéder à l'interface d'administration

Vous pouvez ajouter vos propres produits et catégories via l'admin Django.

---

## 🔧 Configuration

### Variables Importantes

Le projet peut être configuré via l'admin Django ou les fichiers de configuration:

- **Nom de l'entreprise** et description
- **Numéro WhatsApp** pour les contacts
- **Email de contact** et téléphone
- **Adresse de l'entreprise**
- **Liens réseaux sociaux**

### Paramètres Admin Django

Accédez à `http://localhost:8000/admin` pour modifier:

- Paramètres du site (SiteSettings)
- Catégories et produits
- Promotions actives
- Abonnés newsletter
- Statistiques d'utilisation

---

## 🐛 Aide & Troubleshooting

### Les produits ne s'affichent pas
✅ Vérifiez que le backend est démarré:
```bash
cd backend/src && python manage.py runserver 0.0.0.0:8000
```

### Erreur "Connexion refusée"
✅ Assurez-vous que:
- Le backend tourne sur le port 8000
- Le frontend tourne sur le port 5000
- Les deux services sont accessibles

### Images produits manquantes
✅ C'est normal - les images sont stockées localement. Vous pouvez en ajouter via l'admin Django.

### Je ne peux pas me connecter à l'admin
✅ Utilisez les identifiants par défaut:
- Utilisateur: `admin`
- Mot de passe: `admin123`

---

## 📱 Optimisations

L'application est optimisée pour:
- **Chargement rapide** - Images avec lazy loading
- **Mobile-first** - Interface responsive
- **Performance** - Cache et optimisations backend
- **SEO** - Meta descriptions et titles

---

## 🚀 Fonctionnalités Avancées

### Système de Scoring
Les produits populaires (vedettes, recommandés) sont automatiquement mis en avant basé sur:
- Nombre de vues
- Clics WhatsApp
- Engagement utilisateur

### Newsletter
Système complet d'abonnement avec:
- Double opt-in pour sécurité
- Gestion des désabonnements
- Envoi asynchrone des emails

### Intégration WhatsApp
Partage facile de produits:
- Lien WhatsApp direct avec infos produit
- Message pré-généré avec prix, description
- Compatible avec tous les navigateurs

---

## 📚 Documentation Détaillée

Pour des informations techniques complètes:
- **backend/README.md** → Documentation API et architecture
- **replit.md** → Contexte projet Replit

---

## ✅ Checklist de Configuration

Avant de partager le lien avec les clients:

- [ ] Backend démarré et fonctionnel
- [ ] Au moins 5-10 produits ajoutés
- [ ] 3-4 catégories créées
- [ ] Numéro WhatsApp configuré en admin
- [ ] Logo/images de l'entreprise ajoutées
- [ ] Liens réseaux sociaux mis à jour
- [ ] Email de contact configuré
- [ ] Au moins une promotion créée (optionnel)

---

## 📞 Support & Maintenance

### Sauvegarder vos Données
Les données sont stockées dans la base de données Django. 
**Important:** Sauvegardez régulièrement via:
1. Export admin Django
2. Ou contactez le support technique

### Ajouter de Nouveaux Produits
1. Allez sur l'admin: `http://localhost:8000/admin`
2. Cliquez "Produits" → "Ajouter"
3. Remplissez les infos
4. Sauvegardez

### Gérer les Promotions
1. Admin → "Promotions" → "Ajouter"
2. Configurez les dates et conditions
3. Sélectionnez les produits/catégories
4. Activez et sauvegardez

---

## 🎉 Prêt à Commencer?

1. ✅ Backend démarré: `cd backend/src && python manage.py runserver 0.0.0.0:8000`
2. ✅ Frontend automatique sur port 5000
3. ✅ Admin accessible à `http://localhost:8000/admin`
4. ✅ Parcourez le catalogue et testez les fonctionnalités!

**Bonne vente! 🚀**

---

**Version:** 1.0.0 | **Dernière mise à jour:** Nov 2025
