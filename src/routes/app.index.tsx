import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Target, Sparkles, Mail, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { storage } from "@/lib/storage";
import type { HistoryItem } from "@/lib/storage";
import type { MatchAnalysis, AtsResume, Profile } from "@/lib/schemas";
import { emptyProfile } from "@/lib/schemas";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — MatchCV" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null);
  const [ats, setAts] = useState<AtsResume | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [resumeText, setResumeText] = useState("");

  useEffect(() => {
    setProfile(storage.getProfile());
    setAnalysis(storage.getLastAnalysis());
    setAts(storage.getLastAts());
    setHistory(storage.getHistory());
    setResumeText(storage.getResumeText());
  }, []);

  const analysesCount = history.filter((h) => h.type === "analysis").length;
  const atsCount = history.filter((h) => h.type === "ats").length;
  const coverCount = history.filter((h) => h.type === "cover").length;
  const avgScore = (() => {
    const scores = history
      .filter((h) => h.type === "analysis" && typeof h.score === "number")
      .map((h) => h.score!);
    if (!scores.length) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  })();

  const kpis = [
    { label: "Vagas analisadas", value: analysesCount, icon: Target },
    { label: "Currículos ATS", value: atsCount, icon: Sparkles },
    { label: "Cartas geradas", value: coverCount, icon: Mail },
    { label: "Match médio", value: avgScore != null ? `${avgScore}%` : "—", icon: Target },
  ];

  const hasResume = resumeText.trim().length > 0;
  const name = profile.name || "candidato(a)";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Olá, {name} 👋</h1>
        <p className="mt-1 text-muted-foreground">
          Comece analisando uma vaga ou gerando um currículo ATS Friendly.
        </p>
      </div>

      {!hasResume && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
            <div>
              <h3 className="font-semibold">Comece pelo currículo</h3>
              <p className="text-sm text-muted-foreground">
                Envie um PDF, DOCX ou TXT — a IA extrai suas informações automaticamente.
              </p>
            </div>
            <Button asChild>
              <Link to="/app/curriculo" className="gap-2">
                Enviar currículo <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{k.label}</p>
                <k.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-2 text-2xl font-semibold">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-primary" /> Última análise
            </CardTitle>
            <CardDescription>Resumo do último Match Score calculado.</CardDescription>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">{analysis.score}%</span>
                  <Badge variant="secondary">Match</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{analysis.summary}</p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/app/analise">Ver análise completa</Link>
                </Button>
              </div>
            ) : (
              <EmptyBlock
                title="Nenhuma análise ainda"
                cta="Analisar uma vaga"
                to="/app/analise"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-accent" /> Último currículo ATS
            </CardTitle>
            <CardDescription>Versão otimizada mais recente.</CardDescription>
          </CardHeader>
          <CardContent>
            {ats ? (
              <div className="space-y-3">
                <p className="font-medium">{ats.header.name}</p>
                <p className="line-clamp-3 text-sm text-muted-foreground">{ats.summary}</p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/app/ats">Abrir currículo</Link>
                </Button>
              </div>
            ) : (
              <EmptyBlock
                title="Nenhum currículo ATS ainda"
                cta="Gerar currículo ATS"
                to="/app/ats"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ações rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink to="/app/curriculo" icon={FileText} label="Editar currículo" />
          <QuickLink to="/app/analise" icon={Target} label="Analisar vaga" />
          <QuickLink to="/app/ats" icon={Sparkles} label="Gerar ATS" />
          <QuickLink to="/app/carta" icon={Mail} label="Gerar carta" />
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyBlock({ title, cta, to }: { title: string; cta: string; to: "/app/analise" | "/app/ats" }) {
  return (
    <div className="rounded-lg border border-dashed border-border/70 p-6 text-center">
      <p className="text-sm text-muted-foreground">{title}</p>
      <Button asChild size="sm" className="mt-3">
        <Link to={to}>{cta}</Link>
      </Button>
    </div>
  );
}

function QuickLink({
  to,
  icon: Icon,
  label,
}: {
  to: "/app/curriculo" | "/app/analise" | "/app/ats" | "/app/carta";
  icon: typeof FileText;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-4 transition hover:border-primary/40 hover:shadow-sm"
    >
      <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}