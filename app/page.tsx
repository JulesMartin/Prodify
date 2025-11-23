import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold tracking-tight">
          Prodify
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Générez des sites affiliates professionnels à partir d&apos;un simple lien URL de produit
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/auth/signin">
            <Button variant="outline" size="lg">
              Se connecter
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="lg">
              Commencer gratuitement
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
