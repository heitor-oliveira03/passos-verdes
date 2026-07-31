"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormularioInscricao } from "@/components/site/formulario-inscricao";
import { ImagemEvento } from "@/components/site/imagem-evento";
import { useDados } from "@/lib/store";
import { MODALIDADES } from "@/lib/types";
import { dataLonga, ehFuturo, preco } from "@/lib/utils";

export default function PaginaDoEvento() {
  const { slug } = useParams<{ slug: string }>();
  const { eventos, inscricoes } = useDados();
  const evento = eventos.find((e) => e.slug === slug && e.publicado);

  if (!evento) {
    return (
      <section className="mx-auto max-w-350 px-5 py-32 sm:px-8">
        <p className="eyebrow text-verde">Prova não encontrada</p>
        <h1 className="display mt-6 text-5xl sm:text-7xl">
          Esse endereço não
          <br />
          leva a uma largada
        </h1>
        <Link
          href="/eventos"
          className="eyebrow mt-10 inline-block underline underline-offset-4 hover:text-verde"
        >
          Ver o calendário
        </Link>
      </section>
    );
  }

  const inscritos = inscricoes.filter((i) => i.eventoId === evento.id).length;
  const restantes = Math.max(0, evento.vagas - inscritos);
  const aberto = ehFuturo(evento) && restantes > 0;

  const ficha = [
    { rotulo: "Data", valor: dataLonga(evento.data) },
    { rotulo: "Largada", valor: evento.horario },
    { rotulo: "Local", valor: `${evento.local}, ${evento.cidade}` },
    { rotulo: "Distâncias", valor: evento.distancias.join(" / ") },
    { rotulo: "Inscrição", valor: preco(evento.preco) },
    {
      rotulo: "Vagas",
      valor: ehFuturo(evento)
        ? `${restantes} de ${evento.vagas}`
        : `${inscritos} inscritos`,
    },
  ];

  return (
    <>
      <section className="@container mx-auto max-w-350 px-5 pb-14 pt-16 sm:px-8 sm:pt-20">
        <Link href="/eventos" className="eyebrow text-musgo hover:text-verde">
          ← Calendário
        </Link>

        <p className="eyebrow mt-10 text-verde">
          {MODALIDADES[evento.modalidade]} · {evento.edicao}ª edição
        </p>
        <h1 className="display mt-5 max-w-5xl text-[12cqw] leading-[0.84] sm:text-[8rem]">
          {evento.nome}
        </h1>
      </section>

      <div className="mx-auto max-w-350 px-5 sm:px-8">
        <div className="aspect-16/7 w-full overflow-hidden rounded-3xl bg-cal">
          <ImagemEvento evento={evento} />
        </div>
      </div>

      <section className="mx-auto max-w-350 px-5 py-20 sm:px-8">
        <dl className="grid gap-px border-t border-linha bg-linha sm:grid-cols-3">
          {ficha.map((item) => (
            <div key={item.rotulo} className="bg-branco py-6 pr-6">
              <dt className="eyebrow text-musgo">{item.rotulo}</dt>
              <dd className="mt-3 font-mono text-sm">{item.valor}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-16 max-w-2xl text-lg text-musgo">{evento.descricao}</p>
      </section>

      <section id="inscricao" className="mx-3 rounded-3xl bg-cal sm:mx-5 sm:rounded-4xl">
        <div className="mx-auto grid max-w-350 gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow text-verde">
              {aberto ? "Inscrições abertas" : "Inscrições encerradas"}
            </p>
            <h2 className="display mt-6 text-5xl sm:text-6xl">
              {aberto ? "Garanta seu número de peito" : "Essa prova já correu"}
            </h2>
            <p className="mt-6 max-w-md text-musgo">
              {aberto
                ? `Restam ${restantes} vagas. A inscrição inclui camiseta, chip de cronometragem, hidratação no percurso e medalha na chegada.`
                : "Acompanhe o calendário para não perder a próxima edição — as inscrições abrem dois meses antes da largada."}
            </p>
          </div>

          {aberto ? (
            <FormularioInscricao evento={evento} />
          ) : (
            <div className="self-start rounded-3xl border border-linha bg-branco p-8 shadow-sm">
              <p className="eyebrow text-musgo">Próximas provas</p>
              <Link
                href="/eventos"
                className="display mt-4 block text-3xl hover:text-verde"
              >
                Ver calendário →
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
