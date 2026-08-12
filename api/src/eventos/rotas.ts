import { Router } from "express";
import { exigirAdmin } from "../auth/sessoes.ts";
import { ErroHttp } from "../infra/erros.ts";
import { parametro } from "../infra/http.ts";
import { ehDataISO } from "../infra/validacao.ts";
import * as eventos from "./repositorio.ts";

export const rotasDeEventos = Router();

const exigirDataISO = (valor: unknown): void => {
  if (!ehDataISO(valor)) {
    throw new ErroHttp(400, "data deve estar no formato AAAA-MM-DD");
  }
};

rotasDeEventos.get("/eventos", async (_req, res) => {
  res.json(await eventos.listar());
});

rotasDeEventos.get("/eventos/:slug", async (req, res) => {
  const evento = await eventos.porSlug(parametro(req, "slug"));
  if (!evento) throw new ErroHttp(404, "Evento não encontrado");
  res.json(evento);
});

rotasDeEventos.post("/eventos", exigirAdmin, async (req, res) => {
  exigirDataISO(req.body?.data);
  res.status(201).json(await eventos.criar(req.body));
});

// PUT substitui o evento inteiro — é como o admin salva: manda o objeto
// completo, não um pedaço.
rotasDeEventos.put("/eventos/:id", exigirAdmin, async (req, res) => {
  exigirDataISO(req.body?.data);
  const evento = await eventos.substituir(parametro(req, "id"), req.body);
  if (!evento) throw new ErroHttp(404, "Evento não encontrado");
  res.json(evento);
});

rotasDeEventos.delete("/eventos/:id", exigirAdmin, async (req, res) => {
  if (!(await eventos.remover(parametro(req, "id")))) {
    throw new ErroHttp(404, "Evento não encontrado");
  }
  res.json({ ok: true });
});
