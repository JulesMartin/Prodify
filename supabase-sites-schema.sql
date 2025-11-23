-- Table pour stocker les sites générés
CREATE TABLE IF NOT EXISTS public.sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  html TEXT NOT NULL,
  css TEXT NOT NULL,
  og_image TEXT,
  product_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_sites_user_id ON public.sites(user_id);
CREATE INDEX IF NOT EXISTS idx_sites_slug ON public.sites(slug);
CREATE INDEX IF NOT EXISTS idx_sites_created_at ON public.sites(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir tous les sites publiés
CREATE POLICY "Les sites publiés sont visibles par tous"
  ON public.sites
  FOR SELECT
  USING (published = true);

-- Politique : Les utilisateurs peuvent voir leurs propres sites
CREATE POLICY "Les utilisateurs peuvent voir leurs propres sites"
  ON public.sites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent créer leurs propres sites
CREATE POLICY "Les utilisateurs peuvent créer leurs propres sites"
  ON public.sites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent modifier leurs propres sites
CREATE POLICY "Les utilisateurs peuvent modifier leurs propres sites"
  ON public.sites
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent supprimer leurs propres sites
CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres sites"
  ON public.sites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_sites_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Commentaires pour la documentation
COMMENT ON TABLE public.sites IS 'Stocke les sites affiliates générés par les utilisateurs';
COMMENT ON COLUMN public.sites.id IS 'Identifiant unique du site';
COMMENT ON COLUMN public.sites.user_id IS 'ID de l''utilisateur propriétaire du site';
COMMENT ON COLUMN public.sites.slug IS 'Slug unique pour l''URL du site (ex: mon-super-produit)';
COMMENT ON COLUMN public.sites.title IS 'Titre du site/produit';
COMMENT ON COLUMN public.sites.description IS 'Description SEO du site';
COMMENT ON COLUMN public.sites.html IS 'Code HTML complet du site généré';
COMMENT ON COLUMN public.sites.css IS 'Code CSS du site généré';
COMMENT ON COLUMN public.sites.og_image IS 'URL de l''image Open Graph pour le partage social';
COMMENT ON COLUMN public.sites.product_url IS 'URL du produit original scrapé';
COMMENT ON COLUMN public.sites.published IS 'Indique si le site est publié et visible publiquement';
COMMENT ON COLUMN public.sites.views IS 'Nombre de vues du site';
