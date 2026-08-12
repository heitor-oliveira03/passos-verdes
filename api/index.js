import { randomBytes } from "node:crypto";
import express from "express";
import pg from "pg";
import { conferirSenha } from "./senha.js";

// Pegadinha 1: o driver transforma `date` em Date do JS no fuso da máquina, e
// o JSON sai em UTC — `2026-04-12` viraria `2026-04-11T21:00:00Z` em fuso a
// leste. Dia de prova é dia, não instante: devolve a string crua do banco.
pg.types.setTypeParser(1082, (valor) => valor);

// Pool: um punhado de conexões reaproveitadas. Abrir uma conexão por request
// seria lento e o Postgres tem teto de conexões.
const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

/* ---------- tradução banco <-> front ---------- */

// Pegadinha 2: banco fala snake_case, TypeScript fala camelCase.
const paraCamel = (texto) =>
  texto.replace(/_(\w)/g, (_, letra) => letra.toUpperCase());

const linhaParaObjeto = (linha) =>
  Object.fromEntries(
    Object.entries(linha).map(([chave, valor]) => [paraCamel(chave), valor]),
  );

// Pegadinha 3: `numeric` chega como string ("80.00") pra não perder centavo.
// lib/types.ts espera número — converte na fronteira, uma vez só.
const comoEvento = (linha) => ({
  ...linhaParaObjeto(linha),
  preco: Number(linha.preco),
});

const app = express();
app.use(express.json());

// O Next repassa /api/* pra cá e anexa o IP real em X-Forwarded-For.
// Sem isso, todo request pareceria vir de 127.0.0.1 e o limite abaixo
// trancaria todo mundo junto.
app.set("trust proxy", 1);

/* ---------- sessão do admin ---------- */

// ponytail: sessões em memória. Reiniciar a API desloga o admin — aceitável
// pra um painel de uma pessoa. Vira tabela quando incomodar.
const sessoes = new Set();

// Um cookie só, um regex só. Não vale um pacote de parsing.
const tokenDo = (req) =>
  req.headers.cookie?.match(/(?:^|;\s*)sessao=([^;]+)/)?.[1];

const JANELA = 15 * 60 * 1000;
const TENTATIVAS = 5;

// ponytail: Map em memória, sem faxina. Um ataque de muitos IPs faria ele
// crescer; com um admin só, não vale um Redis. Vira Redis se a API escalar
// pra mais de um processo — aí cada processo teria a sua contagem.
const falhas = new Map();

app.post("/login", async (req, res) => {
  const bloqueio = falhas.get(req.ip);
  if (bloqueio && bloqueio.quantidade >= TENTATIVAS && Date.now() < bloqueio.ate) {
    const minutos = Math.ceil((bloqueio.ate - Date.now()) / 60000);
    return res
      .status(429)
      .json({ erro: `Muitas tentativas. Tente de novo em ${minutos} min.` });
  }

  const { senha } = req.body ?? {};
  if (
    typeof senha !== "string" ||
    !(await conferirSenha(senha, process.env.ADMIN_HASH))
  ) {
    const quantidade = (bloqueio?.quantidade ?? 0) + 1;
    falhas.set(req.ip, { quantidade, ate: Date.now() + JANELA });
    return res.status(401).json({ erro: "Senha inválida" });
  }

  falhas.delete(req.ip);
  const token = randomBytes(32).toString("hex");
  sessoes.add(token);
  res.cookie("sessao", token, {
    // httpOnly: o JavaScript da página não lê esse cookie, então um XSS não
    // rouba a sessão.
    httpOnly: true,
    // sameSite lax: outro site não consegue disparar requests autenticados
    // em nome do admin (CSRF).
    sameSite: "lax",
    // secure só em produção — localhost não tem https, e o navegador
    // descartaria o cookie.
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ ok: true });
});

app.post("/logout", (req, res) => {
  sessoes.delete(tokenDo(req));
  res.clearCookie("sessao");
  res.json({ ok: true });
});

// O front pergunta "ainda estou logado?" ao montar o painel.
app.get("/sessao", (req, res) => res.json({ autenticado: sessoes.has(tokenDo(req)) }));

/** Portaria das rotas de escrita. */
function exigirAdmin(req, res, next) {
  if (!sessoes.has(tokenDo(req))) {
    return res.status(401).json({ erro: "Não autenticado" });
  }
  next();
}

/* ---------- eventos ---------- */

// Lista branca. O corpo do request nunca escolhe coluna — senão qualquer campo
// extra que o cliente mandar viraria UPDATE (mass assignment).
const COLUNAS_EVENTO = [
  "slug", "nome", "edicao", "modalidade", "data", "horario", "local",
  "cidade", "distancias", "preco", "vagas", "imagem", "descricao", "publicado",
];

const valoresDe = (corpo, colunas) =>
  colunas.map((coluna) => corpo[paraCamel(coluna)] ?? null);

/**
 * Exige ISO. Sem isso o Postgres interpreta "12/09/2026" como MM/DD e grava
 * 9 de dezembro no lugar de 12 de setembro — sem erro nenhum.
 */
const ehDataISO = (valor) =>
  typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor);

app.get("/eventos", async (_req, res) => {
  const { rows } = await db.query("select * from eventos order by data");
  res.json(rows.map(comoEvento));
});

app.get("/eventos/:slug", async (req, res) => {
  const { rows } = await db.query("select * from eventos where slug = $1", [
    req.params.slug,
  ]);
  if (!rows[0]) return res.status(404).json({ erro: "Evento não encontrado" });
  res.json(comoEvento(rows[0]));
});

app.post("/eventos", exigirAdmin, async (req, res) => {
  if (!ehDataISO(req.body?.data)) {
    return res.status(400).json({ erro: "data deve estar no formato AAAA-MM-DD" });
  }
  const marcadores = COLUNAS_EVENTO.map((_, i) => `$${i + 1}`).join(", ");
  const { rows } = await db.query(
    `insert into eventos (${COLUNAS_EVENTO.join(", ")})
     values (${marcadores}) returning *`,
    valoresDe(req.body, COLUNAS_EVENTO),
  );
  res.status(201).json(comoEvento(rows[0]));
});

// PUT substitui o evento inteiro — é como o admin salva hoje: manda o objeto
// completo, não um pedaço.
app.put("/eventos/:id", exigirAdmin, async (req, res) => {
  if (!ehDataISO(req.body?.data)) {
    return res.status(400).json({ erro: "data deve estar no formato AAAA-MM-DD" });
  }
  const atribuicoes = COLUNAS_EVENTO.map((c, i) => `${c} = $${i + 1}`).join(", ");
  const { rows } = await db.query(
    `update eventos set ${atribuicoes}
     where id = $${COLUNAS_EVENTO.length + 1} returning *`,
    [...valoresDe(req.body, COLUNAS_EVENTO), req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ erro: "Evento não encontrado" });
  res.json(comoEvento(rows[0]));
});

app.delete("/eventos/:id", exigirAdmin, async (req, res) => {
  // As inscrições vão junto pelo `on delete cascade` do schema.
  const { rowCount } = await db.query("delete from eventos where id = $1", [
    req.params.id,
  ]);
  if (!rowCount) return res.status(404).json({ erro: "Evento não encontrado" });
  res.json({ ok: true });
});

/* ---------- banners ---------- */

const COLUNAS_BANNER = [
  "eyebrow", "titulo", "destaque", "subtitulo",
  "cta_label", "cta_href", "imagem", "ativo",
];

app.get("/banners", async (_req, res) => {
  const { rows } = await db.query("select * from banners order by id");
  res.json(rows.map(linhaParaObjeto));
});

app.post("/banners", exigirAdmin, async (req, res) => {
  const marcadores = COLUNAS_BANNER.map((_, i) => `$${i + 1}`).join(", ");
  const { rows } = await db.query(
    `insert into banners (${COLUNAS_BANNER.join(", ")})
     values (${marcadores}) returning *`,
    valoresDe(req.body, COLUNAS_BANNER),
  );
  res.status(201).json(linhaParaObjeto(rows[0]));
});

app.put("/banners/:id", exigirAdmin, async (req, res) => {
  const atribuicoes = COLUNAS_BANNER.map((c, i) => `${c} = $${i + 1}`).join(", ");
  const { rows } = await db.query(
    `update banners set ${atribuicoes}
     where id = $${COLUNAS_BANNER.length + 1} returning *`,
    [...valoresDe(req.body, COLUNAS_BANNER), req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ erro: "Banner não encontrado" });
  res.json(linhaParaObjeto(rows[0]));
});

app.delete("/banners/:id", exigirAdmin, async (req, res) => {
  const { rowCount } = await db.query("delete from banners where id = $1", [
    req.params.id,
  ]);
  if (!rowCount) return res.status(404).json({ erro: "Banner não encontrado" });
  res.json({ ok: true });
});

/* ---------- inscrições ---------- */

const COLUNAS_INSCRICAO = [
  "evento_id", "nome", "email", "cpf", "telefone",
  "nascimento", "sexo", "distancia", "camiseta", "equipe",
];

// Inscrição guarda CPF, e-mail, telefone e data de nascimento. Listar isso é
// só pro admin — nunca vira rota pública, nem "só pra teste".
app.get("/inscricoes", exigirAdmin, async (req, res) => {
  const { eventoId } = req.query;
  const { rows } = await db.query(
    eventoId
      ? "select * from inscricoes where evento_id = $1 order by numero_peito"
      : "select * from inscricoes order by evento_id, numero_peito",
    eventoId ? [eventoId] : [],
  );
  res.json(rows.map(linhaParaObjeto));
});

app.post("/inscricoes", async (req, res) => {
  if (!ehDataISO(req.body?.nascimento)) {
    return res
      .status(400)
      .json({ erro: "nascimento deve estar no formato AAAA-MM-DD" });
  }

  const marcadores = COLUNAS_INSCRICAO.map((_, i) => `$${i + 1}`).join(", ");

  // Ler o maior número e gravar o seguinte é leitura-depois-escrita: sem trava,
  // inscrições simultâneas leem o mesmo máximo e todas menos uma são recusadas
  // pela UNIQUE. O lock é por evento (o id é a chave), então provas diferentes
  // não esperam uma pela outra. Some sozinho no commit ou no rollback.
  const cliente = await db.connect();
  try {
    await cliente.query("begin");
    await cliente.query("select pg_advisory_xact_lock($1)", [req.body.eventoId]);
    const { rows } = await cliente.query(
      `insert into inscricoes (${COLUNAS_INSCRICAO.join(", ")}, numero_peito)
       values (${marcadores}, (
         select coalesce(max(numero_peito), 0) + 1
         from inscricoes where evento_id = $1
       )) returning *`,
      valoresDe(req.body, COLUNAS_INSCRICAO),
    );
    await cliente.query("commit");
    res.status(201).json(linhaParaObjeto(rows[0]));
  } catch (erro) {
    await cliente.query("rollback");
    throw erro;
  } finally {
    cliente.release();
  }
});

app.delete("/inscricoes/:id", exigirAdmin, async (req, res) => {
  const { rowCount } = await db.query("delete from inscricoes where id = $1", [
    req.params.id,
  ]);
  if (!rowCount) return res.status(404).json({ erro: "Inscrição não encontrada" });
  res.json({ ok: true });
});

/* ---------- erros ---------- */

// Express 5 manda toda promise rejeitada pra cá. Sem isso, violar um CHECK do
// banco viraria 500 genérico e o admin não saberia o que corrigir.
const STATUS_POR_CODIGO = {
  "23502": 400, // not null: campo obrigatório faltando no corpo
  "23505": 409, // unique: slug repetido
  "23514": 400, // check: modalidade/sexo/camiseta fora da lista
  "23503": 400, // foreign key: evento inexistente
  "22P02": 400, // texto onde o banco espera número/data
  "22007": 400, // data mal formatada
};

// `erro.detail` do Postgres traz a linha inteira ("Failing row contains ...").
// Útil no log, vazamento no response — devolve só o campo culpado.
const MENSAGEM_POR_CODIGO = {
  "23502": (e) => `campo obrigatório faltando: ${e.column}`,
  "23505": () => "já existe um registro com esse valor único",
  "23514": (e) => `valor fora da lista permitida (${e.constraint})`,
  "23503": () => "referência para um registro que não existe",
  "22P02": () => "tipo inválido em algum campo",
  "22007": () => "data inválida",
};

app.use((erro, _req, res, _next) => {
  const status = STATUS_POR_CODIGO[erro.code];
  if (status) {
    console.error(erro.message);
    return res.status(status).json({ erro: MENSAGEM_POR_CODIGO[erro.code](erro) });
  }
  console.error(erro);
  res.status(500).json({ erro: "Erro interno" });
});

app.listen(3001, () => console.log("api em http://localhost:3001"));
