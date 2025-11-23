import { load } from 'cheerio';

export interface ProductData {
  title: string;
  description: string;
  price?: string;
  images: string[];
  url: string;
  features?: string[];
}

export async function scrapeProduct(url: string): Promise<ProductData> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error('Impossible de récupérer la page');
    }

    const html = await response.text();
    const $ = load(html);

    let title = '';
    let description = '';
    let price = '';
    const images: string[] = [];
    const features: string[] = [];

    // Détection Amazon
    if (url.includes('amazon.')) {
      title = $('#productTitle').text().trim();
      description = $('#feature-bullets ul li').first().text().trim();
      price = $('.a-price .a-offscreen').first().text().trim();

      $('#feature-bullets ul li').each((_, el) => {
        const feature = $(el).text().trim();
        if (feature) features.push(feature);
      });

      $('#altImages img').each((_, el) => {
        const src = $(el).attr('src');
        if (src) images.push(src);
      });
    }
    // Détection générique
    else {
      title = $('h1').first().text().trim() || $('meta[property="og:title"]').attr('content') || '';
      description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';

      $('img').each((_, el) => {
        const src = $(el).attr('src');
        if (src && !src.includes('logo') && !src.includes('icon')) {
          images.push(src);
        }
      });
    }

    return {
      title,
      description,
      price,
      images: images.slice(0, 5),
      url,
      features: features.slice(0, 10),
    };
  } catch (error) {
    console.error('Erreur lors du scraping:', error);
    throw new Error('Impossible de récupérer les informations du produit');
  }
}
