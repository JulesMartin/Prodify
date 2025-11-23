import { ProductData } from '../scraper';

export interface GeneratedSite {
  title: string;
  content: string;
  metaDescription: string;
  keywords: string[];
}

export async function generateSiteContent(productData: ProductData): Promise<GeneratedSite> {
  const geminiKey = process.env.GOOGLE_API_KEY;

  if (!geminiKey) {
    throw new Error('Clé API Google non configurée');
  }

  try {
    const prompt = `Tu es un expert en création de sites affiliates. Génère un contenu SEO-optimisé pour un site affiliate basé sur ce produit:

Titre: ${productData.title}
Description: ${productData.description}
Prix: ${productData.price || 'Non disponible'}
Caractéristiques: ${productData.features?.join(', ') || 'Non disponible'}

Génère:
1. Un titre accrocheur et SEO-friendly
2. Un article de 500+ mots avec des sections (introduction, caractéristiques, avantages, conclusion)
3. Une meta description
4. 5 mots-clés pertinents

Format de réponse en JSON uniquement (sans markdown, sans balises):
{
  "title": "...",
  "content": "...",
  "metaDescription": "...",
  "keywords": ["..."]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  description: 'Titre SEO accrocheur',
                },
                content: {
                  type: 'string',
                  description: 'Article complet en HTML',
                },
                metaDescription: {
                  type: 'string',
                  description: 'Meta description SEO',
                },
                keywords: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  description: 'Mots-clés SEO',
                },
              },
              required: ['title', 'content', 'metaDescription', 'keywords'],
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erreur API Gemini:', errorData);
      throw new Error(`Erreur lors de la génération du contenu: ${response.status}`);
    }

    const data = await response.json();

    // Log pour debugger la réponse de Gemini
    console.log('Réponse Gemini:', JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('Structure de réponse inattendue:', data);
      throw new Error('Réponse invalide de l\'API Gemini');
    }

    const content = data.candidates[0].content.parts[0].text;
    console.log('Contenu brut:', content);

    // Avec responseMimeType: 'application/json', le contenu est déjà du JSON valide
    const parsedContent = JSON.parse(content);

    return parsedContent;
  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    if (error instanceof Error) {
      throw new Error(`Impossible de générer le contenu du site: ${error.message}`);
    }
    throw new Error('Impossible de générer le contenu du site');
  }
}
