import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

interface SitePageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Fonction pour récupérer les données du site depuis Supabase
async function getSite(slug: string) {
  const supabase = await createClient();

  const { data: site, error } = await supabase
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error || !site) {
    return null;
  }

  // Incrémenter le compteur de vues
  await supabase
    .from('sites')
    .update({ views: (site.views || 0) + 1 })
    .eq('id', site.id);

  return site;
}

// Génération des metadata pour le SEO
export async function generateMetadata({
  params,
}: SitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite(slug);

  if (!site) {
    return {
      title: 'Site non trouvé',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    title: site.title,
    description: site.description || 'Découvrez ce produit incroyable',
    openGraph: {
      title: site.title,
      description: site.description || 'Découvrez ce produit incroyable',
      url: `${baseUrl}/${site.slug}`,
      siteName: 'Prodify',
      images: site.og_image
        ? [
            {
              url: site.og_image,
              width: 1200,
              height: 630,
              alt: site.title,
            },
          ]
        : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: site.title,
      description: site.description || 'Découvrez ce produit incroyable',
      images: site.og_image ? [site.og_image] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Page du site publié
export default async function SitePage({ params }: SitePageProps) {
  const { slug } = await params;
  const site = await getSite(slug);

  if (!site) {
    notFound();
  }

  return (
    <>
      {/* Injection du CSS */}
      <style dangerouslySetInnerHTML={{ __html: site.css }} />

      {/* Injection du HTML */}
      <div dangerouslySetInnerHTML={{ __html: site.html }} />

      {/* Badge Prodify (optionnel - peut être retiré) */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '8px',
          fontSize: '12px',
          zIndex: 9999,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        Créé avec{' '}
        <a
          href="/"
          style={{
            color: '#3b82f6',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Prodify
        </a>
      </div>
    </>
  );
}

// Configuration pour le rendu dynamique
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalider toutes les 60 secondes
