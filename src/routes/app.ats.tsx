import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import {
  Loader2,
  Sparkles,
  Copy,
  FileDown,
  FileText as FileIcon,
  FileType,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateATS } from "@/lib/ai.functions";
import { storage, makeId } from "@/lib/storage";
import type { AtsResume } from "@/lib/schemas";
import { atsToMarkdown, atsToPlainText, exportDocx, exportMarkdown, exportPdf, exportTxt } from "@/lib/exports";

export const Route = createFileRoute("/app/ats")({
  head: () => ({ meta: [{ title: "ATS Generator — MatchCV" }] }),
  component: AtsPage,
});

function AtsPage() {
  const runGen = useServerFn(generateATS);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [ats, setAts] = useState<AtsResume | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResumeText(storage.getResumeText());
    setJobDescription(storage.getJobDescription());
    setAts(storage.getLastAts());
  }, []);

  const generate = async () => {
    if (!resumeText.trim()) return toast.error("Envie seu currículo em 'Meu Currículo'.");
    if (!jobDescription.trim()) return toast.error("Cole a descrição da vaga.");
    setLoading(true);
    try {
      storage.setJobDescription(jobDescription);
      const raw = (await runGen({ data: { resumeText, jobDescription } })) as unknown as Partial<AtsResume>;
      const safe: AtsResume = {
        header: {
          name: raw.header?.name ?? storage.getProfile().name ?? "",
          contact: raw.header?.contact ?? "",
        },
        objective: raw.objective ?? "",
        summary: raw.summary ?? "",
        skills: raw.skills ?? [],
        experiences: raw.experiences ?? [],
        education: raw.education ?? [],
        certifications: raw.certifications ?? [],
        languages: raw.languages ?? [],
      };
      setAts(safe);
      storage.setLastAts(safe);
      storage.pushHistory({
        id: makeId(),
        type: "ats",
        createdAt: Date.now(),
        title: `Currículo ATS — ${safe.header.name || "sem nome"}`,
        data: safe,
      });
      toast.success("Currículo ATS gerado!");
    } catch (e) {
      console.error(e);
      toast.error("Falha ao gerar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const copyPlain = async () => {
    if (!ats) return;
    await navigator.clipboard.writeText(atsToPlainText(ats));
    toast.success("Texto copiado.");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">ATS Generator</h1>
        <p className="mt-1 text-muted-foreground">
          Gere uma versão do seu currículo otimizada para a vaga, em formato ATS Friendly.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Descrição da vaga</CardTitle>
          <CardDescription>Cole a descrição para o gerador otimizar o currículo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={8}
            placeholder="Cole aqui a descrição da vaga..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={generate} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Gerando..." : "Gerar currículo ATS"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {ats && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Currículo otimizado</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copyPlain} className="gap-1.5">
                <Copy className="h-3.5 w-3.5" /> Copiar
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportPdf(ats)} className="gap-1.5">
                <FileDown className="h-3.5 w-3.5" /> PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportDocx(ats)} className="gap-1.5">
                <FileType className="h-3.5 w-3.5" /> DOCX
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportTxt(ats)} className="gap-1.5">
                <FileIcon className="h-3.5 w-3.5" /> TXT
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportMarkdown(ats)} className="gap-1.5">
                <FileCode className="h-3.5 w-3.5" /> Markdown
              </Button>
            </div>
          </div>

          <Tabs defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">Prévia</TabsTrigger>
              <TabsTrigger value="compare">Antes / Depois</TabsTrigger>
              <TabsTrigger value="markdown">Markdown</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <Card>
                <CardContent className="p-8">
                  <AtsPreview ats={ats} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="compare">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Original</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="h-[520px] overflow-auto whitespace-pre-wrap rounded-md bg-muted/40 p-4 text-xs">
                      {resumeText}
                    </pre>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-primary">Otimizado (ATS)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="h-[520px] overflow-auto whitespace-pre-wrap rounded-md bg-primary/5 p-4 text-xs">
                      {atsToPlainText(ats)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="markdown">
              <Card>
                <CardContent className="p-4">
                  <pre className="max-h-[600px] overflow-auto whitespace-pre-wrap rounded-md bg-muted/40 p-4 text-xs">
                    {atsToMarkdown(ats)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  );
}

function AtsPreview({ ats }: { ats: AtsResume }) {
  return (
    <article className="mx-auto max-w-2xl space-y-6 text-foreground">
      <header className="border-b border-border/60 pb-4">
        <h1 className="text-2xl font-bold">{ats.header.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{ats.header.contact}</p>
      </header>
      {ats.objective && <Section title="Objetivo">{ats.objective}</Section>}
      {ats.summary && <Section title="Resumo Profissional">{ats.summary}</Section>}
      {ats.skills?.length > 0 && (
        <Section title="Competências">
          <div className="flex flex-wrap gap-1.5">
            {ats.skills.map((s, i) => (
              <Badge key={i} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        </Section>
      )}
      {ats.experiences?.length > 0 && (
        <Section title="Experiência Profissional">
          <div className="space-y-4">
            {ats.experiences.map((exp, i) => (
              <div key={i}>
                <p className="font-semibold">
                  {exp.role} <span className="font-normal text-muted-foreground">— {exp.company}</span>
                </p>
                {exp.period && <p className="text-xs text-muted-foreground">{exp.period}</p>}
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm">
                  {(exp.bullets ?? []).map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}
      {ats.education?.length > 0 && (
        <Section title="Formação">
          <ul className="space-y-1 text-sm">
            {ats.education.map((e, i) => (
              <li key={i}>
                <span className="font-medium">{e.degree}</span> — {e.institution}
                {e.period ? ` (${e.period})` : ""}
              </li>
            ))}
          </ul>
        </Section>
      )}
      {ats.certifications?.length > 0 && (
        <Section title="Certificações">
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {ats.certifications.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </Section>
      )}
      {ats.languages?.length > 0 && (
        <Section title="Idiomas">
          <p className="text-sm">{ats.languages.join(" • ")}</p>
        </Section>
      )}
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">{title}</h2>
      <div className="text-sm leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}