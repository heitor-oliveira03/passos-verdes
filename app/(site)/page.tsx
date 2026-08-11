import Link from "next/link";
import { Faixa } from "@/components/site/faixa";
import { Parceiros } from "@/components/site/parceiros";
import { Time } from "@/components/site/time";
import { Hero } from "@/components/hero/hero";
import { ProximosEventos } from "@/components/site/proximos-eventos";
import { Revelar } from "@/components/site/revelar";
import { CIDADE } from "@/lib/seed";

const NUMEROS = [
  { valor: "2025", rotulo: "Primeira largada" },
  { valor: "2,5 mil", rotulo: "Corredores inscritos" },
  { valor: "4", rotulo: "Provas por temporada" },
];

const MODALIDADES_HOME = [
  {
    nome: "Corrida de Santo Aleixo",
    texto:
      "Largada às 10:00, percurso balizado por luz verde e a cidade parada para ver. É a prova que mais enche.",
  },
  {
    nome: "Kids",
    texto:
      "Baterias de 200 m a 1 km, dos 4 aos 12 anos. Sem cronômetro, sem pódio: medalha para quem cruzar a linha.",
  },
  {
    nome: "Longão",
    texto:
      "De 5 km a 10 km no asfalto, com cronometragem por chip, pórtico de chegada e festa depois da linha.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-350 px-5 py-24 sm:px-8">
        <Revelar>
          <p className="eyebrow text-verde">Quem organiza</p>
          <h2 className="display mt-6 max-w-4xl text-5xl sm:text-7xl">
            A rua é o percurso.
            <br />O resto a gente monta.
          </h2>
          <p className="mt-8 max-w-xl text-lg text-musgo">
            A Passos Verdes começou em 2025 com o intuito de trazer saúde e e
            movimento para a comunidade de {CIDADE}. Nosso movimento ganhou
            força e hoje já movimentamos a cidade inteira com muita animação,
            amor, comprometimento com a saúde da comunidade e muita CORRIDA
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
          className="mt-20 grid gap-px overflow-hidden rounded-3xl bg-linha sm:grid-cols-3"
        >
          {NUMEROS.map((n) => (
            <div key={n.rotulo} className="bg-branco p-8">
              <p className="display text-6xl sm:text-7xl">{n.valor}</p>
              <p className="eyebrow mt-4 text-musgo">{n.rotulo}</p>
            </div>
          ))}
        </Revelar>
      </section>

      <ProximosEventos limite={3} />

      <section className="px-3 sm:px-5">
        <div className="mx-auto max-w-350 rounded-3xl bg-mata px-6 py-24 text-branco sm:rounded-4xl sm:px-12">
          <Revelar>
            <p className="eyebrow text-verde">Três jeitos de correr</p>
            <h2 className="display mt-6 max-w-3xl text-5xl sm:text-7xl">
              Correr com amigos
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

      <Time />

      <Parceiros />

      <section className="mx-auto max-w-350 px-5 pb-6 pt-24 sm:px-8">
        <Revelar>
          <p className="eyebrow text-verde">Depois da linha de chegada</p>
          <h2 className="display mt-6 max-w-3xl text-5xl sm:text-7xl">
            Nosso muito obrigado
          </h2>
          <p className="mt-8 max-w-xl text-lg text-musgo">
            Cada largada é feita por quem corre, por quem apoia na beira do
            percurso e por quem acorda cedo para montar tudo. Obrigado por
            fazerem a Passos Verdes acontecer.
          </p>
        </Revelar>
      </section>

      <Faixa
        src="/imagens/fotos/nosso-muito-obrigado.jpeg"
        alt="Turma da Passos Verdes reunida com medalhas e a bandeira do time depois da prova"
        className="bg-tinta object-contain"
      />

      <section className="mx-auto max-w-350 px-5 py-28 sm:px-8">
        <Revelar className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="display max-w-2xl text-5xl sm:text-7xl">
            Quer correr com a gente?
          </h2>
          <Link
            href="/contato"
            className="eyebrow inline-flex items-center gap-3 rounded-full bg-tinta px-7 py-4 text-branco transition-all hover:scale-[1.03] hover:bg-verde"
          >
            Fale com nosso time
            <span aria-hidden>→</span>
          </Link>
        </Revelar>
      </section>
    </>
  );
}
