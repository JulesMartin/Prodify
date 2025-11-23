import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres de votre compte
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>
            Mettez à jour vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom</Label>
            <Input id="name" placeholder="Votre nom" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="votre@email.com" />
          </div>
          <Button>Enregistrer les modifications</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clés API</CardTitle>
          <CardDescription>
            Configurez vos clés API pour la génération de contenu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-key">Clé API OpenAI</Label>
            <Input id="openai-key" type="password" placeholder="sk-..." />
          </div>
          <Button>Enregistrer</Button>
        </CardContent>
      </Card>
    </div>
  );
}
