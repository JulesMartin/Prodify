import { NextRequest, NextResponse } from 'next/server';
import { scrapeProduct } from '@/lib/scraper';
import { generateSiteContent } from '@/lib/ai';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL manquante' },
        { status: 400 }
      );
    }

    // 1. Scraper le produit
    const productData = await scrapeProduct(url);

    // 2. Générer le contenu avec l'IA
    const generatedSite = await generateSiteContent(productData);

    // 3. Retourner le résultat combiné
    return NextResponse.json({
      product: productData,
      site: generatedSite,
      success: true,
    });
  } catch (error: any) {
    console.error('Erreur API generate:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
