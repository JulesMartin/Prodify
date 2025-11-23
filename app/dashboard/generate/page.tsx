"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";

export default function GeneratePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Générer un site affiliate</h1>
        <p className="text-muted-foreground">
          Collez une URL de produit pour générer automatiquement un site affiliate
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>URL du produit</CardTitle>
          <CardDescription>
            Entrez l&apos;URL d&apos;un produit Amazon, eBay ou autre plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL du produit</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.amazon.com/product/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Générer le site
                </>
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="font-semibold mb-2">Site généré avec succès !</h3>
                <p className="text-sm text-muted-foreground">
                  Votre site affiliate a été créé. Vous pouvez maintenant le personnaliser et le publier.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
