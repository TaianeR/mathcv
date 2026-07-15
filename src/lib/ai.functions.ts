import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

import { createLovableAiGateway } from "./ai-gateway.server";

const MODEL = "google/gemini-3-flash-preview";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGateway(key)(MODEL);
}

function extractJson(raw: string): unknown {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in response");
  return JSON.parse(cleaned.slice(start, end + 1));
}

/* -------------------- Extract resume -------------------- */

export const extractResume = createServerFn({ method: "POST" })
  .inputValidator((input: { text: string }) => z.object({ text: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const prompt = `Você é um extrator de currículos. Analise o texto do currículo abaixo e retorne APENAS JSON válido (sem texto adicional, sem markdown) no formato:
{
  "name": string,
  "email": string,
  "phone": string,
  "city": string,
  "state": string,
  "linkedin": string,
  "github": string,
  "portfolio": string,
  "summary": string,
  "objective": string,
  "experiences": [{ "role": string, "company": string, "period": string, "description": string }],
  "education": [{ "degree": string, "institution": string, "period": string }],
  "skills": string[],
  "languages": string[],
  "certifications": string[],
  "courses": string[]
}
Use strings vazias ou arrays vazios quando a informação não estiver presente. Nunca invente dados.

CURRÍCULO:
"""
${data.text.slice(0, 20000)}
"""`;
    const { text } = await generateText({ model: getModel(), prompt });
    try {
      return extractJson(text) as Record<string, unknown>;
    } catch {
      return { summary: data.text.slice(0, 500), rawText: data.text };
    }
  });

/* -------------------- Match analysis -------------------- */

export const analyzeMatch = createServerFn({ method: "POST" })
  .inputValidator((input: { resumeText: string; jobDescription: string }) =>
    z
      .object({
        resumeText: z.string().min(1),
        jobDescription: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const prompt = `Você é um especialista em recrutamento e sistemas ATS. Compare o currículo com a descrição da vaga e retorne APENAS JSON válido:
{
  "score": number (0-100, compatibilidade real),
  "summary": string (2-3 frases explicando o score),
  "strengths": string[] (5-8 pontos fortes específicos do candidato para esta vaga),
  "weaknesses": string[] (3-6 lacunas ou pontos fracos),
  "missingKeywords": string[] (palavras-chave da vaga ausentes no currículo),
  "missingHardSkills": string[] (hard skills requisitados e ausentes),
  "missingSoftSkills": string[] (soft skills requisitados e ausentes),
  "suggestions": string[] (5-8 sugestões de melhoria acionáveis)
}
Seja objetivo, técnico e baseado apenas nas evidências do currículo.

CURRÍCULO:
"""
${data.resumeText.slice(0, 15000)}
"""

VAGA:
"""
${data.jobDescription.slice(0, 8000)}
"""`;
    const { text } = await generateText({ model: getModel(), prompt });
    return extractJson(text);
  });

/* -------------------- ATS resume -------------------- */

export const generateATS = createServerFn({ method: "POST" })
  .inputValidator((input: { resumeText: string; jobDescription: string }) =>
    z
      .object({
        resumeText: z.string().min(1),
        jobDescription: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const prompt = `Você é um redator especialista em currículos ATS Friendly. Reescreva o currículo abaixo otimizado para a vaga, seguindo REGRAS ESTRITAS:
- Nunca invente experiências, empresas, datas ou tecnologias.
- Nunca adicione competências que não estejam evidenciadas no currículo original.
- Você PODE reorganizar, reescrever descrições e destacar habilidades existentes.
- Você PODE inserir palavras-chave da vaga somente se forem compatíveis com o histórico real do candidato.
- Formato ATS: texto plano, sem tabelas, sem símbolos exóticos, bullets simples.
- Tom profissional, verbos de ação, resultados quantificados quando existirem no original.

Retorne APENAS JSON válido:
{
  "header": { "name": string, "contact": string (email | telefone | cidade | LinkedIn) },
  "objective": string (1-2 frases alinhadas com a vaga),
  "summary": string (3-5 frases, resumo profissional otimizado),
  "skills": string[] (competências relevantes, priorize palavras-chave da vaga presentes no currículo),
  "experiences": [{ "role": string, "company": string, "period": string, "bullets": string[] (3-6 bullets orientados a resultado) }],
  "education": [{ "degree": string, "institution": string, "period": string }],
  "certifications": string[],
  "languages": string[]
}

CURRÍCULO ORIGINAL:
"""
${data.resumeText.slice(0, 15000)}
"""

VAGA:
"""
${data.jobDescription.slice(0, 8000)}
"""`;
    const { text } = await generateText({ model: getModel(), prompt });
    return extractJson(text);
  });

/* -------------------- Cover letter -------------------- */

export const generateCoverLetter = createServerFn({ method: "POST" })
  .inputValidator((input: { resumeText: string; jobDescription: string; tone?: string }) =>
    z
      .object({
        resumeText: z.string().min(1),
        jobDescription: z.string().min(1),
        tone: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const tone = data.tone ?? "profissional, natural e objetivo";
    const prompt = `Escreva uma carta de apresentação em português brasileiro, tom ${tone}, de 3 a 4 parágrafos curtos (250-350 palavras). A carta deve conectar as experiências REAIS do candidato com os requisitos da vaga. Nunca invente experiências. Retorne apenas o texto da carta, sem cabeçalho de saudação genérico placeholder, sem markdown.

CURRÍCULO:
"""
${data.resumeText.slice(0, 12000)}
"""

VAGA:
"""
${data.jobDescription.slice(0, 6000)}
"""`;
    const { text } = await generateText({ model: getModel(), prompt });
    return { text: text.trim() };
  });