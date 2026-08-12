import type { Linha } from "./db.ts";

/** O banco fala snake_case, o TypeScript fala camelCase. */
export const paraCamel = (texto: string): string =>
  texto.replace(/_(\w)/g, (_, letra: string) => letra.toUpperCase());

/**
 * O formato da linha é garantido pelo `schema.sql`, não pelo tipo — por isso a
 * asserção. Se as colunas mudarem, quem quebra é o teste, não o compilador.
 */
export const linhaParaObjeto = <T>(linha: Linha): T =>
  Object.fromEntries(
    Object.entries(linha).map(([chave, valor]) => [paraCamel(chave), valor]),
  ) as T;

/**
 * Lê do corpo só as colunas da lista branca, na ordem delas. Campo extra que o
 * cliente mandar é ignorado — nunca vira coluna de UPDATE (mass assignment).
 */
export const valoresDe = (
  corpo: Linha,
  colunas: readonly string[],
): unknown[] => colunas.map((coluna) => corpo[paraCamel(coluna)] ?? null);
