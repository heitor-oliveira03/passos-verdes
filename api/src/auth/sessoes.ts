import { randomBytes } from "node:crypto";
import type { Request, RequestHandler } from "express";

/**
 * ponytail: sessões e tentativas vivem em memória. Reiniciar a API desloga o
 * admin, e dois processos não compartilham contagem. Aceitável pra um painel
 * de uma pessoa; vira Redis quando a API rodar em mais de um processo.
 */
const sessoes = new Set<string>();

/** Um cookie só, um regex só. Não vale um pacote de parsing. */
export const tokenDo = (req: Request): string | undefined =>
  req.headers.cookie?.match(/(?:^|;\s*)sessao=([^;]+)/)?.[1];

export const abrirSessao = (): string => {
  const token = randomBytes(32).toString("hex");
  sessoes.add(token);
  return token;
};

export const fecharSessao = (token: string | undefined): void => {
  if (token) sessoes.delete(token);
};

export const estaAutenticado = (req: Request): boolean =>
  sessoes.has(tokenDo(req) ?? "");

/** Portaria das rotas de escrita e das que devolvem dado pessoal. */
export const exigirAdmin: RequestHandler = (req, res, next) => {
  if (!estaAutenticado(req)) {
    res.status(401).json({ erro: "Não autenticado" });
    return;
  }
  next();
};

/* ---------- limite de tentativas de login ---------- */

const JANELA = 15 * 60 * 1000;
const TENTATIVAS = 5;

const falhas = new Map<string, { quantidade: number; ate: number }>();

/** Minutos restantes de bloqueio, ou 0 se o IP pode tentar. */
export const minutosBloqueado = (ip: string): number => {
  const registro = falhas.get(ip);
  if (!registro || registro.quantidade < TENTATIVAS) return 0;
  const restante = registro.ate - Date.now();
  return restante > 0 ? Math.ceil(restante / 60_000) : 0;
};

export const registrarFalha = (ip: string): void => {
  const quantidade = (falhas.get(ip)?.quantidade ?? 0) + 1;
  falhas.set(ip, { quantidade, ate: Date.now() + JANELA });
};

export const limparFalhas = (ip: string): void => {
  falhas.delete(ip);
};
