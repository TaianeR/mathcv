# 🎯 Career Match AI

> Plataforma com Inteligência Artificial que compara seu currículo com uma vaga e gera um currículo no formato ATS (o que os sistemas de seleção leem) e a carta de apresentação.

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)](https://mathcv.lovable.app/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Lovable](https://img.shields.io/badge/Built%20with-Lovable-purple)](https://lovable.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🌍 Veja funcionando

### 👉 [mathcv.lovable.app](https://mathcv.lovable.app/)

## 📖 Sobre o projeto

O Career Match AI ajuda candidatos a aumentar as chances em processos seletivos. Você envia o currículo, cola a descrição da vaga e a IA:

- calcula o percentual de compatibilidade (**Match Score**)
- aponta palavras-chave e sugestões de melhoria
- gera uma nova versão do currículo em formato **ATS Friendly**, sem inventar informações
- escreve uma carta de apresentação para aquela vaga

## ✨ Funcionalidades

1. O usuário envia seu currículo em formato compatível.
2. A aplicação extrai e organiza as informações do documento.
3. O usuário informa a descrição da vaga desejada.
4. A inteligência artificial analisa a compatibilidade entre o currículo e a vaga.
5. O sistema apresenta o Match Score e identifica pontos de melhoria.
6. A aplicação gera um currículo otimizado para ATS e uma carta de apresentação.
7. O usuário pode exportar os documentos gerados.

## 🛠️ Tecnologias e ferramentas

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- ShadCN/UI
- Framer Motion
- Lucide React

### Framework e gerenciamento
- TanStack Start
- TanStack Router
- TanStack Query
- Vite

### Inteligência Artificial
- OpenAI API
- AI SDK

### Processamento de documentos
- PDF.js
- Mammoth
- DOCX
- jsPDF

### Formulários e validação
- React Hook Form
- Zod

### Visualização de dados
- Recharts

### Desenvolvimento
- Git
- GitHub
- Bun
- ESLint
- Prettier
- Lovable

## 🎨 Design

Interface com ShadCN/UI, paleta azul e branca, responsiva (desktop, notebook, tablet e celular) e com navegação por teclado e ARIA labels.

## 🗺 Roadmap

**Pronto (MVP):** landing page, dashboard, upload do currículo, campo de vaga, Match Score, currículo ATS e exportação.

**Próximos passos:**
- [ ] Histórico completo e analytics avançados
- [ ] Integração com APIs de vagas e com o LinkedIn
- [ ] Login opcional e banco de dados em nuvem
- [ ] Múltiplas versões do currículo
- [ ] Simulador de entrevistas e sugestão de cursos

## 🔒 Privacidade

O projeto não exige login. O texto do currículo é enviado à OpenAI apenas para a análise e a geração dos documentos. Os dados da sessão ficam no navegador de quem usa.

## 📄 Licença

Distribuído sob a licença MIT.

## 👩‍💻 Autora

Feito por **Taiane Ribas da Silveira**
[LinkedIn](https://www.linkedin.com/in/taiane-ribas-dev) • [GitHub](https://github.com/TaianeR)
