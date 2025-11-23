Parfait ! D'après la documentation officielle de Gemini, j'ai corrigé le code pour utiliser la bonne configuration :

✅ Corrections effectuées :

1. /lib/ai/index.ts

- ❌ Avant : v1/models/gemini-1.5-flash
- ✅ Après : v1beta/models/gemini-2.5-flash

2. /lib/ai/generateSite.ts

- ❌ Avant : v1/models/gemini-1.5-flash
- ✅ Après : v1beta/models/gemini-2.5-flash

📋 Configuration finale :

- API Version : v1beta (officielle)
- Modèle : gemini-2.5-flash (le plus récent pour les comptes gratuits)
- Endpoint : https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent

🧪 Pour tester :

Rechargez votre page et réessayez de générer le site. L'API devrait maintenant fonctionner correctement avec votre compte gratuit Google AI !

Limites du compte gratuit :

- ✅ 15 requêtes/minute
- ✅ 1 million de tokens/jour
- ✅ 1500 requêtes/jour

C'est largement suffisant pour développer votre application !
