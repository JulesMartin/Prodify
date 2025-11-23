-- Créez cette table dans votre projet Supabase
-- Allez dans SQL Editor et exécutez ce script

-- Table pour stocker les sites générés
CREATE TABLE IF NOT EXISTS public.sites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    product_url TEXT NOT NULL,
    meta_description TEXT,
    keywords TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS sites_user_id_idx ON public.sites(user_id);
CREATE INDEX IF NOT EXISTS sites_created_at_idx ON public.sites(created_at DESC);

-- RLS (Row Level Security) pour sécuriser les données
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;

-- Politique : Les utilisateurs peuvent voir uniquement leurs propres sites
CREATE POLICY "Users can view their own sites"
    ON public.sites FOR SELECT
    USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent créer leurs propres sites
CREATE POLICY "Users can create their own sites"
    ON public.sites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent mettre à jour leurs propres sites
CREATE POLICY "Users can update their own sites"
    ON public.sites FOR UPDATE
    USING (auth.uid() = user_id);

-- Politique : Les utilisateurs peuvent supprimer leurs propres sites
CREATE POLICY "Users can delete their own sites"
    ON public.sites FOR DELETE
    USING (auth.uid() = user_id);

-- Fonction pour mettre à jour automatiquement le champ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour appeler la fonction à chaque mise à jour
CREATE TRIGGER update_sites_updated_at
    BEFORE UPDATE ON public.sites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
