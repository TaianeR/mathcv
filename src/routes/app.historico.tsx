import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Target, Sparkles, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { storage, type HistoryItem } from "@/lib/storage";

export const Route = createFileRoute("/app/historico")({
  head: () => ({ meta: [{ title: "Histórico — MatchCV" }] }),
  component: HistoricoPage,
});

const ICONS = { analysis: Target, ats: Sparkles, cover: Mail } as const;
const LABELS = { analysis: "Análise", ats: "ATS", cover: "Carta" } as const;

function HistoricoPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => setItems(storage.getHistory()), []);

  const clear = () => {
    if (!confirm("Apagar todo o histórico?")) return;
    storage.clearHistory();
    setItems([]);
    toast.success("Histórico apagado.");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Histórico</h1>
          <p className="mt-1 text-muted-foreground">
            Últimas análises, currículos ATS e cartas geradas.
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="outline" size="sm" onClick={clear} className="gap-1.5">
            <Trash2 className="h-3.5 w-3.5" /> Limpar
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Você ainda não gerou nada. Suas análises e currículos aparecerão aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = ICONS[item.type];
            return (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{item.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{LABELS[item.type]}</Badge>
                    {typeof item.score === "number" && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
                        {item.score}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}