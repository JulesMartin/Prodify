Parfait ! Le module de génération IA est créé. Voici ce qui a été implémenté :

Fichier créé : /lib/ai/generateSite.ts

Fonction principale :

generateAffiliatePage(productData: ProductData)

Ce qu'elle fait :

1. Génération de contenu avec Gemini :


    - Titre SEO optimisé (max 60 caractères)
    - Meta description engageante (max 160 caractères)
    - Slug URL propre
    - 5-6 sections structurées :
        - Introduction
      - Caractéristiques principales
      - Avantages et bénéfices
      - Comparaison / Pour qui c'est idéal
      - Conclusion
      - Call-to-action
    - 5-7 mots-clés SEO

2. Génération HTML :


    - Structure complète avec meta tags
    - Open Graph et Twitter Cards pour le partage social
    - Galerie d'images du produit (max 4 images)
    - Sections bien structurées
    - Disclaimer affilié
    - Footer

3. Génération CSS :


    - Design moderne et responsive
    - Variables CSS pour faciliter la personnalisation
    - Mode sombre automatique
    - Animations et transitions
    - Optimisé pour mobile

Interface de retour :

{
html: string; // HTML complet de la page
css: string; // CSS responsive et moderne
title: string; // Titre SEO
description: string; // Meta description
slug: string; // URL slug
ogImage: string; // Image pour Open Graph
}

Le module est prêt à être utilisé dans vos routes API ! Il utilise Gemini pour générer un contenu de qualité et optimisé pour le SEO.
