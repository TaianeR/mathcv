import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Upload, FileText, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { storage } from "@/lib/storage";
import { extractResumeText } from "@/lib/resume-parser";
import { extractResume } from "@/lib/ai.functions";
import type { Profile } from "@/lib/schemas";
import { emptyProfile, profileSchema } from "@/lib/schemas";

export const Route = createFileRoute("/app/curriculo")({
  head: () => ({ meta: [{ title: "Meu Currículo — MatchCV" }] }),
  component: CurriculoPage,
});

function CurriculoPage() {
  const runExtract = useServerFn(extractResume);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProfile(storage.getProfile());
    setResumeText(storage.getResumeText());
  }, []);

  const patch = (p: Partial<Profile>) => setProfile((prev) => ({ ...prev, ...p }));

  const handleFile = async (file: File) => {
    setUploading(true);
    setFileName(file.name);
    try {
      const text = await extractResumeText(file);
      if (!text.trim()) {
        toast.error("Não foi possível extrair texto do arquivo.");
        return;
      }
      setResumeText(text);
      storage.setResumeText(text);
      toast.success("Texto extraído. Analisando com IA...");
      setUploading(false);
      setExtracting(true);
      const extracted = (await runExtract({ data: { text } })) as Partial<Profile>;
      const parsed = profileSchema.safeParse({
        ...profile,
        ...extracted,
        rawText: text,
      });
      const merged: Profile = parsed.success
        ? parsed.data
        : { ...profile, ...(extracted as Partial<Profile>), rawText: text };
      setProfile(merged);
      storage.setProfile(merged);
      toast.success("Perfil preenchido automaticamente!");
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "";
      if (/429|rate/i.test(msg)) {
        toast.error("Muitas requisições. Aguarde alguns segundos e tente novamente.");
      } else if (/402|credit/i.test(msg)) {
        toast.error("Créditos de IA esgotados. Adicione créditos no workspace.");
      } else {
        toast.error("Falha ao processar o arquivo. Você pode editar o texto manualmente abaixo.");
      }
    } finally {
      setUploading(false);
      setExtracting(false);
    }
  };

  const saveProfile = () => {
    const parsed = profileSchema.safeParse({ ...profile, rawText: resumeText });
    const next = parsed.success ? parsed.data : { ...profile, rawText: resumeText };
    storage.setProfile(next);
    storage.setResumeText(resumeText);
    toast.success("Perfil salvo.");
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s) return;
    if (profile.skills.includes(s)) return setNewSkill("");
    patch({ skills: [...profile.skills, s] });
    setNewSkill("");
  };
  const removeSkill = (s: string) => patch({ skills: profile.skills.filter((x) => x !== s) });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Meu Currículo</h1>
        <p className="mt-1 text-muted-foreground">
          Envie um currículo ou preencha manualmente. Tudo fica salvo no seu navegador.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload do currículo</CardTitle>
          <CardDescription>PDF, DOCX, DOC ou TXT — a IA extrai as informações automaticamente.</CardDescription>
        </CardHeader>
        <CardContent>
          <label
            htmlFor="cv-file"
            className="group flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/70 bg-muted/30 p-8 text-center transition hover:border-primary/50 hover:bg-primary/5"
          >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
              {uploading || extracting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
            </div>
            <p className="text-sm font-medium">
              {uploading
                ? "Extraindo texto..."
                : extracting
                  ? "Analisando com IA..."
                  : "Arraste um arquivo ou clique para enviar"}
            </p>
            <p className="text-xs text-muted-foreground">.pdf • .docx • .doc • .txt • até 10MB</p>
            {fileName && (
              <Badge variant="secondary" className="mt-2 gap-1">
                <FileText className="h-3 w-3" /> {fileName}
              </Badge>
            )}
            <input
              ref={inputRef}
              id="cv-file"
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>

          {resumeText && (
            <div className="mt-4">
              <Label htmlFor="rawText">Texto extraído</Label>
              <Textarea
                id="rawText"
                className="mt-1 h-40 font-mono text-xs"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Você pode editar o texto antes de analisar uma vaga.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados pessoais</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field label="Nome completo">
            <Input value={profile.name} onChange={(e) => patch({ name: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input type="email" value={profile.email} onChange={(e) => patch({ email: e.target.value })} />
          </Field>
          <Field label="Telefone">
            <Input value={profile.phone} onChange={(e) => patch({ phone: e.target.value })} />
          </Field>
          <Field label="Cidade">
            <Input value={profile.city} onChange={(e) => patch({ city: e.target.value })} />
          </Field>
          <Field label="Estado">
            <Input value={profile.state} onChange={(e) => patch({ state: e.target.value })} />
          </Field>
          <Field label="Modelo de trabalho">
            <Select
              value={profile.workModel || undefined}
              onValueChange={(v) => patch({ workModel: v as Profile["workModel"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Presencial">Presencial</SelectItem>
                <SelectItem value="Remoto">Remoto</SelectItem>
                <SelectItem value="Híbrido">Híbrido</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="LinkedIn">
            <Input value={profile.linkedin} onChange={(e) => patch({ linkedin: e.target.value })} />
          </Field>
          <Field label="GitHub">
            <Input value={profile.github} onChange={(e) => patch({ github: e.target.value })} />
          </Field>
          <Field label="Portfólio" className="md:col-span-2">
            <Input value={profile.portfolio} onChange={(e) => patch({ portfolio: e.target.value })} />
          </Field>
          <Field label="Pretensão salarial">
            <Input value={profile.salary} onChange={(e) => patch({ salary: e.target.value })} />
          </Field>
          <Field label="Disponibilidade">
            <Input
              placeholder="Ex.: imediata"
              value={profile.availability}
              onChange={(e) => patch({ availability: e.target.value })}
            />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sobre você</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Resumo profissional">
            <Textarea
              rows={4}
              value={profile.summary}
              onChange={(e) => patch({ summary: e.target.value })}
            />
          </Field>
          <Field label="Objetivo profissional">
            <Textarea
              rows={2}
              value={profile.objective}
              onChange={(e) => patch({ objective: e.target.value })}
            />
          </Field>
          <Separator />
          <div>
            <Label>Competências / Skills</Label>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Ex.: React"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addSkill}>
                Adicionar
              </Button>
            </div>
            <motion.div layout className="mt-3 flex flex-wrap gap-1.5">
              {profile.skills.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1">
                  {s}
                  <button
                    type="button"
                    aria-label={`Remover ${s}`}
                    onClick={() => removeSkill(s)}
                    className="rounded-full hover:bg-background/50"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveProfile} className="gap-2">
          <Save className="h-4 w-4" /> Salvar perfil
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}