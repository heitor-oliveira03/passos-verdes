import Link from "next/link";
import type { Evento } from "@/lib/types";
import { MODALIDADES } from "@/lib/types";
import { ano, dataCurta } from "@/lib/utils";

/**
 * Provas como lista de largada, não como cards: a grade repete a leitura de
 * um boletim de prova — número de peito, nome, distância, horário.
 */
export function ListaEventos({
  eventos,
  passados = false,
}: {
  eventos: Evento[];
  passados?: boolean;
}) {
  if (eventos.length === 0) {
    return (
      <p className="border-t border-linha py-12 text-musgo">
        {passados
          ? "O histórico começa depois da primeira prova da temporada."
          : "Nenhuma prova aberta agora. O calendário da próxima temporada sai em breve."}
      </p>
    );
  }

  return (
    <ul>
      {eventos.map((evento) => (
        <li key={evento.id}>
          <Link
            href={`/eventos/${evento.slug}`}
            className="group grid grid-cols-[3.5rem_1fr] items-baseline gap-x-5 gap-y-2 border-t border-linha px-4 py-7 transition-colors hover:rounded-2xl hover:bg-cal sm:grid-cols-[4rem_1fr_13rem_10rem_1.5rem] sm:gap-x-8"
          >
            <span className="eyebrow self-start pt-1 text-verde tabular-nums">
              {String(evento.edicao).padStart(2, "0")}
            </span>

            <span className="min-w-0">
              <span className="display block text-2xl leading-none sm:text-3xl">
                {evento.nome}
              </span>
              <span className="mt-2 block text-sm text-musgo">
                {evento.local} · {MODALIDADES[evento.modalidade]}
              </span>
            </span>

            <span className="col-start-2 font-mono text-xs text-musgo sm:col-start-3">
              {evento.distancias.join(" / ")}
            </span>

            <span className="col-start-2 font-mono text-xs sm:col-start-4">
              {dataCurta(evento.data)} {ano(evento.data)}
              <span className="block text-musgo">{evento.horario}</span>
            </span>

            <span
              aria-hidden
              className="col-start-2 hidden text-musgo transition-transform group-hover:translate-x-1 group-hover:text-verde sm:col-start-5 sm:block sm:text-right"
            >
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
