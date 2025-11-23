Guide détaillé : Tests et Configuration

2. 🧪 Tester en local (localhost)

Étape 1 : Créer la table dans Supabase

1. Ouvrir Supabase Dashboard :


    - Aller sur https://supabase.com/dashboard
    - Sélectionner votre projet

2. Exécuter le SQL :


    - Cliquer sur SQL Editor dans le menu latéral
    - Cliquer sur + New query
    - Copier tout le contenu de supabase-sites-schema.sql
    - Coller dans l'éditeur
    - Cliquer sur Run (ou Ctrl+Enter)
    - Vérifier qu'il n'y a pas d'erreur (message "Success" devrait apparaître)

3. Vérifier que la table existe :


    - Aller dans Table Editor
    - Chercher la table sites
    - Vous devriez voir toutes les colonnes (id, user_id, slug, html, css, etc.)

Étape 2 : Générer un site

1. Aller sur votre dashboard : http://localhost:3000/dashboard
2. Générer un site avec l'URL d'un produit
3. Attendre la génération (ça peut prendre 10-15 secondes)
4. Le site est généré mais pas encore publié

Étape 3 : Publier le site

Vous devez ajouter un bouton/formulaire pour publier le site. Voici comment :

Option A : Test rapide avec curl/Postman
curl -X POST http://localhost:3000/api/publish \
 -H "Content-Type: application/json" \
 -d '{
"slug": "mon-test-produit",
"title": "Mon Test Produit",
"description": "Description de test",
"html": "<h1>Test</h1>",
"css": "h1 { color: blue; }"
}'

Option B : Intégrer dans votre interface (je peux vous aider à créer cette page si
besoin)

Étape 4 : Voir le site publié

Une fois publié, visitez :
http://localhost:3000/mon-test-produit

Vous devriez voir votre site généré avec le HTML/CSS injecté !

---

3. 🌐 Configuration des sous-domaines en production

Les sous-domaines permettent d'avoir des URLs comme : mon-produit.votredomaine.com au  
 lieu de votredomaine.com/mon-produit

Configuration DNS (chez votre hébergeur de domaine)

Si vous utilisez Vercel :

1. Aller sur Vercel Dashboard :


    - Sélectionner votre projet
    - Aller dans Settings > Domains

2. Ajouter le domaine principal :


    - Cliquer sur Add
    - Entrer : votredomaine.com
    - Suivre les instructions pour configurer le DNS

3. Ajouter le wildcard :


    - Cliquer sur Add à nouveau
    - Entrer : *.votredomaine.com
    - Vercel va vous donner un enregistrement DNS à ajouter

4. Configurer chez votre registrar (ex: Namecheap, GoDaddy, Cloudflare) :
   Type: CNAME
   Name: \*
   Value: cname.vercel-dns.com (ou ce que Vercel vous donne)
   TTL: Auto ou 3600

Si vous n'utilisez PAS Vercel (Netlify, autre hébergeur) :

1. Aller chez votre registrar de domaine (là où vous avez acheté le domaine)
2. Accéder à la gestion DNS
3. Ajouter un enregistrement wildcard :
   Type: A ou CNAME
   Name: \*
   Value: IP de votre serveur ou CNAME de l'hébergeur
   TTL: 3600

Exemple avec Cloudflare :
Type: CNAME
Name: \*
Content: votredomaine.com
Proxy status: Activé (orange)

Mettre à jour les variables d'environnement

Sur Vercel :

1. Aller dans Settings > Environment Variables
2. Modifier NEXT_PUBLIC_MAIN_DOMAIN :
   NEXT_PUBLIC_MAIN_DOMAIN=votredomaine.com
3. Redéployer l'application

En local pour tester :
Modifier .env :
NEXT_PUBLIC_MAIN_DOMAIN=votredomaine.com
NEXT_PUBLIC_APP_URL=https://votredomaine.com

Tester les sous-domaines

1. Attendre la propagation DNS (peut prendre 5 minutes à 24h)
2. Tester avec dig (vérifier que le DNS est configuré) :
   dig test.votredomaine.com
3. Devrait pointer vers votre serveur
4. Publier un site avec le slug mon-produit
5. Visiter :


    - votredomaine.com/mon-produit ✅
    - mon-produit.votredomaine.com ✅

---

📝 Exemple complet de workflow

# 1. Générer un site

Utilisateur entre : https://www.amazon.fr/produit-xyz
→ Gemini génère le HTML/CSS

# 2. Publier le site

POST /api/publish
{
"slug": "produit-xyz",
"title": "Super Produit XYZ",
...
}
→ Sauvegardé dans Supabase
→ Retourne: { url: "votredomaine.com/produit-xyz" }

# 3. Accès au site

- votredomaine.com/produit-xyz
- produit-xyz.votredomaine.com (si DNS configuré)

---

⚠️ Points importants

1. En développement local :


    - Les sous-domaines ne fonctionnent pas (c'est normal)
    - Utilisez localhost:3000/{slug}

2. En production :


    - Les deux URLs fonctionnent :
        - votredomaine.com/{slug} (toujours)
      - {slug}.votredomaine.com (si DNS configuré)

3. Propagation DNS :


    - Peut prendre jusqu'à 24h
    - Généralement 5-30 minutes

Voulez-vous que je vous aide à créer l'interface pour publier les sites depuis le
dashboard ?
