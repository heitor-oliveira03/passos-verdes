import type { Metadata } from "next";
import Link from "next/link";
import { Faixa } from "@/components/site/faixa";
import { Revelar } from "@/components/site/revelar";
import { CIDADE } from "@/lib/seed";

export const metadata: Metadata = {
  title: "Sobre nós",
  description:
    "A Passos Verdes nasceu em março de 2025, em Santo Aleixo, da paixão pela corrida e da vontade de criar comunidade. Treinos em grupo, corridas de rua e provas kids.",
};

/** A cronologia é uma sequência de verdade — por isso ela é numerada por ano. */
const LINHA_DO_TEMPO = [
  {
    ano: "mar 2025",
    titulo: "O projeto nasce",
    texto:
      "Da paixão pela corrida e da vontade de criar uma comunidade vibrante em Santo Aleixo. Primeiro os treinos em grupo, abertos a todo mundo — do iniciante ao corredor experiente.",
  },
  {
    ano: "2025",
    titulo: "A primeira Corrida de Santo Aleixo",
    texto:
      "2,5 mil corredores, 7 km, um percurso com subidas, descidas e grandes retas. Largada na praça de Andorinhas e chegada na praça da Capela.",
  },
  {
    ano: "2025",
    titulo: "Nasce a Kids",
    texto:
      "Baterias por faixa etária no fim de semana da prova principal. Todas as crianças com medalha na primeira edição.",
  },
  {
    ano: "abr 2026",
    titulo: "Um ano de Passos Verdes",
    texto:
      "A Corrida Passos Verdes fechou o primeiro ano do projeto com a turma inteira na linha de chegada.",
  },
  {
    ano: "2026",
    titulo: "Quatro provas na temporada",
    texto:
      "Corrida Passos Verdes, Santo Aleixo, Kids Minecraft e Garytos. O calendário do ano fechado de ponta a ponta.",
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
      <section className="@container mx-auto max-w-350 px-5 pb-20 pt-20 sm:px-8 sm:pt-28">
        <p className="eyebrow text-verde">Sobre nós</p>
        <h1 className="display mt-6 max-w-5xl text-[12cqw] leading-[0.84] sm:text-[8rem]">
          Um ano{" "}
          {/* No celular a linha quebra sozinha: forçar o corte estoura a tela. */}
          <br className="hidden sm:inline" />
          montando largada
        </h1>
        <div className="mt-10 grid max-w-3xl gap-6 text-lg text-musgo sm:grid-cols-2">
          <p>
            A Passos Verdes nasceu da paixão pela corrida e do desejo de criar
            uma comunidade vibrante em {CIDADE}. Para nós correr vai além do
            exercício: é uma forma de conectar pessoas, explorar a beleza do
            nosso Paraíso Verde e promover um estilo de vida mais saudável e
            feliz.
          </p>
          <p>
            As atividades são abertas a todos, do iniciante ao corredor
            experiente — treinos em grupo, eventos especiais e novos percursos
            pelas ruas e trilhas da região. Junte-se a nós e vamos transformar{" "}
            {CIDADE} em um palco de superação, amizade e bem-estar.
          </p>
        </div>
      </section>

      <section className="px-3 sm:px-5">
        <div className="mx-auto max-w-350 rounded-3xl bg-cal px-6 py-24 sm:rounded-4xl sm:px-12">
          <p className="eyebrow text-musgo">Linha do tempo</p>
          <Revelar seletor="li" className="mt-10">
            <ol>
              {LINHA_DO_TEMPO.map((item) => (
                <li
                  key={item.titulo}
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
