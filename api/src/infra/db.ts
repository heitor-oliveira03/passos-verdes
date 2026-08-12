import pg from "pg";

const OID_DATE = 1082;

/**
 * Sem isso o driver vira `date` em Date do JS no fuso da máquina e o JSON sai
 * em UTC — `2026-04-12` viraria `2026-04-11T21:00:00Z` a leste de Greenwich.
 * Dia de prova é dia, não instante: devolve a string crua do banco.
 */
pg.types.setTypeParser(OID_DATE, (valor) => valor);

/** Punhado de conexões reaproveitadas; abrir uma por request seria lento. */
export const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export type Linha = Record<string, unknown>;
