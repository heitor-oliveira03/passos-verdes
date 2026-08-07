"use client";

import Link from "next/link";
import { useState } from "react";
import { Seta } from "@/components/ui/seta";
import { useDados } from "@/lib/store";
import type { Evento } from "@/lib/types";
import { MODALIDADES } from "@/lib/types";
import { cn, hoje, mesLongo, mesVizinho, semanasDoMes } from "@/lib/utils";

const SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

/**
 * O mês em grade. O dia com prova não ganha um pontinho: ele vira o número de
 * peito da largada — mesma edição em mono que abre a linha da lista abaixo.
 * Verde é prova aberta, verde apagado é prova já corrida.
 */
export function GradeMensal() {
  const { eventos } = useDados();
  const publicados = eventos.filter((e) => e.publicado);
  const [mes, setMes] = useState(() => mesInicial(publicados));

  // ponytail: uma prova por dia. Duas largadas no mesmo dia é problema do dia
  // em que a agenda encavalar — aí vira uma célula com contador.
  const porDia = new Map(publicados.map((e) => [e.data, e]));
  const doMes = publicados.filter((e) => e.data.startsWith(mes));

  return (
    <section
      id="calendario"
      className="mx-auto max-w-350 px-5 pb-24 pt-4 sm:px-8"
    >
      <div className="rounded-3xl bg-cal p-5 sm:rounded-4xl sm:p-10">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-verde">
              {doMes.length
                ? `${doMes.length} ${doMes.length === 1 ? "largada" : "largadas"} no mês`
                : "Mês sem largada"}
            </p>
            <h2 className="display mt-4 text-4xl sm:text-6xl">
              {mesLongo(mes)}
            </h2>
          </div>

          <div className="flex gap-2">
            <BotaoMes para="esquerda" mes={mes} onMes={setMes} />
            <BotaoMes para="direita" mes={mes} onMes={setMes} />
          </div>
        </header>

        <table className="mt-10 w-full table-fixed border-separate border-spacing-1">
          <caption className="sr-only">
            Calendário de {mesLongo(mes)}. Os dias com prova levam à página da
            largada.
          </caption>
          <thead>
            <tr>
              {SEMANA.map((dia) => (
                <th
                  key={dia}
                  scope="col"
                  className="eyebrow pb-3 text-musgo font-normal"
                >
                  <span className="sm:hidden">{dia.slice(0, 1)}</span>
                  <span className="hidden sm:inline">{dia}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {semanasDoMes(mes).map((semana) => (
              <tr key={semana.find(Boolean)}>
                {semana.map((data, i) => (
                  <td key={data ?? i} className="h-16 p-0 sm:h-28">
                    {data && (
                      <Dia data={data} evento={porDia.get(data)} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BotaoMes({
  para,
  mes,
  onMes,
}: {
  para: "esquerda" | "direita";
  mes: string;
  onMes: (mes: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onMes(mesVizinho(mes, para === "esquerda" ? -1 : 1))}
      aria-label={`${para === "esquerda" ? "Mês anterior" : "Próximo mês"}, a partir de ${mesLongo(mes)}`}
      className="grid size-11 place-items-center rounded-full border border-linha text-lg text-tinta transition-colors hover:border-verde hover:bg-verde hover:text-branco"
    >
      <Seta para={para} />
    </button>
  );
}

function Dia({ data, evento }: { data: string; evento?: Evento }) {
  const dia = Number(data.slice(8));
  const numero = <span className="font-mono text-xs tabular-nums">{dia}</span>;

  if (!evento) {
    return (
      <div
        className={cn(
          "flex size-full items-start justify-end rounded-xl p-2 text-musgo sm:rounded-2xl sm:p-3",
          data === hoje() && "bg-branco text-verde ring-1 ring-verde",
        )}
      >
        {numero}
      </div>
    );
  }

  const futuro = data >= hoje();

  return (
    <Link
      href={`/eventos/${evento.slug}`}
      className={cn(
        "flex size-full flex-col justify-between rounded-xl p-2 transition-transform hover:-translate-y-0.5 sm:rounded-2xl sm:p-3",
        futuro
          ? "bg-verde text-branco hover:bg-mata"
          : "bg-verde-claro/60 text-mata hover:bg-verde-claro",
      )}
    >
      <span className="flex items-start justify-between gap-1">
        <span className="eyebrow tabular-nums opacity-70">
          {String(evento.edicao).padStart(2, "0")}
        </span>
        {numero}
      </span>

      <span className="hidden text-left leading-tight sm:block">
        <span className="display line-clamp-2 block text-sm">{evento.nome}</span>
        <span className="mt-1 block font-mono text-[0.6875rem] opacity-70">
          {futuro ? evento.horario : "realizada"} ·{" "}
          {MODALIDADES[evento.modalidade]}
        </span>
      </span>

      <span className="size-1.5 rounded-full bg-current sm:hidden" />
    </Link>
  );
}

/** Abre no mês da próxima largada — o mês em branco não ajuda ninguém. */
function mesInicial(eventos: Evento[]) {
  const proxima = eventos
    .map((e) => e.data)
    .sort()
    .find((data) => data >= hoje());
  return (proxima ?? hoje()).slice(0, 7);
}
