import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Loader2, Mail, Copy, FileDown, FileCode } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter } from "@/lib/ai.functions";
import { storage, makeId } from "@/lib/storage";
import { aiErrorMessage } from "@/lib/ai-errors";

export const Route = createFileRoute("/app/carta")({
  head: () => ({ meta: [{ title: "Carta de Apresentação — MatchCV" }] }),
  component: CartaPage,
});

function CartaPage() {
  const runGen = useServerFn(generateCoverLetter);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [cover, setCover] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResumeText(storage.getResumeText());
    setJobDescription(storage.getJobDescription());
    setCover(storage.getLastCover());
  }, []);

  const generate = async () => {
    if (!resumeText.trim()) return toast.error("Envie seu currículo em 'Meu Currículo'.");
    if (!jobDescription.trim()) return toast.error("Cole a descrição da vaga.");
    setLoading(true);
    try {
      const raw = (await runGen({ data: { resumeText, jobDescription } })) as unknown as { text?: string };
      const text = raw.text ?? "";
      setCover(text);
      storage.setLastCover(text);
      storage.setJobDescription(jobDescription);
      storage.pushHistory({
        id: makeId(),
        type: "cover",
        createdAt: Date.now(),
        title: `Carta de apresentação`,
        data: text,
      });
      toast.success("Carta gerada.");
    } catch (e) {
      console.error(e);
      toast.error(aiErrorMessage(e, "Falha ao gerar carta."));
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(cover);
    toast.success("Copiado.");
  };

  const downloadText = (ext: "txt" | "md") => {
    const mime = ext === "md" ? "text/markdown;charset=utf-8" : "text/plain;charset=utf-8";
    const blob = new Blob([cover], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carta-de-apresentacao.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Carta de Apresentação</h1>
        <p className="mt-1 text-muted-foreground">
          Gerada personalizada para cada vaga, com tom profissional e objetivo.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Descrição da vaga</CardTitle>
          <CardDescription>Cole a vaga para personalizar a carta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            rows={6}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={generate} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              {loading ? "Gerando..." : "Gerar carta"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {cover && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Sua carta</CardTitle>
                <CardDescription>Você pode editar antes de exportar.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copy} className="gap-1.5">
                  <Copy className="h-3.5 w-3.5" /> Copiar
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadText("txt")} className="gap-1.5">
                  <FileDown className="h-3.5 w-3.5" /> TXT
                </Button>
                <Button variant="outline" size="sm" onClick={() => downloadText("md")} className="gap-1.5">
                  <FileCode className="h-3.5 w-3.5" /> Markdown
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={16}
                value={cover}
                onChange={(e) => {
                  setCover(e.target.value);
                  storage.setLastCover(e.target.value);
                }}
                className="font-serif leading-relaxed"
              />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}