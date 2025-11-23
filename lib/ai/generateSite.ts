import { ProductData } from '../scraper';

export interface GeneratedAffiliatePage {
  html: string;
  css: string;
  title: string;
  description: string;
  slug: string;
  ogImage: string;
}

interface SiteSection {
  title: string;
  content: string;
  type: 'introduction' | 'features' | 'benefits' | 'comparison' | 'conclusion' | 'cta';
}

interface GeneratedContent {
  title: string;
  description: string;
  slug: string;
  sections: SiteSection[];
  keywords: string[];
}

/**
 * Génère une page affiliate complète à partir des données d'un produit
 * @param productData - Les données du produit scrapé
 * @returns Une page affiliate complète avec HTML et CSS
 */
export async function generateAffiliatePage(
  productData: ProductData
): Promise<GeneratedAffiliatePage> {
  const geminiKey = process.env.GOOGLE_API_KEY;

  if (!geminiKey) {
    throw new Error('Clé API Google non configurée');
  }

  try {
    // Étape 1 : Générer le contenu structuré avec Gemini
    const generatedContent = await generateContent(productData, geminiKey);

    // Étape 2 : Générer le HTML à partir du contenu structuré
    const html = generateHTML(generatedContent, productData);

    // Étape 3 : Générer le CSS moderne et responsive
    const css = generateCSS();

    // Étape 4 : Sélectionner une image OG (première image du produit ou placeholder)
    const ogImage = productData.images?.[0] || 'https://via.placeholder.com/1200x630';

    return {
      html,
      css,
      title: generatedContent.title,
      description: generatedContent.description,
      slug: generatedContent.slug,
      ogImage,
    };
  } catch (error) {
    console.error('Erreur lors de la génération de la page:', error);
    if (error instanceof Error) {
      throw new Error(`Impossible de générer la page affiliate: ${error.message}`);
    }
    throw new Error('Impossible de générer la page affiliate');
  }
}

/**
 * Génère le contenu structuré avec Gemini
 */
async function generateContent(
  productData: ProductData,
  geminiKey: string
): Promise<GeneratedContent> {
  const prompt = `Tu es un expert en création de sites affiliates et en SEO. Génère un contenu optimisé pour un site affiliate basé sur ce produit:

Titre du produit: ${productData.title}
Description: ${productData.description}
Prix: ${productData.price || 'Non disponible'}
Caractéristiques: ${productData.features?.join(', ') || 'Non disponible'}

Génère:
1. Un titre SEO-optimisé accrocheur (max 60 caractères)
2. Une meta description engageante (max 160 caractères)
3. Un slug URL (format: titre-en-minuscules-avec-tirets)
4. 5-6 sections structurées:
   - Introduction (pourquoi ce produit est intéressant)
   - Caractéristiques principales (détails techniques)
   - Avantages et bénéfices (ce que l'utilisateur gagne)
   - Comparaison / Pour qui c'est idéal
   - Conclusion et recommandation
   - Call-to-action persuasif
5. 5-7 mots-clés pertinents pour le SEO

IMPORTANT: Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans balises de code.

Format JSON attendu:
{
  "title": "Titre SEO ici",
  "description": "Meta description ici",
  "slug": "url-slug-ici",
  "sections": [
    {
      "title": "Titre de la section",
      "content": "Contenu en HTML (avec <p>, <ul>, <li>, <strong>, etc.)",
      "type": "introduction"
    }
  ],
  "keywords": ["mot-clé-1", "mot-clé-2"]
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
          temperature: 0.8,
          maxOutputTokens: 8192,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description: 'Titre SEO optimisé',
              },
              description: {
                type: 'string',
                description: 'Meta description',
              },
              slug: {
                type: 'string',
                description: 'URL slug',
              },
              sections: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: {
                      type: 'string',
                    },
                    content: {
                      type: 'string',
                    },
                    type: {
                      type: 'string',
                    },
                  },
                  required: ['title', 'content', 'type'],
                },
              },
              keywords: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
            required: ['title', 'description', 'slug', 'sections', 'keywords'],
          },
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Erreur API Gemini:', errorData);
    throw new Error(`Erreur API Gemini: ${response.status}`);
  }

  const data = await response.json();

  if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
    throw new Error('Réponse invalide de l\'API Gemini');
  }

  const content = data.candidates[0].content.parts[0].text;

  // Avec responseMimeType: 'application/json', le contenu est déjà du JSON valide
  const parsedContent: GeneratedContent = JSON.parse(content);

  return parsedContent;
}

/**
 * Génère le HTML complet de la page
 */
function generateHTML(content: GeneratedContent, productData: ProductData): string {
  const sections = content.sections
    .map((section) => {
      const sectionClass = `section-${section.type}`;
      return `
    <section class="${sectionClass}">
      <h2>${section.title}</h2>
      <div class="section-content">
        ${section.content}
      </div>
    </section>`;
    })
    .join('\n');

  const images = productData.images
    ?.slice(0, 4)
    .map(
      (img, index) => `
      <div class="product-image">
        <img src="${img}" alt="${productData.title} - Image ${index + 1}" loading="lazy" />
      </div>`
    )
    .join('\n') || '';

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${content.description}">
  <meta name="keywords" content="${content.keywords.join(', ')}">

  <!-- Open Graph / Social Media -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${content.title}">
  <meta property="og:description" content="${content.description}">
  <meta property="og:image" content="${productData.images?.[0] || ''}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${content.title}">
  <meta name="twitter:description" content="${content.description}">
  <meta name="twitter:image" content="${productData.images?.[0] || ''}">

  <title>${content.title}</title>

  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <header class="site-header">
      <h1>${content.title}</h1>
      <div class="product-meta">
        ${productData.price ? `<span class="price">${productData.price}</span>` : ''}
      </div>
    </header>

    <main class="main-content">
      ${images ? `<div class="product-gallery">${images}</div>` : ''}

      ${sections}

      <div class="affiliate-disclaimer">
        <p><small>⚠️ Cet article contient des liens affiliates. En achetant via ces liens, vous soutenez notre travail sans frais supplémentaires.</small></p>
      </div>
    </main>

    <footer class="site-footer">
      <p>&copy; ${new Date().getFullYear()} - Tous droits réservés</p>
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Génère le CSS moderne et responsive
 */
function generateCSS(): string {
  return `
/* Reset et variables */
:root {
  --primary-color: #2563eb;
  --secondary-color: #7c3aed;
  --text-color: #1f2937;
  --text-light: #6b7280;
  --bg-color: #ffffff;
  --bg-light: #f9fafb;
  --border-color: #e5e7eb;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --radius: 8px;
  --max-width: 900px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--bg-light);
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 20px;
}

/* Header */
.site-header {
  background: var(--bg-color);
  padding: 40px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 30px;
  text-align: center;
}

.site-header h1 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  color: var(--text-color);
  margin-bottom: 15px;
  line-height: 1.2;
}

.product-meta {
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.price {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-color);
}

/* Gallery */
.product-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.product-image {
  background: var(--bg-color);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.product-image img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  display: block;
}

/* Sections */
.main-content section {
  background: var(--bg-color);
  padding: 30px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 25px;
}

.main-content h2 {
  font-size: 1.8rem;
  color: var(--text-color);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid var(--primary-color);
}

.section-content {
  color: var(--text-color);
  font-size: 1.05rem;
}

.section-content p {
  margin-bottom: 15px;
}

.section-content ul,
.section-content ol {
  margin-left: 20px;
  margin-bottom: 15px;
}

.section-content li {
  margin-bottom: 8px;
}

.section-content strong {
  color: var(--primary-color);
  font-weight: 600;
}

/* Section spécifiques */
.section-cta {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
}

.section-cta h2 {
  color: white;
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.section-cta .section-content {
  color: white;
}

.section-cta strong {
  color: white;
  text-decoration: underline;
}

/* Disclaimer */
.affiliate-disclaimer {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 15px 20px;
  border-radius: var(--radius);
  margin: 30px 0;
}

/* Footer */
.site-footer {
  text-align: center;
  padding: 30px;
  color: var(--text-light);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .site-header {
    padding: 25px 20px;
  }

  .main-content section {
    padding: 20px;
  }

  .product-gallery {
    grid-template-columns: 1fr;
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

/* Mode sombre (optionnel) */
@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #f9fafb;
    --text-light: #d1d5db;
    --bg-color: #1f2937;
    --bg-light: #111827;
    --border-color: #374151;
  }
}
`;
}
