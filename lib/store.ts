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
const CHAVE = "passos-verdes/dados/v3";

/**
 * Migra inscrições anteriores à numeração de peito. A ordem de cadastro é a
 * política usada por plataformas de prova; números existentes nunca mudam.
 */
function normalizarNumerosDePeito(origem: Dados): Dados {
  const inscricoes = origem.inscricoes.map((inscricao) => ({ ...inscricao }));
  const eventos = origem.eventos.map((evento) => {
    const participantes = inscricoes
      .filter((inscricao) => inscricao.eventoId === evento.id)
      .sort((a, b) =>
        a.criadaEm.localeCompare(b.criadaEm) || a.id.localeCompare(b.id),
      );
    const utilizados = new Set(
      participantes
        .map((inscricao) => inscricao.numeroPeito)
        .filter(
          (numero): numero is number =>
            typeof numero === "number" && Number.isInteger(numero) && numero > 0,
        ),
    );
    let proximo = 1;

    for (const participante of participantes) {
      if (!participante.numeroPeito || participante.numeroPeito < 1) {
        while (utilizados.has(proximo)) proximo += 1;
        participante.numeroPeito = proximo;
        utilizados.add(proximo);
      }
      proximo = Math.max(proximo, participante.numeroPeito + 1);
    }

    return {
      ...evento,
      proximoNumeroPeito: Math.max(evento.proximoNumeroPeito ?? 1, proximo),
    };
  });

  return { ...origem, eventos, inscricoes };
}

const DADOS_INICIAIS = normalizarNumerosDePeito(SEED);
let dados: Dados = DADOS_INICIAIS;
let hidratado = false;
const ouvintes = new Set<() => void>();

function hidratar() {
  if (hidratado) return;
  hidratado = true;
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (bruto) dados = normalizarNumerosDePeito(JSON.parse(bruto) as Dados);
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
  conferirSessao();
  if (!hidratado) {
    hidratar();
    // Avisa depois da hidratação para não divergir do HTML do servidor.
    queueMicrotask(ouvir);
  }
  ouvintes.add(ouvir);
  return () => ouvintes.delete(ouvir);
}

const lerCliente = () => dados;
const lerServidor = () => DADOS_INICIAIS;

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

export function inscrever(
  inscricao: Omit<Inscricao, "id" | "criadaEm" | "numeroPeito">,
) {
  const evento = dados.eventos.find((item) => item.id === inscricao.eventoId);
  const maiorExistente = dados.inscricoes
    .filter((item) => item.eventoId === inscricao.eventoId)
    .reduce((maior, item) => Math.max(maior, item.numeroPeito ?? 0), 0);
  const numeroPeito = Math.max(evento?.proximoNumeroPeito ?? 1, maiorExistente + 1);
  const novaInscricao: Inscricao = {
    ...inscricao,
    id: id(),
    criadaEm: new Date().toISOString(),
    numeroPeito,
  };

  gravar({
    ...dados,
    eventos: dados.eventos.map((item) =>
      item.id === inscricao.eventoId
        ? { ...item, proximoNumeroPeito: numeroPeito + 1 }
        : item,
    ),
    inscricoes: [...dados.inscricoes, novaInscricao],
  });
  return novaInscricao;
}

export function removerInscricao(inscricaoId: string) {
  gravar({
    ...dados,
    inscricoes: dados.inscricoes.filter((i) => i.id !== inscricaoId),
  });
}

/* ---------- sessão do admin ---------- */

/**
 * Quem manda na sessão agora é a API: o token vive num cookie httpOnly, que
 * este código não consegue ler. Aqui só guardamos a resposta do /api/sessao.
 */
let autenticado = false;
let sessaoConsultada = false;

function conferirSessao() {
  if (sessaoConsultada) return;
  sessaoConsultada = true;
  fetch("/api/sessao")
    .then((r) => r.json())
    .then((resposta: { autenticado: boolean }) => {
      autenticado = resposta.autenticado;
      ouvintes.forEach((ouvir) => ouvir());
    })
    .catch(() => {
      // API fora do ar: segue deslogado.
    });
}

export async function entrar(senha: string) {
  const resposta = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senha }),
  });
  autenticado = resposta.ok;
  ouvintes.forEach((ouvir) => ouvir());
  return resposta.ok;
}

export async function sair() {
  await fetch("/api/logout", { method: "POST" });
  autenticado = false;
  ouvintes.forEach((ouvir) => ouvir());
}

const lerSessao = () => autenticado;

export function useAutenticado(): boolean {
  return useSyncExternalStore(subscrever, lerSessao, () => false);
}
