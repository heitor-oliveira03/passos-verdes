"use client";

import { useSyncExternalStore } from "react";
import { SEED } from "./seed";
import type { Banner, Dados, Evento, Inscricao } from "./types";

/**
 * Store de mentira no lugar do backend.
 *
 * ponytail: tudo vive em memória + localStorage. Quando entrar um backend de
 * verdade, só as funções exportadas daqui mudam — nenhuma tela precisa saber.
 */

// v2: seed ganhou banner de trail e imagens. Subir a versão descarta o que
// estava salvo no navegador — é o preço de a seed ainda ser a fonte da verdade.
const CHAVE = "passos-verdes/dados/v2";
const CHAVE_SESSAO = "passos-verdes/admin";
const SENHA = "verde2026";

let dados: Dados = SEED;
let hidratado = false;
const ouvintes = new Set<() => void>();

function hidratar() {
  if (hidratado) return;
  hidratado = true;
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) dados = JSON.parse(bruto) as Dados;
  } catch {
    // Storage indisponível ou corrompido: segue com a seed.
  }
}

function gravar(proximo: Dados) {
  dados = proximo;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(proximo));
  } catch {
    // Cota estourada (imagem grande demais): mantém em memória.
  }
  ouvintes.forEach((ouvir) => ouvir());
}

function subscrever(ouvir: () => void) {
  if (!hidratado) {
    hidratar();
    // Avisa depois da hidratação para não divergir do HTML do servidor.
    queueMicrotask(ouvir);
  }
  ouvintes.add(ouvir);
  return () => ouvintes.delete(ouvir);
}

const lerCliente = () => dados;
const lerServidor = () => SEED;

export function useDados(): Dados {
  return useSyncExternalStore(subscrever, lerCliente, lerServidor);
}

const id = () => Math.random().toString(36).slice(2, 10);

/* ---------- banners ---------- */

export function salvarBanner(banner: Banner) {
  const existe = dados.banners.some((b) => b.id === banner.id);
  // Todo banner ativo vira um slide do carrossel da hero, na ordem da lista.
  gravar({
    ...dados,
    banners: existe
      ? dados.banners.map((b) => (b.id === banner.id ? banner : b))
      : [...dados.banners, banner],
  });
}

export function removerBanner(bannerId: string) {
  gravar({ ...dados, banners: dados.banners.filter((b) => b.id !== bannerId) });
}

export function bannerVazio(): Banner {
  return {
    id: id(),
    eyebrow: "",
    titulo: "",
    destaque: "",
    subtitulo: "",
    ctaLabel: "Ver calendário",
    ctaHref: "/eventos",
    imagem: "",
    ativo: false,
  };
}

/* ---------- eventos ---------- */

export function salvarEvento(evento: Evento) {
  const existe = dados.eventos.some((e) => e.id === evento.id);
  gravar({
    ...dados,
    eventos: existe
      ? dados.eventos.map((e) => (e.id === evento.id ? evento : e))
      : [...dados.eventos, evento],
  });
}

export function removerEvento(eventoId: string) {
  gravar({
    ...dados,
    eventos: dados.eventos.filter((e) => e.id !== eventoId),
    inscricoes: dados.inscricoes.filter((i) => i.eventoId !== eventoId),
  });
}

export function eventoVazio(): Evento {
  return {
    id: id(),
    slug: "",
    nome: "",
    edicao: 1,
    modalidade: "rua",
    data: "",
    horario: "07h00",
    local: "",
    cidade: SEED.eventos[0].cidade,
    distancias: ["5 km"],
    preco: 0,
    vagas: 100,
    imagem: "",
    descricao: "",
    publicado: false,
  };
}

/* ---------- inscrições ---------- */

export function inscrever(inscricao: Omit<Inscricao, "id" | "criadaEm">) {
  gravar({
    ...dados,
    inscricoes: [
      ...dados.inscricoes,
      { ...inscricao, id: id(), criadaEm: new Date().toISOString() },
    ],
  });
}

export function removerInscricao(inscricaoId: string) {
  gravar({
    ...dados,
    inscricoes: dados.inscricoes.filter((i) => i.id !== inscricaoId),
  });
}

/* ---------- sessão do admin ---------- */

export function entrar(senha: string) {
  if (senha !== SENHA) return false;
  sessionStorage.setItem(CHAVE_SESSAO, "1");
  ouvintes.forEach((ouvir) => ouvir());
  return true;
}

export function sair() {
  sessionStorage.removeItem(CHAVE_SESSAO);
  ouvintes.forEach((ouvir) => ouvir());
}

function lerSessao() {
  try {
    return sessionStorage.getItem(CHAVE_SESSAO) === "1";
  } catch {
    return false;
  }
}

export function useAutenticado(): boolean {
  return useSyncExternalStore(subscrever, lerSessao, () => false);
}
