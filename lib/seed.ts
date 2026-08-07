import type { Dados } from "./types";

/** ponytail: troque pela cidade real da organização — só aparece em texto. */
export const CIDADE = "Santo Aleixo";

export const CONTATO = {
  email: "contato@passosverdes.com.br",
  telefone: "+55 15 99999-0000",
  instagram: "@passosverdes",
};

/**
 * Estado inicial da aplicação. Sem backend por enquanto: o admin grava por cima
 * disso no localStorage (ver `lib/store.ts`).
 */
export const SEED: Dados = {
  banners: [
    {
      id: "b1",
      eyebrow: "Domingo, 11 de outubro",
      titulo: "Corrida Kids",
      destaque: "Minecraft",
      subtitulo:
        "Percursos de 200 m a 1 km para crianças de 4 a 12 anos, com largada, pódio e medalha em bloco.",
      ctaLabel: "Inscrever a criançada",
      ctaHref: "/eventos/corrida-kids-minecraft-2026",
      imagem: "/imagens/eventos/kids-minecraft-2.jpg",
      ativo: true,
    },
    {
      id: "b2",
      eyebrow: "Domingo, 18 de outubro",
      titulo: "2ª Corrida",
      destaque: "Garytos",
      subtitulo:
        "5 km e 10 km com cronometragem por chip na Avenida Beira-Rio. Correr é uma festa.",
      ctaLabel: "Garantir minha vaga",
      ctaHref: "/eventos/corrida-garytos-2026",
      imagem: "/imagens/eventos/garytos-2.jpg",
      ativo: true,
    },
    {
      id: "b3",
      eyebrow: "Temporada 2026 · 4 provas",
      titulo: "A cidade corre",
      destaque: "com a gente",
      subtitulo:
        "Corridas de rua, provas kids e percursos que atravessam " +
        CIDADE +
        ". Escolha a sua distância.",
      ctaLabel: "Ver calendário",
      ctaHref: "/eventos",
      imagem: "/imagens/fotos/obrigado.jpg",
      ativo: true,
    },
  ],
  /**
   * Provas reais da temporada 2026 (datas e nomes conforme os cards do
   * Instagram). ponytail: preço, vagas e distâncias ainda são estimativa —
   * ajustar no /admin quando o regulamento sair.
   */
  eventos: [
    {
      id: "e1",
      slug: "corrida-passos-verdes-2026",
      nome: "Corrida Passos Verdes",
      edicao: 1,
      modalidade: "rua",
      data: "2026-04-12",
      horario: "07h00",
      local: "Andorinhas",
      cidade: CIDADE,
      distancias: ["5 km", "10 km"],
      preco: 80,
      vagas: 800,
      imagem: "/imagens/eventos/passos-verdes-1-ano.jpg",
      descricao:
        "A corrida de um ano da Passos Verdes. Largada em Andorinhas, percurso pela cidade e festa na chegada com todo mundo que fez o projeto acontecer.",
      publicado: true,
    },
    {
      id: "e2",
      slug: "corrida-santo-aleixo-2026",
      nome: "Corrida de Santo Aleixo",
      edicao: 2,
      modalidade: "rua",
      data: "2026-07-18",
      horario: "10h00",
      local: "Praça de Andorinhas até a Capela",
      cidade: CIDADE,
      distancias: ["7 km"],
      preco: 90,
      vagas: 2500,
      imagem: "/imagens/eventos/santo-aleixo-2.jpg",
      descricao:
        "Segunda edição da prova que mais enche o calendário: 7 km com subidas, descidas e grandes retas, da praça de Andorinhas até a praça da Capela de Santo Aleixo.",
      publicado: true,
    },
    {
      id: "e3",
      slug: "corrida-kids-minecraft-2026",
      nome: "Corrida Kids — Minecraft",
      edicao: 2,
      modalidade: "kids",
      data: "2026-10-11",
      horario: "09h00",
      local: "Praça Central",
      cidade: CIDADE,
      distancias: ["200 m", "500 m", "1 km"],
      preco: 35,
      vagas: 400,
      imagem: "/imagens/eventos/kids-minecraft-2.jpg",
      descricao:
        "A Kids volta com tema de Minecraft: largada, percurso e pódio em bloco. Baterias por faixa etária dos 4 aos 12 anos, medalha para toda criança que cruzar a linha.",
      publicado: true,
    },
    {
      id: "e4",
      slug: "corrida-garytos-2026",
      nome: "Corrida Garytos",
      edicao: 2,
      modalidade: "rua",
      data: "2026-10-18",
      horario: "07h00",
      local: "Avenida Beira-Rio",
      cidade: CIDADE,
      distancias: ["5 km", "10 km"],
      preco: 100,
      vagas: 1500,
      imagem: "/imagens/eventos/garytos-2.jpg",
      descricao:
        "Segunda edição da Garytos, com cronometragem por chip, pórtico de chegada e a festa que virou marca da prova. Correr é uma festa.",
      publicado: true,
    },
  ],
  inscricoes: [
    {
      id: "i1",
      eventoId: "e4",
      nome: "Ana Rodrigues",
      email: "ana.rodrigues@exemplo.com",
      telefone: "15 98812-3344",
      nascimento: "1994-03-18",
      sexo: "F",
      distancia: "10 km",
      camiseta: "P",
      equipe: "Clube da Manhã",
      criadaEm: "2026-07-02T13:04:00.000Z",
    },
    {
      id: "i2",
      eventoId: "e4",
      nome: "Bruno Tavares",
      email: "bruno.tavares@exemplo.com",
      telefone: "15 99120-7788",
      nascimento: "1988-11-02",
      sexo: "M",
      distancia: "5 km",
      camiseta: "G",
      equipe: "",
      criadaEm: "2026-07-05T21:47:00.000Z",
    },
    {
      id: "i3",
      eventoId: "e4",
      nome: "Carla Menezes",
      email: "carla.menezes@exemplo.com",
      telefone: "15 99771-2210",
      nascimento: "2001-06-25",
      sexo: "F",
      distancia: "10 km",
      camiseta: "M",
      equipe: "Pace Livre",
      criadaEm: "2026-07-11T09:12:00.000Z",
    },
    {
      id: "i4",
      eventoId: "e3",
      nome: "Davi Prado",
      email: "familia.prado@exemplo.com",
      telefone: "15 98450-1199",
      nascimento: "2017-01-30",
      sexo: "M",
      distancia: "500 m",
      camiseta: "PP",
      equipe: "",
      criadaEm: "2026-07-19T16:20:00.000Z",
    },
    {
      id: "i5",
      eventoId: "e4",
      nome: "Eduarda Lima",
      email: "eduarda.lima@exemplo.com",
      telefone: "15 99333-0102",
      nascimento: "1979-09-09",
      sexo: "F",
      distancia: "10 km",
      camiseta: "M",
      equipe: "Beira-Rio Runners",
      criadaEm: "2026-07-24T11:55:00.000Z",
    },
  ],
};
