import { z } from "zod";

export const experienceSchema = z.object({
  role: z.string().default(""),
  company: z.string().default(""),
  period: z.string().default(""),
  description: z.string().default(""),
});

export const educationSchema = z.object({
  degree: z.string().default(""),
  institution: z.string().default(""),
  period: z.string().default(""),
});

export const profileSchema = z.object({
  name: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  city: z.string().default(""),
  state: z.string().default(""),
  linkedin: z.string().default(""),
  github: z.string().default(""),
  portfolio: z.string().default(""),
  summary: z.string().default(""),
  objective: z.string().default(""),
  salary: z.string().default(""),
  availability: z.string().default(""),
  workModel: z.enum(["Presencial", "Remoto", "Híbrido", ""]).default(""),
  experiences: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  courses: z.array(z.string()).default([]),
  rawText: z.string().default(""),
});

export type Profile = z.infer<typeof profileSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;

export const emptyProfile: Profile = profileSchema.parse({});

export interface MatchAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  missingHardSkills: string[];
  missingSoftSkills: string[];
  suggestions: string[];
}

export interface AtsResume {
  header: {
    name: string;
    contact: string;
  };
  objective: string;
  summary: string;
  skills: string[];
  experiences: Array<{
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    period: string;
  }>;
  certifications: string[];
  languages: string[];
}