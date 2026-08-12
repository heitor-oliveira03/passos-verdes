/**
 * Contrato da API. Espelha `lib/types.ts` do front de propósito, em vez de
 * importar de lá: o front é um pacote CommonJS resolvido pelo bundler do Next
 * e a API é ESM puro do Node. Cruzar os dois só pra economizar 60 linhas
 * custaria uma configuração de módulos frágil nos dois lados.
 *
 * Se mudar aqui, mude lá — os testes de rota são quem pega a divergência.
 */

export type Modalidade = "noturna" | "kids" | "rua" | "trail";
export type Camiseta = "PP" | "P" | "M" | "G" | "GG";
export type Sexo = "F" | "M" | "Outro";

export type Banner = {
  id: string;
  eyebrow: string;
  titulo: string;
  destaque: string;
  subtitulo: string;
  ctaLabel: string;
  ctaHref: string;
  imagem: string;
  ativo: boolean;
};

export type Evento = {
  id: string;
  slug: string;
  nome: string;
  edicao: number;
  modalidade: Modalidade;
  /** ISO date, ex.: 2026-09-12 */
  data: string;
  horario: string;
  local: string;
  cidade: string;
  distancias: string[];
  preco: number;
  vagas: number;
  imagem: string;
  descricao: string;
  publicado: boolean;
};

export type Inscricao = {
  id: string;
  eventoId: string;
  nome: string;
  email: string;
  cpf?: string;
  telefone: string;
  nascimento: string;
  sexo: Sexo;
  distancia: string;
  camiseta: Camiseta;
  equipe: string;
  criadaEm: string;
  /** Único e imutável dentro do evento; quem garante é a UNIQUE do schema. */
  numeroPeito: number;
};

/** O que o cliente manda para criar/atualizar — o id é do banco. */
export type EventoEntrada = Omit<Evento, "id">;
export type BannerEntrada = Omit<Banner, "id">;
export type InscricaoEntrada = Omit<
  Inscricao,
  "id" | "criadaEm" | "numeroPeito"
>;
