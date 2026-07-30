"use client";

import { ListaEventos } from "./lista-eventos";
import { Revelar } from "./revelar";
import { useDados } from "@/lib/store";
import { ehFuturo } from "@/lib/utils";

export function Calendario() {
  const { eventos } = useDados();
  const publicados = eventos.filter((e) => e.publicado);

  const proximos = publicados
    .filter(ehFuturo)
    .sort((a, b) => a.data.localeCompare(b.data));
  const passados = publicados
    .filter((e) => !ehFuturo(e))
    .sort((a, b) => b.data.localeCompare(a.data));

  return (
    <>
      <section
        id="proximos"
        className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8"
      >
        <p className="eyebrow text-verde">
          Próximos eventos · {proximos.length}
        </p>
        <Revelar seletor="li" className="mt-8">
          <ListaEventos eventos={proximos} />
        </Revelar>
      </section>

      <section id="passados" className="bg-cal">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8">
          <p className="eyebrow text-musgo">
            Eventos passados · {passados.length}
          </p>
          <h2 className="display mt-6 text-5xl sm:text-6xl">O que já rolou</h2>
          <Revelar seletor="li" className="mt-10">
            <ListaEventos eventos={passados} passados />
          </Revelar>
        </div>
      </section>
    </>
  );
}
