import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  Upload,
  Brain,
  Target,
  FileText,
  Mail,
  Download,
  CheckCircle2,
  ArrowRight,
  Zap,
  ShieldCheck,
  Rocket,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: Landing,
});

const steps = [
  { icon: Upload, title: "1. Upload do currículo", desc: "PDF, DOCX, DOC ou TXT — extraímos tudo automaticamente." },
  { icon: Brain, title: "2. A IA analisa", desc: "Entende suas experiências, skills e trajetória." },
  { icon: Target, title: "3. Compare com a vaga", desc: "Cole a descrição e receba um Match Score preciso." },
  { icon: FileText, title: "4. Currículo ATS", desc: "Uma nova versão otimizada, sem inventar experiências." },
  { icon: Mail, title: "5. Carta de apresentação", desc: "Personalizada para a vaga em segundos." },
  { icon: Download, title: "6. Exporte", desc: "PDF, DOCX, TXT ou Markdown, pronto para enviar." },
];

const benefits = [
  { icon: Zap, title: "Rápido de verdade", desc: "Análise em segundos, sem cadastro." },
  { icon: ShieldCheck, title: "Seus dados no seu navegador", desc: "Tudo salvo localmente, sem contas nem senhas." },
  { icon: Rocket, title: "Pronto para ATS", desc: "Formato compatível com os sistemas mais usados por recrutadores." },
];

const faqs = [
  {
    q: "Preciso criar uma conta?",
    a: "Não. Você acessa e usa tudo imediatamente. Seus dados ficam apenas no seu navegador.",
  },
  {
    q: "A IA inventa experiências no meu currículo?",
    a: "Não. As regras do gerador ATS proíbem inventar experiências, empresas ou habilidades. Reorganizamos e destacamos o que você já tem.",
  },
  {
    q: "Quais formatos posso enviar?",
    a: "PDF, DOCX, DOC e TXT. Extraímos o texto e preenchemos seu perfil automaticamente.",
  },
  {
    q: "Consigo exportar o currículo pronto?",
    a: "Sim — PDF, DOCX, TXT e Markdown, todos com layout ATS Friendly.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-lg">MatchCV</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground">
              Como funciona
            </a>
            <a href="#recursos" className="text-sm text-muted-foreground hover:text-foreground">
              Recursos
            </a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">
              FAQ
            </a>
          </nav>
          <Button asChild size="sm">
            <Link to="/app">Começar agora</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(1200px 600px at 50% -20%, oklch(0.72 0.14 245 / 0.35), transparent 60%), radial-gradient(600px 400px at 90% 10%, oklch(0.72 0.18 20 / 0.15), transparent 60%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="secondary" className="mb-6 gap-1.5 border-primary/20 bg-primary/5 text-primary">
              <Sparkles className="h-3 w-3" /> Powered by AI
            </Badge>
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
              Encontre a vaga ideal com <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">Inteligência Artificial</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Descubra seu percentual de compatibilidade com qualquer vaga e gere currículos
              ATS Friendly em segundos — sem cadastro, direto no seu navegador.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/app">
                  Começar agora <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#como-funciona">Ver como funciona</a>
              </Button>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">
              Sem login • Sem cadastro • Seus dados ficam no seu navegador
            </p>
          </motion.div>

          {/* Mock preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-16 max-w-4xl"
          >
            <Card className="overflow-hidden border-border/60 shadow-[var(--shadow-elegant)]">
              <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
                <span className="ml-3 text-xs text-muted-foreground">matchcv.app / análise</span>
              </div>
              <CardContent className="grid gap-6 p-8 md:grid-cols-3">
                <div className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/30 p-6">
                  <div className="relative flex h-32 w-32 items-center justify-center">
                    <svg className="absolute inset-0" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-none stroke-muted" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        strokeWidth="8"
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        className="fill-none stroke-primary"
                        strokeDasharray={`${(94 * 2 * Math.PI * 42) / 100} ${2 * Math.PI * 42}`}
                      />
                    </svg>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground">94%</div>
                      <div className="text-xs text-muted-foreground">Match</div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-medium">Compatibilidade</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-semibold text-foreground">Pontos fortes</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" /> Domínio de React e TypeScript
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" /> Experiência com times ágeis
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" /> Testes automatizados
                    </li>
                  </ul>
                  <p className="mt-4 text-sm font-semibold text-foreground">Palavras-chave sugeridas</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["GraphQL", "Docker", "AWS", "CI/CD"].map((k) => (
                      <Badge key={k} variant="outline" className="border-accent/30 text-accent">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="border-t border-border/50 bg-background py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">Como funciona</h2>
            <p className="mt-3 text-muted-foreground">
              Do upload à exportação, tudo em minutos.
            </p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full border-border/60 transition hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]">
                  <CardContent className="p-6">
                    <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="recursos" className="border-t border-border/50 bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">Feito para candidatos exigentes</h2>
            <p className="mt-3 text-muted-foreground">
              Sem enrolação, sem cadastro, sem cobrança escondida.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {benefits.map((b) => (
              <Card key={b.title} className="border-border/60">
                <CardContent className="p-6">
                  <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-accent">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{b.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{b.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border/50 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold md:text-4xl">Perguntas frequentes</h2>
          </div>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/50 bg-[image:var(--gradient-primary)] py-20 text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">
            Pronto para acelerar suas candidaturas?
          </h2>
          <p className="mt-3 text-primary-foreground/80">
            Sem cadastro. Comece agora e receba seu primeiro Match Score em minutos.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 gap-2">
            <Link to="/app">
              Começar agora <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-md bg-[image:var(--gradient-primary)] text-primary-foreground">
              <Sparkles className="h-3 w-3" />
            </div>
            <span className="font-medium text-foreground">MatchCV</span>
          </div>
          <p>© {new Date().getFullYear()} MatchCV. Feito com IA.</p>
        </div>
      </footer>
    </div>
  );
}
