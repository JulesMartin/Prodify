import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export interface PublishSiteRequest {
  slug: string;
  title: string;
  description: string;
  html: string;
  css: string;
  ogImage?: string;
  productUrl?: string;
}

export interface PublishSiteResponse {
  success: boolean;
  siteId?: string;
  slug?: string;
  url?: string;
  error?: string;
}

/**
 * API route pour publier un site généré
 * POST /api/publish
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Vérifier l'authentification
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log('👤 Utilisateur:', user ? `${user.email} (${user.id})` : 'Non authentifié');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer les données de la requête
    console.log('📥 Requête reçue pour publication');

    let body: PublishSiteRequest;
    try {
      const rawBody = await request.text();
      console.log('📄 Body brut:', rawBody);

      if (!rawBody || rawBody.trim() === '') {
        return NextResponse.json(
          { success: false, error: 'Le body de la requête est vide' },
          { status: 400 }
        );
      }

      body = JSON.parse(rawBody);
      console.log('✅ Body parsé:', body);
    } catch (error) {
      console.error('❌ Erreur parsing JSON:', error);
      return NextResponse.json(
        { success: false, error: 'JSON invalide dans le body' },
        { status: 400 }
      );
    }

    const { slug, title, description, html, css, ogImage, productUrl } = body;

    // Validation des données
    if (!slug || !title || !html || !css) {
      return NextResponse.json(
        {
          success: false,
          error: 'Données manquantes (slug, title, html, css requis)',
        },
        { status: 400 }
      );
    }

    // Valider le format du slug (uniquement lettres, chiffres, tirets)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets',
        },
        { status: 400 }
      );
    }

    // Vérifier si le slug existe déjà
    const { data: existingSite } = await supabase
      .from('sites')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingSite) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ce slug est déjà utilisé. Choisissez-en un autre.',
        },
        { status: 409 }
      );
    }

    // Insérer le nouveau site dans Supabase
    const { data: newSite, error: insertError } = await supabase
      .from('sites')
      .insert({
        user_id: user.id,
        slug,
        title,
        description,
        html,
        css,
        og_image: ogImage,
        product_url: productUrl,
        published: true,
      })
      .select('id, slug')
      .single();

    if (insertError) {
      console.error('Erreur lors de l\'insertion du site:', insertError);
      return NextResponse.json(
        {
          success: false,
          error: 'Erreur lors de la publication du site',
        },
        { status: 500 }
      );
    }

    // Construire l'URL du site publié
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const siteUrl = `${baseUrl}/${slug}`;

    return NextResponse.json({
      success: true,
      siteId: newSite.id,
      slug: newSite.slug,
      url: siteUrl,
    });
  } catch (error: any) {
    console.error('Erreur API publish:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/publish - Récupérer les sites de l'utilisateur
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Vérifier l'authentification
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer tous les sites de l'utilisateur
    const { data: sites, error } = await supabase
      .from('sites')
      .select('id, slug, title, description, og_image, created_at, views')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des sites:', error);
      return NextResponse.json(
        {
          success: false,
          error: 'Erreur lors de la récupération des sites',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      sites: sites || [],
    });
  } catch (error: any) {
    console.error('Erreur API publish GET:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur serveur',
      },
      { status: 500 }
    );
  }
}
