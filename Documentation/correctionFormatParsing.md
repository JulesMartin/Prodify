● Excellent ! J'ai corrigé le problème de parsing JSON en utilisant JSON Schema de Gemini,  
 une fonctionnalité officielle qui garantit un JSON valide.

✅ Corrections effectuées :

1. /lib/ai/index.ts

- Ajout de responseMimeType: 'application/json'
- Ajout de responseSchema pour définir la structure JSON attendue
- Simplification du parsing (plus besoin de nettoyer les balises markdown)

2. /lib/ai/generateSite.ts

- Ajout de responseMimeType: 'application/json'
- Ajout de responseSchema complet avec sections, keywords, etc.
- Simplification du parsing JSON

🎯 Avantages :

- JSON toujours valide : Gemini génère directement du JSON conforme au schema
- Pas d'erreur de parsing : Plus de problèmes avec des caractères spéciaux
- Typage fort : La structure est garantie par le schema
- Performance : Pas besoin de nettoyer ou corriger le JSON

🧪 Pour tester :

Rechargez la page et réessayez de générer le site. Le JSON devrait maintenant être
parfaitement formaté et parsé sans erreur !
