export interface Job {
  id: string;
  title: string;
  company: string;
  city: string;
  state: string;
  remote: "Presencial" | "Remoto" | "Híbrido";
  level: "Estágio" | "Júnior" | "Pleno" | "Sênior" | "Especialista" | "Gestão";
  salaryMin: number;
  salaryMax: number;
  technologies: string[];
  area: string;
  description: string;
  postedAt: string;
  url?: string;
}

export const LEVELS: Job["level"][] = [
  "Estágio",
  "Júnior",
  "Pleno",
  "Sênior",
  "Especialista",
  "Gestão",
];

export const REMOTE_OPTIONS: Job["remote"][] = ["Presencial", "Remoto", "Híbrido"];

export const jobs: Job[] = [
  {
    id: "j1",
    title: "Desenvolvedor(a) Front-end React",
    company: "Nuvem Tech",
    city: "São Paulo",
    state: "SP",
    remote: "Remoto",
    level: "Pleno",
    salaryMin: 8000,
    salaryMax: 12000,
    technologies: ["React", "TypeScript", "Next.js", "Tailwind"],
    area: "Tecnologia",
    description:
      "Atuar no desenvolvimento de interfaces com React e TypeScript, colaborando com times de produto e design.",
    postedAt: "2026-07-10",
  },
  {
    id: "j2",
    title: "Engenheiro(a) de Dados",
    company: "DataForge",
    city: "Remoto",
    state: "BR",
    remote: "Remoto",
    level: "Sênior",
    salaryMin: 14000,
    salaryMax: 20000,
    technologies: ["Python", "Airflow", "AWS", "SQL", "Spark"],
    area: "Dados",
    description:
      "Construir pipelines de dados escaláveis, com foco em qualidade, observabilidade e performance.",
    postedAt: "2026-07-12",
  },
  {
    id: "j3",
    title: "Product Designer",
    company: "Beluga",
    city: "Florianópolis",
    state: "SC",
    remote: "Híbrido",
    level: "Pleno",
    salaryMin: 9000,
    salaryMax: 13000,
    technologies: ["Figma", "Design System", "User Research"],
    area: "Design",
    description:
      "Conduzir descoberta e entrega de produto, evoluindo o design system e conduzindo pesquisas com usuários.",
    postedAt: "2026-07-08",
  },
  {
    id: "j4",
    title: "Analista de Marketing Digital",
    company: "Loja&Cia",
    city: "Belo Horizonte",
    state: "MG",
    remote: "Presencial",
    level: "Júnior",
    salaryMin: 3500,
    salaryMax: 5000,
    technologies: ["Google Ads", "Meta Ads", "GA4", "SEO"],
    area: "Marketing",
    description:
      "Planejar e executar campanhas digitais, acompanhar métricas e otimizar performance de mídia.",
    postedAt: "2026-07-14",
  },
  {
    id: "j5",
    title: "Desenvolvedor(a) Back-end Node.js",
    company: "Fintak",
    city: "Rio de Janeiro",
    state: "RJ",
    remote: "Híbrido",
    level: "Sênior",
    salaryMin: 13000,
    salaryMax: 18000,
    technologies: ["Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
    area: "Tecnologia",
    description:
      "Desenvolver APIs robustas para produtos financeiros com foco em segurança e escalabilidade.",
    postedAt: "2026-07-09",
  },
  {
    id: "j6",
    title: "Gerente de Projetos",
    company: "Construtora Alfa",
    city: "Curitiba",
    state: "PR",
    remote: "Presencial",
    level: "Gestão",
    salaryMin: 12000,
    salaryMax: 16000,
    technologies: ["PMP", "MS Project", "Scrum"],
    area: "Gestão",
    description:
      "Gerir portfólio de obras, prazos, orçamento e times multidisciplinares.",
    postedAt: "2026-07-05",
  },
  {
    id: "j7",
    title: "Estágio em Recursos Humanos",
    company: "Grupo Prisma",
    city: "Porto Alegre",
    state: "RS",
    remote: "Híbrido",
    level: "Estágio",
    salaryMin: 1800,
    salaryMax: 2200,
    technologies: ["Recrutamento", "Excel", "Comunicação"],
    area: "RH",
    description:
      "Apoiar processos seletivos, onboarding e cultura organizacional.",
    postedAt: "2026-07-13",
  },
  {
    id: "j8",
    title: "Analista Financeiro",
    company: "Contábil Rio",
    city: "Rio de Janeiro",
    state: "RJ",
    remote: "Presencial",
    level: "Pleno",
    salaryMin: 6000,
    salaryMax: 9000,
    technologies: ["Excel Avançado", "Power BI", "SAP"],
    area: "Financeiro",
    description:
      "Elaborar análises financeiras, orçamento e relatórios gerenciais.",
    postedAt: "2026-07-11",
  },
  {
    id: "j9",
    title: "Especialista em Machine Learning",
    company: "Neuronix",
    city: "Remoto",
    state: "BR",
    remote: "Remoto",
    level: "Especialista",
    salaryMin: 18000,
    salaryMax: 26000,
    technologies: ["Python", "PyTorch", "MLOps", "GCP"],
    area: "Dados",
    description:
      "Projetar e colocar em produção modelos de ML com foco em NLP e recomendação.",
    postedAt: "2026-07-15",
  },
  {
    id: "j10",
    title: "Vendedor(a) Consultivo B2B",
    company: "SaaSPro",
    city: "São Paulo",
    state: "SP",
    remote: "Híbrido",
    level: "Pleno",
    salaryMin: 5000,
    salaryMax: 9000,
    technologies: ["HubSpot", "Prospecção", "Negociação"],
    area: "Vendas",
    description:
      "Prospectar e fechar contratos com clientes corporativos de médio porte.",
    postedAt: "2026-07-06",
  },
  {
    id: "j11",
    title: "Enfermeiro(a) Assistencial",
    company: "Hospital Vida",
    city: "Salvador",
    state: "BA",
    remote: "Presencial",
    level: "Pleno",
    salaryMin: 4500,
    salaryMax: 6500,
    technologies: ["UTI", "Emergência", "SAE"],
    area: "Saúde",
    description:
      "Prestar assistência de enfermagem em unidade hospitalar, seguindo protocolos clínicos.",
    postedAt: "2026-07-04",
  },
  {
    id: "j12",
    title: "DevOps Engineer",
    company: "CloudBase",
    city: "Remoto",
    state: "BR",
    remote: "Remoto",
    level: "Sênior",
    salaryMin: 15000,
    salaryMax: 22000,
    technologies: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Docker"],
    area: "Tecnologia",
    description:
      "Automatizar infraestrutura, esteiras de deploy e observabilidade em ambiente cloud.",
    postedAt: "2026-07-16",
  },
];

export function buildJobDescription(job: Job): string {
  return [
    `Vaga: ${job.title}`,
    `Empresa: ${job.company}`,
    `Local: ${job.city}/${job.state} (${job.remote})`,
    `Nível: ${job.level}`,
    `Faixa salarial: R$ ${job.salaryMin.toLocaleString("pt-BR")} - R$ ${job.salaryMax.toLocaleString("pt-BR")}`,
    `Tecnologias/Requisitos: ${job.technologies.join(", ")}`,
    "",
    "Descrição:",
    job.description,
  ].join("\n");
}