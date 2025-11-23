# Prodify

Un SaaS qui génère des sites affiliates à partir d'un lien URL de produit.

## Technologies

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Composants UI réutilisables
- **Supabase** - Authentification et base de données
- **OpenAI GPT-4** - Génération de contenu IA
- **Cheerio** - Web scraping

## Structure du projet

```
prodify/
├── app/
│   ├── api/
│   │   ├── scrape/          # API pour scraper les produits
│   │   └── generate/        # API pour générer les sites
│   ├── auth/
│   │   ├── signin/          # Page de connexion
│   │   └── signup/          # Page d'inscription
│   ├── dashboard/
│   │   ├── generate/        # Page de génération de site
│   │   ├── sites/           # Liste des sites générés
│   │   ├── settings/        # Paramètres utilisateur
│   │   ├── layout.tsx       # Layout du dashboard
│   │   └── page.tsx         # Page principale du dashboard
│   ├── globals.css          # Styles globaux
│   ├── layout.tsx           # Layout racine
│   └── page.tsx             # Page d'accueil
├── components/
│   ├── dashboard/
│   │   ├── header.tsx       # Header du dashboard
│   │   └── sidebar.tsx      # Sidebar de navigation
│   └── ui/                  # Composants shadcn/ui
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Client Supabase côté client
│   │   └── server.ts        # Client Supabase côté serveur
│   ├── scraper/
│   │   └── index.ts         # Logique de scraping
│   ├── ai/
│   │   └── index.ts         # Génération de contenu IA
│   └── utils.ts             # Utilitaires
├── middleware.ts            # Middleware d'authentification
└── package.json
```

## Installation

1. Clonez le dépôt :
```bash
git clone <votre-repo>
cd prodify
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
```bash
cp .env.example .env
```

Remplissez le fichier `.env` avec vos clés :
- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme Supabase
- `OPENAI_API_KEY` : Clé API OpenAI

4. Lancez le serveur de développement :
```bash
npm run dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000)

## Configuration Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Activez l'authentification par email dans l'onglet Authentication
4. Copiez l'URL du projet et la clé anon dans votre `.env`

## Fonctionnalités

- Authentification complète (Sign in / Sign up)
- Dashboard avec sidebar et header
- Génération de sites affiliates à partir d'URL
- Scraping automatique des informations produit
- Génération de contenu SEO avec IA
- Interface moderne avec shadcn/ui

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Build l'application pour la production
- `npm start` - Lance l'application en mode production
- `npm run lint` - Vérifie le code avec ESLint

## Prochaines étapes

- Intégrer une base de données pour sauvegarder les sites générés
- Ajouter un système de templates personnalisables
- Implémenter le déploiement automatique des sites
- Ajouter des analytics et tracking
- Système de paiement pour monétiser le SaaS

## Licence

MIT
