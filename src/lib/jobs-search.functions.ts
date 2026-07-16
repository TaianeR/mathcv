import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

import { createLovableAiGateway } from "./ai-gateway.server";
import type { Job } from "./mock-jobs";

const MODEL = "google/gemini-3-flash-preview";
const GATEWAY = "https://connector-gateway.lovable.dev/firecrawl/v2";

const inputSchema = z.object({
  title: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  remote: z.array(z.string()).optional().default([]),
  levels: z.array(z.string()).optional().default([]),
  techs: z.array(z.string()).optional().default([]),
  company: z.string().optional().default(""),
  salaryMin: z.number().optional().default(0),
  salaryMax: z.number().optional().default(0),
  limit: z.number().min(1).max(20).optional().default(12),
});

function buildQuery(input: z.infer<typeof inputSchema>): string {
  const parts: string[] = [];
  if (input.title) parts.push(input.title);
  else parts.push("vagas de emprego");
  if (input.techs.length) parts.push(input.techs.slice(0, 4).join(" "));
  if (input.levels.length) parts.push(input.levels[0]);
  if (input.company) parts.push(input.company);
  if (input.city) parts.push(input.city);
  else if (input.state) parts.push(input.state);
  if (input.remote.length === 1) parts.push(input.remote[0]);
  parts.push("(site:gupy.io OR site:vagas.com.br OR site:linkedin.com/jobs OR site:catho.com.br OR site:infojobs.com.br OR site:remotive.com)");
  return parts.filter(Boolean).join(" ");
}

interface FirecrawlSearchResult {
  url?: string;
  title?: string;
  description?: string;
}

async function firecrawlSearch(query: string, limit: number): Promise<FirecrawlSearchResult[]> {
  const lovKey = process.env.LOVABLE_API_KEY;
  const fcKey = process.env.FIRECRAWL_API_KEY;
  if (!lovKey || !fcKey) throw new Error("Firecrawl não configurado.");

  const res = await fetch(`${GATEWAY}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovKey}`,
      "X-Connection-Api-Key": fcKey,
    },
    body: JSON.stringify({ query, limit, lang: "pt", country: "br" }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Firecrawl ${res.status}: ${body.slice(0, 300)}`);
  }
  const json = (await res.json()) as { data?: { web?: FirecrawlSearchResult[] } | FirecrawlSearchResult[] };
  const raw = json.data;
  if (Array.isArray(raw)) return raw;
  return raw?.web ?? [];
}

function extractJson(raw: string): unknown {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("No JSON array in response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

async function structureJobs(results: FirecrawlSearchResult[]): Promise<Job[]> {
  if (results.length === 0) return [];
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const model = createLovableAiGateway(key)(MODEL);

  const source = results
    .map((r, i) => `[${i + 1}] URL: ${r.url ?? ""}\nTítulo: ${r.title ?? ""}\nDescrição: ${r.description ?? ""}`)
    .join("\n\n");

  const prompt = `Você recebe resultados reais de busca web de vagas de emprego no Brasil. Extraia e normalize cada vaga em JSON.

Regras:
- Retorne APENAS um array JSON válido (sem markdown, sem texto extra).
- Ignore resultados que claramente NÃO são vagas específicas (ex.: página inicial de portal, listagens genéricas, artigos).
- Nunca invente dados. Se um campo não estiver evidente, use valores padrão:
  * salaryMin/salaryMax: 0 quando não informado.
  * technologies: [] quando não houver.
  * city: "Não informado", state: "BR" quando não houver localização.
- remote: um de "Presencial" | "Remoto" | "Híbrido" (inferir do texto; padrão "Presencial").
- level: um de "Estágio" | "Júnior" | "Pleno" | "Sênior" | "Especialista" | "Gestão" (inferir; padrão "Pleno").
- area: categoria curta (Tecnologia, Marketing, Vendas, RH, Financeiro, Saúde, Design, Dados, Gestão, Operações, etc.).
- description: 1-2 frases baseadas na descrição do resultado.
- id: use "fc-" + índice.
- postedAt: use "" quando não houver data.
- url: preserve a URL original do resultado.

Formato de cada objeto:
{ "id": string, "title": string, "company": string, "city": string, "state": string, "remote": string, "level": string, "salaryMin": number, "salaryMax": number, "technologies": string[], "area": string, "description": string, "postedAt": string, "url": string }

RESULTADOS:
${source}`;

  const { text } = await generateText({ model, prompt });
  const parsed = extractJson(text);
  if (!Array.isArray(parsed)) return [];
  return parsed as Job[];
}

export const searchJobs = createServerFn({ method: "POST" })
  .inputValidator((input: z.input<typeof inputSchema>) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const query = buildQuery(data);
    try {
      const results = await firecrawlSearch(query, data.limit);
      const jobs = await structureJobs(results.slice(0, data.limit));
      return { ok: true as const, query, jobs };
    } catch (err) {
      return {
        ok: false as const,
        query,
        jobs: [] as Job[],
        error: err instanceof Error ? err.message : "Erro desconhecido",
      };
    }
  });