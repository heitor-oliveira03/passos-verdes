import type { Inscricao, InscricaoEntrada } from "../dominio.ts";
import { db, type Linha } from "../infra/db.ts";
import { linhaParaObjeto, valoresDe } from "../infra/mapeamento.ts";

const COLUNAS = [
  "evento_id", "nome", "email", "cpf", "telefone",
  "nascimento", "sexo", "distancia", "camiseta", "equipe",
] as const;

const MARCADORES = COLUNAS.map((_, i) => `$${i + 1}`).join(", ");

export const listar = async (eventoId?: string): Promise<Inscricao[]> => {
  const { rows } = await db.query(
    eventoId
      ? "select * from inscricoes where evento_id = $1 order by numero_peito"
      : "select * from inscricoes order by evento_id, numero_peito",
    eventoId ? [eventoId] : [],
  );
  return rows.map((linha) => linhaParaObjeto<Inscricao>(linha));
};

/**
 * O número de peito é o maior da prova mais um — leitura-depois-escrita.
 *
 * Sem trava, inscrições simultâneas leem o mesmo máximo e todas menos uma são
 * recusadas pela UNIQUE (medido: 8 simultâneas, 2 recusadas). O lock é por
 * evento, então provas diferentes não esperam uma pela outra, e some sozinho
 * no commit ou no rollback.
 */
export const criar = async (entrada: InscricaoEntrada): Promise<Inscricao> => {
  const cliente = await db.connect();
  try {
    await cliente.query("begin");
    await cliente.query("select pg_advisory_xact_lock($1)", [entrada.eventoId]);
    const { rows } = await cliente.query(
      `insert into inscricoes (${COLUNAS.join(", ")}, numero_peito)
       values (${MARCADORES}, (
         select coalesce(max(numero_peito), 0) + 1
         from inscricoes where evento_id = $1
       )) returning *`,
      valoresDe(entrada as unknown as Linha, COLUNAS),
    );
    await cliente.query("commit");
    return linhaParaObjeto<Inscricao>(rows[0]);
  } catch (erro) {
    await cliente.query("rollback");
    throw erro;
  } finally {
    cliente.release();
  }
};

export const remover = async (id: string): Promise<boolean> => {
  const { rowCount } = await db.query("delete from inscricoes where id = $1", [
    id,
  ]);
  return rowCount === 1;
};
