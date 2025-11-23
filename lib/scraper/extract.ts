import { load } from 'cheerio';

export interface ProductData {
  url: string;
  title: string;
  metaDescription: string;
  h1: string[];
  paragraphs: string[];
  images: {
    src: string;
    alt: string;
  }[];
}

/**
 * Extrait les données d'une page web à partir d'une URL
 * @param url - L'URL de la page à scraper
 * @returns Les données extraites de la page
 */
export async function extractProductData(url: string): Promise<ProductData> {
  try {
    // Récupérer le HTML de la page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = load(html);

    // Extraire le titre
    const title = $('title').text().trim() || '';

    // Extraire la meta description
    const metaDescription = $('meta[name="description"]').attr('content')?.trim() ||
                           $('meta[property="og:description"]').attr('content')?.trim() ||
                           '';

    // Extraire tous les h1
    const h1: string[] = [];
    $('h1').each((_, element) => {
      const text = $(element).text().trim();
      if (text) h1.push(text);
    });

    // Extraire tous les paragraphes
    const paragraphs: string[] = [];
    $('p').each((_, element) => {
      const text = $(element).text().trim();
      if (text) paragraphs.push(text);
    });

    // Extraire toutes les images
    const images: { src: string; alt: string }[] = [];
    $('img').each((_, element) => {
      const src = $(element).attr('src');
      const alt = $(element).attr('alt') || '';

      if (src) {
        // Convertir les URLs relatives en URLs absolues
        let absoluteSrc = src;
        if (!src.startsWith('http')) {
          try {
            const urlObj = new URL(url);
            absoluteSrc = new URL(src, urlObj.origin).href;
          } catch {
            // Si l'URL est invalide, garder la source originale
            absoluteSrc = src;
          }
        }

        images.push({
          src: absoluteSrc,
          alt: alt.trim(),
        });
      }
    });

    return {
      url,
      title,
      metaDescription,
      h1,
      paragraphs,
      images,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur lors du scraping de ${url}: ${error.message}`);
    }
    throw new Error(`Erreur inconnue lors du scraping de ${url}`);
  }
}
