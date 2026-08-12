import type { Evento, EventoEntrada } from "../dominio.ts";
import { db, type Linha } from "../infra/db.ts";
import { linhaParaObjeto, valoresDe } from "../infra/mapeamento.ts";
import { atualizacao, insercao } from "../infra/sql.ts";

const COLUNAS = [
  "slug", "nome", "edicao", "modalidade", "data", "horario", "local",
  "cidade", "distancias", "preco", "vagas", "imagem", "descricao", "publicado",
] as const;

/**
 * `numeric` chega como string ("80.00") pra não perder centavo no caminho.
 * O domínio quer número — a conversão acontece aqui, uma vez só.
 */
const comoEvento = (linha: Linha): Evento => ({
  ...linhaParaObjeto<Evento>(linha),
  preco: Number(linha.preco),
});

export const listar = async (): Promise<Evento[]> => {
  const { rows } = await db.query("select * from eventos order by data");
  return rows.map(comoEvento);
};

export const porSlug = async (slug: string): Promise<Evento | undefined> => {
  const { rows } = await db.query("select * from eventos where slug = $1", [
    slug,
  ]);
  return rows[0] ? comoEvento(rows[0]) : undefined;
};

export const criar = async (entrada: EventoEntrada): Promise<Evento> => {
  const { rows } = await db.query(insercao("eventos", COLUNAS), valoresDe(
    entrada as unknown as Linha,
    COLUNAS,
  ));
  return comoEvento(rows[0]);
};

export const substituir = async (
  id: string,
  entrada: EventoEntrada,
): Promise<Evento | undefined> => {
  const { rows } = await db.query(atualizacao("eventos", COLUNAS), [
    ...valoresDe(entrada as unknown as Linha, COLUNAS),
    id,
  ]);
  return rows[0] ? comoEvento(rows[0]) : undefined;
};

/** As inscrições vão junto pelo `on delete cascade` do schema. */
export const remover = async (id: string): Promise<boolean> => {
  const { rowCount } = await db.query("delete from eventos where id = $1", [id]);
  return rowCount === 1;
};
