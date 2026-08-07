import type { Evento, Inscricao } from "./types";

export const cn = (...partes: Array<string | false | null | undefined>) =>
  partes.filter(Boolean).join(" ");

const diaLongo = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const diaCurto = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
});

const mesAno = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const dataLonga = (iso: string) => diaLongo.format(new Date(iso));
export const dataCurta = (iso: string) =>
  diaCurto.format(new Date(iso)).replace(".", "");
export const ano = (iso: string) => iso.slice(0, 4);
export const preco = (valor: number) => moeda.format(valor);
/** "2026-09" → "setembro de 2026". */
export const mesLongo = (mes: string) => mesAno.format(new Date(`${mes}-01`));

export const ehFuturo = (evento: Evento) => evento.data >= hoje();

/** Data de hoje em ISO curto, para comparar com `Evento.data` sem fuso. */
export function hoje() {
  return new Date().toISOString().slice(0, 10);
}

/** Anda `passos` meses a partir de um "AAAA-MM" e devolve outro "AAAA-MM". */
export function mesVizinho(mes: string, passos: number) {
  const [a, m] = mes.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1 + passos, 1)).toISOString().slice(0, 7);
}

/**
 * Semanas de um mês para a grade do calendário: cada linha tem 7 posições,
 * de domingo a sábado, com a data ISO do dia ou `null` no vazio das pontas.
 */
export function semanasDoMes(mes: string) {
  const [a, m] = mes.split("-").map(Number);
  const vazioInicial = new Date(Date.UTC(a, m - 1, 1)).getUTCDay();
  const dias = new Date(Date.UTC(a, m, 0)).getUTCDate();

  const celulas: Array<string | null> = Array.from(
    { length: Math.ceil((vazioInicial + dias) / 7) * 7 },
    (_, i) => {
      const dia = i - vazioInicial + 1;
      return dia < 1 || dia > dias
        ? null
        : `${mes}-${String(dia).padStart(2, "0")}`;
    },
  );

  return Array.from({ length: celulas.length / 7 }, (_, i) =>
    celulas.slice(i * 7, i * 7 + 7),
  );
}

export function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function idade(nascimento: string, referencia: string) {
  if (!nascimento) return "";
  const anos = Number(ano(referencia)) - Number(ano(nascimento));
  return referencia.slice(5) >= nascimento.slice(5) ? anos : anos - 1;
}

const COLUNAS = [
  "Nome",
  "E-mail",
  "CPF",
  "Telefone",
  "Nascimento",
  "Idade na prova",
  "Sexo",
  "Distância",
  "Camiseta",
  "Equipe",
  "Inscrito em",
] as const;

/**
 * Planilha dos participantes. CSV com `;` e BOM abre direto no Excel pt-BR —
 * ponytail: nada de biblioteca de xlsx até alguém precisar de abas ou fórmula.
 */
export function planilhaCsv(evento: Evento, inscricoes: Inscricao[]) {
  const escapar = (valor: string | number) =>
    `"${String(valor).replace(/"/g, '""')}"`;

  const linhas = inscricoes.map((i) =>
    [
      i.nome,
      i.email,
      i.cpf ?? "",
      i.telefone,
      i.nascimento,
      idade(i.nascimento, evento.data),
      i.sexo,
      i.distancia,
      i.camiseta,
      i.equipe,
      new Date(i.criadaEm).toLocaleString("pt-BR"),
    ]
      .map(escapar)
      .join(";"),
  );

  return "﻿" + [COLUNAS.join(";"), ...linhas].join("\r\n");
}

export function baixarPlanilha(evento: Evento, inscricoes: Inscricao[]) {
  const csv = planilhaCsv(evento, inscricoes);
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `participantes-${evento.slug}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Reduz a imagem antes de guardar: sem backend, ela vira data URL no
 * localStorage, que tem uns 5 MB no total.
 */
export function lerImagem(arquivo: File, larguraMax = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    img.onload = () => {
      const escala = Math.min(1, larguraMax / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas indisponível."));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.src = URL.createObjectURL(arquivo);
  });
}
