import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Globe, Plus } from "lucide-react";

export default function SitesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes sites</h1>
          <p className="text-muted-foreground">
            Gérez tous vos sites affiliates en un seul endroit
          </p>
        </div>
        <Link href="/dashboard/generate">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau site
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aucun site pour le moment</CardTitle>
          <CardDescription>
            Vous n&apos;avez pas encore généré de site affiliate
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Globe className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            Commencez par générer votre premier site
          </p>
          <Link href="/dashboard/generate">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Générer un site
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
