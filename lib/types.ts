export type Modalidade = "noturna" | "kids" | "rua" | "trail";

export const MODALIDADES: Record<Modalidade, string> = {
  noturna: "Noturna",
  kids: "Kids",
  rua: "Rua",
  trail: "Trail",
};

export type Banner = {
  id: string;
  eyebrow: string;
  titulo: string;
  destaque: string;
  subtitulo: string;
  ctaLabel: string;
  ctaHref: string;
  /** Foto de fundo do slide (data URL do admin). Vazio: fundo chapado. */
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
  /** Próximo número ainda não utilizado na sequência exclusiva da prova. */
  proximoNumeroPeito?: number;
};

export type Camiseta = "PP" | "P" | "M" | "G" | "GG";

export type Inscricao = {
  id: string;
  eventoId: string;
  nome: string;
  email: string;
  /** Opcional para manter compatibilidade com inscrições salvas antes do campo. */
  cpf?: string;
  telefone: string;
  nascimento: string;
  sexo: "F" | "M" | "Outro";
  distancia: string;
  camiseta: Camiseta;
  equipe: string;
  criadaEm: string;
  /** Número único e imutável dentro do evento. Opcional para dados legados. */
  numeroPeito?: number;
};

export type Dados = {
  banners: Banner[];
  eventos: Evento[];
  inscricoes: Inscricao[];
};
