import type { Banner, BannerEntrada } from "../dominio.ts";
import { db, type Linha } from "../infra/db.ts";
import { linhaParaObjeto, valoresDe } from "../infra/mapeamento.ts";
import { atualizacao, insercao } from "../infra/sql.ts";

const COLUNAS = [
  "eyebrow", "titulo", "destaque", "subtitulo",
  "cta_label", "cta_href", "imagem", "ativo",
] as const;

export const listar = async (): Promise<Banner[]> => {
  const { rows } = await db.query("select * from banners order by id");
  return rows.map((linha) => linhaParaObjeto<Banner>(linha));
};

export const criar = async (entrada: BannerEntrada): Promise<Banner> => {
  const { rows } = await db.query(
    insercao("banners", COLUNAS),
    valoresDe(entrada as unknown as Linha, COLUNAS),
  );
  return linhaParaObjeto<Banner>(rows[0]);
};

export const substituir = async (
  id: string,
  entrada: BannerEntrada,
): Promise<Banner | undefined> => {
  const { rows } = await db.query(atualizacao("banners", COLUNAS), [
    ...valoresDe(entrada as unknown as Linha, COLUNAS),
    id,
  ]);
  return rows[0] ? linhaParaObjeto<Banner>(rows[0]) : undefined;
};

export const remover = async (id: string): Promise<boolean> => {
  const { rowCount } = await db.query("delete from banners where id = $1", [id]);
  return rowCount === 1;
};
