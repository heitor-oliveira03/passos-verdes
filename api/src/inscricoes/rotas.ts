import { Router } from "express";
import { exigirAdmin } from "../auth/sessoes.ts";
import { ErroHttp } from "../infra/erros.ts";
import { parametro } from "../infra/http.ts";
import { ehDataISO } from "../infra/validacao.ts";
import * as inscricoes from "./repositorio.ts";

export const rotasDeInscricoes = Router();

// Inscrição guarda CPF, e-mail, telefone e nascimento. Listar isso é só pro
// admin — nunca vira rota pública, nem "só pra teste".
rotasDeInscricoes.get("/inscricoes", exigirAdmin, async (req, res) => {
  const { eventoId } = req.query;
  res.json(
    await inscricoes.listar(
      typeof eventoId === "string" ? eventoId : undefined,
    ),
  );
});

// Pública: é o visitante se inscrevendo na prova.
rotasDeInscricoes.post("/inscricoes", async (req, res) => {
  if (!ehDataISO(req.body?.nascimento)) {
    throw new ErroHttp(400, "nascimento deve estar no formato AAAA-MM-DD");
  }
  res.status(201).json(await inscricoes.criar(req.body));
});

rotasDeInscricoes.delete("/inscricoes/:id", exigirAdmin, async (req, res) => {
  if (!(await inscricoes.remover(parametro(req, "id")))) {
    throw new ErroHttp(404, "Inscrição não encontrada");
  }
  res.json({ ok: true });
});
