import type { ErrorRequestHandler } from "express";

/** Erro que a rota levanta de propósito, já com o status certo. */
export class ErroHttp extends Error {
  // Campo declarado à mão: `constructor(readonly status)` é açúcar que o Node
  // não consegue apagar, só compilar — e aqui não há etapa de compilação.
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.status = status;
  }
}

type ErroPostgres = Error & {
  code?: string;
  column?: string;
  constraint?: string;
};

const STATUS_POR_CODIGO: Record<string, number> = {
  "23502": 400, // not null: campo obrigatório faltando
  "23503": 400, // foreign key: referência inexistente
  "23505": 409, // unique: slug repetido
  "23514": 400, // check: valor fora da lista
  "22007": 400, // data mal formatada
  "22P02": 400, // texto onde o banco espera número/data
};

/**
 * `erro.detail` do Postgres traz a linha inteira ("Failing row contains ...").
 * Serve no log, vaza dado no response — devolve só o campo culpado.
 */
const MENSAGEM_POR_CODIGO: Record<string, (erro: ErroPostgres) => string> = {
  "23502": (e) => `campo obrigatório faltando: ${e.column}`,
  "23503": () => "referência para um registro que não existe",
  "23505": () => "já existe um registro com esse valor único",
  "23514": (e) => `valor fora da lista permitida (${e.constraint})`,
  "22007": () => "data inválida",
  "22P02": () => "tipo inválido em algum campo",
};

/**
 * O Express 5 encaminha promise rejeitada pra cá sozinho. Sem esse tratamento,
 * violar um CHECK do banco viraria 500 e o admin não saberia o que corrigir.
 */
export const tratarErros: ErrorRequestHandler = (erro, _req, res, _next) => {
  if (erro instanceof ErroHttp) {
    res.status(erro.status).json({ erro: erro.message });
    return;
  }

  const { code } = erro as ErroPostgres;
  const status = code ? STATUS_POR_CODIGO[code] : undefined;
  if (code && status) {
    console.error(code, (erro as Error).message);
    res.status(status).json({ erro: MENSAGEM_POR_CODIGO[code]!(erro) });
    return;
  }

  console.error(erro);
  res.status(500).json({ erro: "Erro interno" });
};
