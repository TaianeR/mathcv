import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Briefcase, MapPin, Building2, Filter, Target, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { jobs, LEVELS, REMOTE_OPTIONS, buildJobDescription, type Job } from "@/lib/mock-jobs";
import { storage } from "@/lib/storage";

export const Route = createFileRoute("/app/vagas")({
  head: () => ({ meta: [{ title: "Buscar vagas — MatchCV" }] }),
  component: JobsPage,
});

const ALL_STATES = Array.from(new Set(jobs.map((j) => j.state))).sort();
const ALL_TECHS = Array.from(new Set(jobs.flatMap((j) => j.technologies))).sort();
const ALL_COMPANIES = Array.from(new Set(jobs.map((j) => j.company))).sort();
const MAX_SALARY = Math.max(...jobs.map((j) => j.salaryMax));

function JobsPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState<string>("all");
  const [company, setCompany] = useState<string>("all");
  const [remote, setRemote] = useState<Set<Job["remote"]>>(new Set());
  const [levels, setLevels] = useState<Set<Job["level"]>>(new Set());
  const [techs, setTechs] = useState<Set<string>>(new Set());
  const [salary, setSalary] = useState<[number, number]>([0, MAX_SALARY]);

  const toggleSet = <T,>(set: Set<T>, value: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const filtered = useMemo(() => {
    const t = title.trim().toLowerCase();
    const c = city.trim().toLowerCase();
    return jobs.filter((j) => {
      if (t && !j.title.toLowerCase().includes(t) && !j.area.toLowerCase().includes(t)) return false;
      if (c && !j.city.toLowerCase().includes(c)) return false;
      if (state !== "all" && j.state !== state) return false;
      if (company !== "all" && j.company !== company) return false;
      if (remote.size && !remote.has(j.remote)) return false;
      if (levels.size && !levels.has(j.level)) return false;
      if (techs.size && ![...techs].every((tech) => j.technologies.includes(tech))) return false;
      if (j.salaryMax < salary[0] || j.salaryMin > salary[1]) return false;
      return true;
    });
  }, [title, city, state, company, remote, levels, techs, salary]);

  const clearAll = () => {
    setTitle("");
    setCity("");
    setState("all");
    setCompany("all");
    setRemote(new Set());
    setLevels(new Set());
    setTechs(new Set());
    setSalary([0, MAX_SALARY]);
  };

  const activeFilters =
    (title ? 1 : 0) +
    (city ? 1 : 0) +
    (state !== "all" ? 1 : 0) +
    (company !== "all" ? 1 : 0) +
    remote.size +
    levels.size +
    techs.size +
    (salary[0] > 0 || salary[1] < MAX_SALARY ? 1 : 0);

  const analyze = (job: Job) => {
    storage.setJobDescription(buildJobDescription(job));
    toast.success(`Vaga "${job.title}" carregada na análise.`);
    navigate({ to: "/app/analise" });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Buscar vagas</h1>
        <p className="mt-1 text-muted-foreground">
          Filtre por cargo, localização, modelo de trabalho, faixa salarial, nível, tecnologias e empresa.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4" /> Filtros
              {activeFilters > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilters}
                </Badge>
              )}
            </CardTitle>
            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="gap-1">
                <X className="h-3.5 w-3.5" /> Limpar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="f-title">Cargo ou área</Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="f-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex.: Desenvolvedor, Marketing"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="f-city">Cidade</Label>
              <Input
                id="f-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex.: São Paulo"
              />
            </div>

            <div className="grid gap-2">
              <Label>Estado</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {ALL_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Empresa</Label>
              <Select value={company} onValueChange={setCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {ALL_COMPANIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Modelo de trabalho</Label>
              <div className="grid gap-2">
                {REMOTE_OPTIONS.map((r) => (
                  <label key={r} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={remote.has(r)}
                      onCheckedChange={() => toggleSet(remote, r, setRemote)}
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nível</Label>
              <div className="grid grid-cols-2 gap-2">
                {LEVELS.map((lv) => (
                  <label key={lv} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={levels.has(lv)}
                      onCheckedChange={() => toggleSet(levels, lv, setLevels)}
                    />
                    {lv}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Faixa salarial (R$)</Label>
                <span className="text-xs text-muted-foreground">
                  {salary[0].toLocaleString("pt-BR")} – {salary[1].toLocaleString("pt-BR")}
                </span>
              </div>
              <Slider
                min={0}
                max={MAX_SALARY}
                step={500}
                value={salary}
                onValueChange={(v) => setSalary([v[0] ?? 0, v[1] ?? MAX_SALARY])}
              />
            </div>

            <div className="space-y-2">
              <Label>Tecnologias / Requisitos</Label>
              <div className="flex max-h-48 flex-wrap gap-1.5 overflow-auto rounded-md border border-border/60 p-2">
                {ALL_TECHS.map((tech) => {
                  const active = techs.has(tech);
                  return (
                    <button
                      key={tech}
                      type="button"
                      onClick={() => toggleSet(techs, tech, setTechs)}
                      className={`rounded-full border px-2.5 py-0.5 text-xs transition ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/60 bg-background text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {tech}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "vaga encontrada" : "vagas encontradas"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-sm text-muted-foreground">
                Nenhuma vaga corresponde aos filtros aplicados. Ajuste os critérios e tente novamente.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {filtered.map((job) => (
                <Card key={job.id} className="transition hover:border-primary/40 hover:shadow-sm">
                  <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <Badge variant="secondary">{job.level}</Badge>
                        <Badge variant="outline">{job.remote}</Badge>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" /> {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {job.city}/{job.state}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" /> {job.area}
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                        {job.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {job.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="border-accent/30 text-accent">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <p className="text-sm font-semibold">
                        R$ {job.salaryMin.toLocaleString("pt-BR")} –{" "}
                        {job.salaryMax.toLocaleString("pt-BR")}
                      </p>
                      <Button size="sm" onClick={() => analyze(job)} className="gap-1.5">
                        <Target className="h-4 w-4" /> Analisar match
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}