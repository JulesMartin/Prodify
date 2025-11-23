import { NextRequest, NextResponse } from 'next/server';
import { extractProductData } from '@/lib/scraper/extract';
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

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URL manquante ou invalide' },
        { status: 400 }
      );
    }

    // Validation du format URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Format d\'URL invalide' },
        { status: 400 }
      );
    }

    const productData = await extractProductData(url);

    return NextResponse.json({
      success: true,
      data: productData,
    });
  } catch (error: any) {
    console.error('Erreur API scrape:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}
