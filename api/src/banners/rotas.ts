import { Router } from "express";
import { exigirAdmin } from "../auth/sessoes.ts";
import { ErroHttp } from "../infra/erros.ts";
import { parametro } from "../infra/http.ts";
import * as banners from "./repositorio.ts";

export const rotasDeBanners = Router();

rotasDeBanners.get("/banners", async (_req, res) => {
  res.json(await banners.listar());
});

rotasDeBanners.post("/banners", exigirAdmin, async (req, res) => {
  res.status(201).json(await banners.criar(req.body));
});

rotasDeBanners.put("/banners/:id", exigirAdmin, async (req, res) => {
  const banner = await banners.substituir(parametro(req, "id"), req.body);
  if (!banner) throw new ErroHttp(404, "Banner não encontrado");
  res.json(banner);
});

rotasDeBanners.delete("/banners/:id", exigirAdmin, async (req, res) => {
  if (!(await banners.remover(parametro(req, "id")))) {
    throw new ErroHttp(404, "Banner não encontrado");
  }
  res.json({ ok: true });
});
