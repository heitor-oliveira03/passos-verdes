"use client";

import Link from "next/link";
import { useDados } from "@/lib/store";
import { MODALIDADES } from "@/lib/types";
import { dataCurta, ano, ehFuturo } from "@/lib/utils";

export default function AdminEventos() {
  const { eventos, inscricoes } = useDados();
  const ordenados = [...eventos].sort((a, b) => b.data.localeCompare(a.data));

  return (
    <>
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="display text-4xl">Eventos</h1>
          <p className="mt-3 max-w-lg text-musgo">
            Cada evento guarda a própria lista de participantes, que pode ser
            baixada em planilha.
          </p>
        </div>
        <Link
          href="/admin/eventos/novo"
          className="eyebrow shrink-0 bg-tinta px-5 py-3.5 text-branco transition-colors hover:bg-verde"
        >
          Novo evento
        </Link>
      </div>

      <ul className="mt-10 border-t border-linha">
        {ordenados.map((evento) => (
          <li key={evento.id}>
            <Link
              href={`/admin/eventos/${evento.id}`}
              className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 border-b border-linha bg-branco px-5 py-5 transition-colors hover:bg-verde-claro"
            >
              <div className="min-w-0">
                <p className="display text-xl">
                  {evento.nome}{" "}
                  <span className="text-musgo">{evento.edicao}ª ed.</span>
                </p>
                <p className="mt-1 font-mono text-xs text-musgo">
                  {evento.data
                    ? `${dataCurta(evento.data)} ${ano(evento.data)}`
                    : "sem data"}{" "}
                  · {MODALIDADES[evento.modalidade]} ·{" "}
                  {inscricoes.filter((i) => i.eventoId === evento.id).length}{" "}
                  inscritos
                </p>
              </div>

              <span
                className={`eyebrow px-2 py-1 ${
                  !evento.publicado
                    ? "border border-linha text-musgo"
                    : ehFuturo(evento)
                      ? "bg-verde-claro text-verde"
                      : "border border-linha text-musgo"
                }`}
              >
                {!evento.publicado
                  ? "Rascunho"
                  : ehFuturo(evento)
                    ? "No ar"
                    : "Encerrado"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
