import Link from "next/link";
import { Hero } from "@/components/hero/hero";
import { ProximosEventos } from "@/components/site/proximos-eventos";
import { Revelar } from "@/components/site/revelar";
import { CIDADE } from "@/lib/seed";

const NUMEROS = [
  { valor: "2019", rotulo: "Primeira largada" },
  { valor: "11,4 mil", rotulo: "Corredores inscritos" },
  { valor: "4", rotulo: "Provas por temporada" },
];

const MODALIDADES_HOME = [
  {
    nome: "Noturna",
    texto:
      "Largada às 19h30, percurso balizado por luz verde e a cidade parada para ver. É a prova que mais enche.",
  },
  {
    nome: "Kids",
    texto:
      "Baterias de 200 m a 1 km, dos 4 aos 12 anos. Sem cronômetro, sem pódio: medalha para quem cruzar a linha.",
  },
  {
    nome: "Rua e trail",
    texto:
      "De 5 km a 21 km no asfalto, mais uma prova de montanha por temporada. Cronometragem por chip nas duas.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
        <Revelar>
          <p className="eyebrow text-verde">Quem organiza</p>
          <h2 className="display mt-6 max-w-4xl text-5xl sm:text-7xl">
            A rua é o percurso.
            <br />O resto a gente monta.
          </h2>
          <p className="mt-8 max-w-xl text-lg text-musgo">
            A Passos Verdes começou em 2019 com uma noturna de 5 km e 140
            corredores. Hoje são quatro provas por temporada em {CIDADE}, com
            sinalização própria, cronometragem por chip e uma equipe que refaz o
            percurso a pé na véspera de cada largada.
          </p>
          <Link
            href="/sobre"
            className="eyebrow mt-8 inline-block underline underline-offset-4 hover:text-verde"
          >
            Nossa história
          </Link>
        </Revelar>

        <Revelar
          seletor="div"
          className="mt-20 grid gap-px border-t border-linha bg-linha sm:grid-cols-3"
        >
          {NUMEROS.map((n) => (
            <div key={n.rotulo} className="bg-branco pt-8">
              <p className="display text-6xl sm:text-7xl">{n.valor}</p>
              <p className="eyebrow mt-4 text-musgo">{n.rotulo}</p>
            </div>
          ))}
        </Revelar>
      </section>

      <ProximosEventos limite={3} />

      <section className="bg-mata text-branco">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
          <Revelar>
            <p className="eyebrow text-verde">Três jeitos de correr</p>
            <h2 className="display mt-6 max-w-3xl text-5xl sm:text-7xl">
              Correr no escuro
              <br />
              muda a cidade
            </h2>
          </Revelar>

          <Revelar seletor="div" className="mt-16 grid gap-12 sm:grid-cols-3">
            {MODALIDADES_HOME.map((m) => (
              <div key={m.nome} className="border-t border-white/20 pt-6">
                <h3 className="display text-3xl">{m.nome}</h3>
                <p className="mt-4 text-white/65">{m.texto}</p>
              </div>
            ))}
          </Revelar>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8">
        <Revelar className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="display max-w-2xl text-5xl sm:text-7xl">
            Quer correr com a gente?
          </h2>
          <Link
            href="/contato"
            className="eyebrow inline-flex items-center gap-3 bg-tinta px-6 py-4 text-branco transition-colors hover:bg-verde"
          >
            Falar com a organização
            <span aria-hidden>→</span>
          </Link>
        </Revelar>
      </section>
    </>
  );
}
