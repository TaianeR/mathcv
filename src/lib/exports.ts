import type { AtsResume } from "./schemas";

export function atsToPlainText(ats: AtsResume): string {
  const lines: string[] = [];
  lines.push(ats.header.name.toUpperCase());
  lines.push(ats.header.contact);
  lines.push("");
  if (ats.objective) {
    lines.push("OBJETIVO");
    lines.push(ats.objective);
    lines.push("");
  }
  if (ats.summary) {
    lines.push("RESUMO PROFISSIONAL");
    lines.push(ats.summary);
    lines.push("");
  }
  if (ats.skills?.length) {
    lines.push("COMPETÊNCIAS");
    lines.push(ats.skills.join(" • "));
    lines.push("");
  }
  if (ats.experiences?.length) {
    lines.push("EXPERIÊNCIA PROFISSIONAL");
    for (const exp of ats.experiences) {
      lines.push(`${exp.role} — ${exp.company}`);
      if (exp.period) lines.push(exp.period);
      for (const b of exp.bullets ?? []) lines.push(`• ${b}`);
      lines.push("");
    }
  }
  if (ats.education?.length) {
    lines.push("FORMAÇÃO");
    for (const ed of ats.education) {
      lines.push(`${ed.degree} — ${ed.institution}${ed.period ? ` (${ed.period})` : ""}`);
    }
    lines.push("");
  }
  if (ats.certifications?.length) {
    lines.push("CERTIFICAÇÕES");
    for (const c of ats.certifications) lines.push(`• ${c}`);
    lines.push("");
  }
  if (ats.languages?.length) {
    lines.push("IDIOMAS");
    lines.push(ats.languages.join(" • "));
  }
  return lines.join("\n");
}

export function atsToMarkdown(ats: AtsResume): string {
  const parts: string[] = [];
  parts.push(`# ${ats.header.name}`);
  parts.push(`*${ats.header.contact}*`);
  if (ats.objective) parts.push(`## Objetivo\n${ats.objective}`);
  if (ats.summary) parts.push(`## Resumo Profissional\n${ats.summary}`);
  if (ats.skills?.length) parts.push(`## Competências\n${ats.skills.map((s) => `- ${s}`).join("\n")}`);
  if (ats.experiences?.length) {
    parts.push("## Experiência Profissional");
    for (const e of ats.experiences) {
      parts.push(`### ${e.role} — ${e.company}${e.period ? ` *(${e.period})*` : ""}`);
      parts.push((e.bullets ?? []).map((b) => `- ${b}`).join("\n"));
    }
  }
  if (ats.education?.length) {
    parts.push("## Formação");
    parts.push(ats.education.map((e) => `- **${e.degree}** — ${e.institution}${e.period ? ` (${e.period})` : ""}`).join("\n"));
  }
  if (ats.certifications?.length)
    parts.push(`## Certificações\n${ats.certifications.map((c) => `- ${c}`).join("\n")}`);
  if (ats.languages?.length) parts.push(`## Idiomas\n${ats.languages.map((l) => `- ${l}`).join("\n")}`);
  return parts.join("\n\n");
}

function download(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportTxt(ats: AtsResume) {
  download("curriculo-ats.txt", new Blob([atsToPlainText(ats)], { type: "text/plain;charset=utf-8" }));
}

export function exportMarkdown(ats: AtsResume) {
  download("curriculo-ats.md", new Blob([atsToMarkdown(ats)], { type: "text/markdown;charset=utf-8" }));
}

export async function exportPdf(ats: AtsResume) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 56;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 48) {
      doc.addPage();
      y = 56;
    }
  };

  const writeParagraph = (text: string, size: number, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, pageWidth - marginX * 2);
    for (const line of lines) {
      ensureSpace(size + 4);
      doc.text(line, marginX, y);
      y += size + 4;
    }
  };

  const sectionTitle = (text: string) => {
    y += 8;
    ensureSpace(24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(77, 163, 255);
    doc.text(text.toUpperCase(), marginX, y);
    y += 4;
    doc.setDrawColor(77, 163, 255);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 14;
    doc.setTextColor(31, 41, 55);
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(31, 41, 55);
  doc.text(ats.header.name || "Currículo", marginX, y);
  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.text(ats.header.contact || "", marginX, y);
  y += 12;
  doc.setTextColor(31, 41, 55);

  if (ats.objective) {
    sectionTitle("Objetivo");
    writeParagraph(ats.objective, 10);
  }
  if (ats.summary) {
    sectionTitle("Resumo Profissional");
    writeParagraph(ats.summary, 10);
  }
  if (ats.skills?.length) {
    sectionTitle("Competências");
    writeParagraph(ats.skills.join(" • "), 10);
  }
  if (ats.experiences?.length) {
    sectionTitle("Experiência Profissional");
    for (const exp of ats.experiences) {
      writeParagraph(`${exp.role} — ${exp.company}`, 11, true);
      if (exp.period) writeParagraph(exp.period, 9);
      for (const b of exp.bullets ?? []) writeParagraph(`• ${b}`, 10);
      y += 4;
    }
  }
  if (ats.education?.length) {
    sectionTitle("Formação");
    for (const ed of ats.education)
      writeParagraph(`${ed.degree} — ${ed.institution}${ed.period ? ` (${ed.period})` : ""}`, 10);
  }
  if (ats.certifications?.length) {
    sectionTitle("Certificações");
    for (const c of ats.certifications) writeParagraph(`• ${c}`, 10);
  }
  if (ats.languages?.length) {
    sectionTitle("Idiomas");
    writeParagraph(ats.languages.join(" • "), 10);
  }
  doc.save("curriculo-ats.pdf");
}

export async function exportDocx(ats: AtsResume) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx");
  const children: InstanceType<typeof Paragraph>[] = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: ats.header.name || "Currículo", bold: true, size: 36 })],
    }),
    new Paragraph({ children: [new TextRun({ text: ats.header.contact || "", size: 20 })] }),
    new Paragraph({ children: [new TextRun("")] }),
  );

  const section = (title: string) =>
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun({ text: title.toUpperCase(), bold: true, size: 24, color: "4DA3FF" })],
      }),
    );
  const p = (text: string, opts: { bold?: boolean } = {}) =>
    children.push(new Paragraph({ children: [new TextRun({ text, bold: opts.bold, size: 22 })] }));

  if (ats.objective) {
    section("Objetivo");
    p(ats.objective);
  }
  if (ats.summary) {
    section("Resumo Profissional");
    p(ats.summary);
  }
  if (ats.skills?.length) {
    section("Competências");
    p(ats.skills.join(" • "));
  }
  if (ats.experiences?.length) {
    section("Experiência Profissional");
    for (const exp of ats.experiences) {
      p(`${exp.role} — ${exp.company}`, { bold: true });
      if (exp.period) p(exp.period);
      for (const b of exp.bullets ?? []) p(`• ${b}`);
      children.push(new Paragraph({ children: [new TextRun("")] }));
    }
  }
  if (ats.education?.length) {
    section("Formação");
    for (const ed of ats.education)
      p(`${ed.degree} — ${ed.institution}${ed.period ? ` (${ed.period})` : ""}`);
  }
  if (ats.certifications?.length) {
    section("Certificações");
    for (const c of ats.certifications) p(`• ${c}`);
  }
  if (ats.languages?.length) {
    section("Idiomas");
    p(ats.languages.join(" • "));
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  download("curriculo-ats.docx", blob);
}