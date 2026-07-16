export function aiErrorMessage(error: unknown, fallback: string): string {
  const msg = error instanceof Error ? error.message : String(error ?? "");
  if (/429|rate.?limit/i.test(msg)) {
    return "Muitas requisições em pouco tempo. Aguarde alguns segundos e tente novamente.";
  }
  if (/\b402\b|credit|insufficient/i.test(msg)) {
    return "Créditos de IA esgotados no workspace. Adicione créditos para continuar.";
  }
  if (/timeout|ETIMEDOUT|network/i.test(msg)) {
    return "Falha de rede ao contatar a IA. Verifique sua conexão e tente novamente.";
  }
  return fallback;
}