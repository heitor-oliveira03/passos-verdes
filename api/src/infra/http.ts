import type { Request } from "express";

/**
 * O Express tipa `params` como podendo ser lista (rotas curinga) e o
 * `noUncheckedIndexedAccess` acrescenta `undefined`. As rotas daqui só usam
 * parâmetro simples, então normaliza num ponto só em vez de espalhar `String()`.
 */
export const parametro = (req: Request, nome: string): string =>
  String(req.params[nome] ?? "");
