import { Router } from "express";
import { conferirSenha } from "./senha.ts";
import {
  abrirSessao,
  estaAutenticado,
  fecharSessao,
  limparFalhas,
  minutosBloqueado,
  registrarFalha,
  tokenDo,
} from "./sessoes.ts";

export const rotasDeAuth = Router();

rotasDeAuth.post("/login", async (req, res) => {
  const minutos = minutosBloqueado(req.ip ?? "");
  if (minutos > 0) {
    res
      .status(429)
      .json({ erro: `Muitas tentativas. Tente de novo em ${minutos} min.` });
    return;
  }

  const senha: unknown = req.body?.senha;
  if (
    typeof senha !== "string" ||
    !(await conferirSenha(senha, process.env.ADMIN_HASH))
  ) {
    registrarFalha(req.ip ?? "");
    res.status(401).json({ erro: "Senha inválida" });
    return;
  }

  limparFalhas(req.ip ?? "");
  res.cookie("sessao", abrirSessao(), {
    // O JavaScript da página não lê esse cookie: um XSS não rouba a sessão.
    httpOnly: true,
    // Outro site não consegue disparar request autenticado em nome do admin.
    sameSite: "lax",
    // Exige https. Fora de produção o navegador descartaria o cookie.
    secure: process.env.NODE_ENV === "production",
  });
  res.json({ ok: true });
});

rotasDeAuth.post("/logout", (req, res) => {
  fecharSessao(tokenDo(req));
  res.clearCookie("sessao");
  res.json({ ok: true });
});

// O front pergunta "ainda estou logado?" ao montar o painel.
rotasDeAuth.get("/sessao", (req, res) => {
  res.json({ autenticado: estaAutenticado(req) });
});
