import type { Metadata } from "next";
import Link from "next/link";
import { Faixa } from "@/components/site/faixa";
import { Revelar } from "@/components/site/revelar";
import { CIDADE } from "@/lib/seed";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "A Passos Verdes organiza corridas de rua, noturnas e provas kids desde 2019. Conheça como montamos cada largada.",
};

/** A cronologia é uma sequência de verdade — por isso ela é numerada por ano. */
const LINHA_DO_TEMPO = [
  {
    ano: "2025",
    titulo: "A primeira corrida de Santo Aleixo",
    texto:
      "2,5k de corredores, 7 km, um percurso com subidas, descidas e grandes retas. A largada é na praça de Andorinhas e a linha de chegada é na praça da Capela.",
  },
  {
    ano: "2021",
    titulo: "Cronometragem por chip",
    texto:
      "Primeira prova com tempo oficial. Passamos a publicar o resultado completo no mesmo dia, incluindo quem terminou por último.",
  },
  {
    ano: "2023",
    titulo: "Nasce a Kids",
    texto:
      "Baterias por faixa etária no fim de semana da noturna. 287 crianças na primeira edição, todas com medalha.",
  },
  {
    ano: "2026",
    titulo: "Quatro provas por temporada",
    texto:
      "Noturna, Kids, Circuito Verde e a estreia do Trail da Serra. O calendário fechado com um ano de antecedência.",
  },
];

const PRINCIPIOS = [
  {
    titulo: "Percurso conferido a pé",
    texto:
      "Na véspera de cada prova a equipe caminha o trajeto inteiro conferindo sinalização, buraco e ponto de hidratação.",
  },
  {
    titulo: "Preço que cabe",
    texto:
      "A inscrição paga a estrutura, não a margem. Provas kids custam menos que um cinema para dois.",
  },
  {
    titulo: "A cidade volta ao normal",
    texto:
      "Desmontagem e limpeza terminam antes do meio-dia seguinte. Quem não correu não deveria perceber que teve prova.",
  },
];

export default function Sobre() {
  return (
    <>
      <section className="mx-auto max-w-350 px-5 pb-20 pt-20 sm:px-8 sm:pt-28">
        <p className="eyebrow text-verde">Sobre nós</p>
        <h1 className="display mt-6 max-w-5xl text-[13vw] leading-[0.84] sm:text-[8rem]">
          Sete anos
          <br />
          montando largada
        </h1>
        <p className="mt-10 max-w-xl text-lg text-musgo">
          Somos uma organização de corrida de rua de {CIDADE}. Fazemos poucas
          provas por ano e cuidamos de cada uma como se fosse a única: percurso,
          sinalização, hidratação, cronometragem e a fila do guarda-volumes.
        </p>
      </section>

      <section className="px-3 sm:px-5">
        <div className="mx-auto max-w-350 rounded-3xl bg-cal px-6 py-24 sm:rounded-4xl sm:px-12">
          <p className="eyebrow text-musgo">Linha do tempo</p>
          <Revelar seletor="li" className="mt-10">
            <ol>
              {LINHA_DO_TEMPO.map((item) => (
                <li
                  key={item.ano}
                  className="grid gap-x-8 gap-y-3 border-t border-linha py-8 sm:grid-cols-[6rem_1fr_1fr]"
                >
                  <span className="eyebrow pt-1 text-verde">{item.ano}</span>
                  <h2 className="display text-2xl sm:text-3xl">
                    {item.titulo}
                  </h2>
                  <p className="text-musgo">{item.texto}</p>
                </li>
              ))}
            </ol>
          </Revelar>
        </div>
      </section>

      <Faixa
        src="/imagens/fotos/corredora.jpg"
        alt="Corredora em prova de rua"
      />

      <section className="mx-auto max-w-350 px-5 py-24 sm:px-8">
        <h2 className="display max-w-3xl text-5xl sm:text-7xl">
          Como a gente trabalha
        </h2>
        <Revelar seletor="div" className="mt-14 grid gap-12 sm:grid-cols-3">
          {PRINCIPIOS.map((p) => (
            <div key={p.titulo} className="border-t border-linha pt-6">
              <h3 className="display text-2xl">{p.titulo}</h3>
              <p className="mt-4 text-musgo">{p.texto}</p>
            </div>
          ))}
        </Revelar>

        <Link
          href="/eventos"
          className="eyebrow mt-16 inline-flex items-center gap-3 rounded-full bg-tinta px-7 py-4 text-branco transition-all hover:scale-[1.03] hover:bg-verde"
        >
          Ver o calendário
          <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
