import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Target, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { analyzeMatch } from "@/lib/ai.functions";
import { storage, makeId } from "@/lib/storage";
import type { MatchAnalysis } from "@/lib/schemas";

export const Route = createFileRoute("/app/analise")({
  head: () => ({ meta: [{ title: "Análise de Match — MatchCV" }] }),
  component: AnalisePage,
});

function AnalisePage() {
  const runAnalyze = useServerFn(analyzeMatch);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null);

  useEffect(() => {
    setResumeText(storage.getResumeText());
    setJobDescription(storage.getJobDescription());
    setAnalysis(storage.getLastAnalysis());
  }, []);

  const analyze = async () => {
    if (!resumeText.trim()) return toast.error("Envie seu currículo em 'Meu Currículo' primeiro.");
    if (!jobDescription.trim()) return toast.error("Cole a descrição da vaga.");
    setLoading(true);
    try {
      storage.setJobDescription(jobDescription);
      const raw = (await runAnalyze({ data: { resumeText, jobDescription } })) as MatchAnalysis;
      const safe: MatchAnalysis = {
        score: Math.max(0, Math.min(100, Math.round(Number(raw.score) || 0))),
        summary: raw.summary ?? "",
        strengths: raw.strengths ?? [],
        weaknesses: raw.weaknesses ?? [],
        missingKeywords: raw.missingKeywords ?? [],
        missingHardSkills: raw.missingHardSkills ?? [],
        missingSoftSkills: raw.missingSoftSkills ?? [],
        suggestions: raw.suggestions ?? [],
      };
      setAnalysis(safe);
      storage.setLastAnalysis(safe);
      storage.pushHistory({
        id: makeId(),
        type: "analysis",
        createdAt: Date.now(),
        title: `Análise de match — ${safe.score}%`,
        score: safe.score,
        data: safe,
      });
      toast.success("Análise concluída.");
    } catch (e) {
      console.error(e);
      toast.error("Falha ao analisar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Análise de Match</h1>
        <p className="mt-1 text-muted-foreground">
          Cole a descrição da vaga e veja sua compatibilidade em segundos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Descrição da vaga</CardTitle>
          <CardDescription>
            Copie e cole o texto completo da vaga aqui.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={10}
            placeholder="Cole aqui a descrição da vaga (requisitos, responsabilidades, benefícios)..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {resumeText ? "✓ Currículo carregado" : "⚠︎ Você ainda não enviou o currículo em 'Meu Currículo'."}
            </p>
            <Button onClick={analyze} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Analisando..." : "Analisar match"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && <AnalysisResult analysis={analysis} />}
    </div>
  );
}

function AnalysisResult({ analysis }: { analysis: MatchAnalysis }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <Card>
        <CardContent className="flex flex-col items-center gap-6 p-8 md:flex-row md:items-center">
          <ScoreRing score={analysis.score} />
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h2 className="text-lg font-semibold">Compatibilidade</h2>
            </div>
            <p className="text-sm text-muted-foreground">{analysis.summary}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <ListCard
          icon={TrendingUp}
          iconClass="text-success"
          title="Pontos fortes"
          items={analysis.strengths}
          empty="Nenhum ponto forte identificado."
        />
        <ListCard
          icon={AlertTriangle}
          iconClass="text-warning"
          title="Pontos fracos"
          items={analysis.weaknesses}
          empty="Nenhum ponto fraco identificado."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <BadgeCard title="Palavras-chave ausentes" items={analysis.missingKeywords} tone="accent" />
        <BadgeCard title="Hard skills faltantes" items={analysis.missingHardSkills} tone="primary" />
        <BadgeCard title="Soft skills faltantes" items={analysis.missingSoftSkills} tone="muted" />
      </div>

      <ListCard
        icon={Lightbulb}
        iconClass="text-primary"
        title="Sugestões de melhoria"
        items={analysis.suggestions}
        empty="Nenhuma sugestão."
      />
    </motion.div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);
  const color = score >= 80 ? "stroke-success" : score >= 60 ? "stroke-primary" : "stroke-accent";
  return (
    <div className="relative flex h-40 w-40 items-center justify-center">
      <svg viewBox="0 0 120 120" className="absolute inset-0">
        <circle cx="60" cy="60" r={r} strokeWidth="10" className="fill-none stroke-muted" />
        <circle
          cx="60"
          cy="60"
          r={r}
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={`fill-none ${color} transition-all duration-700`}
        />
      </svg>
      <div className="text-center">
        <div className="text-4xl font-bold">{score}%</div>
        <div className="text-xs text-muted-foreground">Match</div>
      </div>
    </div>
  );
}

function ListCard({
  icon: Icon,
  iconClass,
  title,
  items,
  empty,
}: {
  icon: typeof TrendingUp;
  iconClass: string;
  title: string;
  items: string[];
  empty: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={`h-4 w-4 ${iconClass}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length ? (
          <ul className="space-y-2 text-sm">
            {items.map((it, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${iconClass.replace("text-", "bg-")}`} />
                <span className="text-foreground/90">{it}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">{empty}</p>
        )}
      </CardContent>
    </Card>
  );
}

function BadgeCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "accent" | "primary" | "muted";
}) {
  const cls =
    tone === "accent"
      ? "border-accent/30 text-accent"
      : tone === "primary"
        ? "border-primary/30 text-primary"
        : "";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length ? (
          <div className="flex flex-wrap gap-1.5">
            {items.map((k, i) => (
              <Badge key={i} variant="outline" className={cls}>
                {k}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">—</p>
        )}
      </CardContent>
    </Card>
  );
}