import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { storage } from "@/lib/storage";

export const Route = createFileRoute("/app/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações — MatchCV" }] }),
  component: ConfigPage,
});

function ConfigPage() {
  const clearAll = () => {
    if (!confirm("Isso apagará todos os dados salvos no navegador. Continuar?")) return;
    storage.clearAll();
    toast.success("Dados apagados.");
    setTimeout(() => window.location.reload(), 400);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Configurações</h1>
        <p className="mt-1 text-muted-foreground">Gerencie seus dados locais.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Armazenamento local</CardTitle>
          <CardDescription>
            Todos os seus dados ficam apenas no seu navegador. Você pode apagá-los a qualquer momento.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={clearAll} className="gap-2">
            <Trash2 className="h-4 w-4" /> Apagar todos os dados
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sobre</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          MatchCV é uma plataforma de matchmaking de vagas com IA. Sem login, sem cadastro,
          totalmente client-side.
        </CardContent>
      </Card>
    </div>
  );
}