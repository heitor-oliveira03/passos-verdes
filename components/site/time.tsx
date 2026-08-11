import Image from "next/image";

const TIME = [
  { nome: "Theo Gouveia", cargo: "Criador · Estratégia", foto: "/imagens/time/theo-gouveia.jpeg", texto: "Corredor e apaixonado por transformar movimento em comunidade. Theo acompanha as ideias desde o primeiro rascunho e conecta propósito, experiência e cada detalhe que acontece antes da largada." },
  { nome: "Stefany Magalhães", cargo: "Criadora · Comunidade", foto: "/imagens/time/stefany-magalhaes.jpeg", texto: "Maratonista e ponte entre a equipe e quem corre com a gente. Stefany ajuda a construir uma experiência acolhedora, próxima e organizada para atletas de todos os ritmos." },
  { nome: "Guilherme", cargo: "Criador · Operações", foto: "/imagens/time/guilherme.jpeg", texto: "Da planilha ao pórtico, Guilherme transforma planejamento em prova entregue. Atua na organização das frentes operacionais e mantém cada etapa caminhando no ritmo certo." },
  { nome: "Thiago Souza", cargo: "Criador · Percurso", foto: "/imagens/time/thiago-souza.jpeg", texto: "Conhece a corrida por dentro e leva esse olhar para a rua. Thiago participa da definição dos percursos, da experiência esportiva e dos cuidados que fazem cada quilômetro funcionar." },
];

export function Time() {
  return (
    <section id="time" className="scroll-mt-20 px-3 py-20 sm:px-5 sm:py-28">
      <div className="relative mx-auto max-w-350 overflow-hidden rounded-3xl bg-mata px-6 py-16 text-branco sm:rounded-4xl sm:px-12 sm:py-24">
        <div aria-hidden className="absolute -right-28 -top-28 size-96 rounded-full border-[64px] border-verde/10" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_.72fr] lg:items-end">
          <div><p className="eyebrow text-verde">Quem faz acontecer</p><h2 className="display mt-5 max-w-3xl text-4xl sm:text-6xl lg:text-7xl">Quatro histórias. <span className="text-verde">Uma só largada.</span></h2></div>
          <p className="max-w-xl text-base leading-7 text-white/60 lg:pb-1">A Passos Verdes nasceu do encontro entre pessoas que acreditam que correr pode aproximar uma cidade inteira. Estratégia, comunidade, operação e percurso trabalham juntos em cada prova.</p>
        </div>
        <div className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TIME.map((pessoa, indice) => (
            <article key={pessoa.nome} className={`group ${indice % 2 ? "lg:mt-12" : ""}`}>
              <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-tinta">
                <Image src={pessoa.foto} alt={`${pessoa.nome} correndo`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover grayscale-[20%] transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-tinta via-transparent to-transparent opacity-75" />
                <span className="eyebrow absolute left-4 top-4 rounded-full bg-tinta/70 px-3 py-2 text-verde backdrop-blur">0{indice + 1}</span>
                <div className="absolute inset-x-0 bottom-0 p-5"><p className="eyebrow text-verde">{pessoa.cargo}</p><h3 className="display mt-3 text-2xl text-white">{pessoa.nome}</h3></div>
              </div>
              <p className="mt-5 text-sm leading-6 text-white/55">{pessoa.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
