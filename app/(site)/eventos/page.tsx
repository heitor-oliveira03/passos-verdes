import type { Metadata } from "next";
import { Calendario } from "@/components/site/calendario";

export const metadata: Metadata = {
  title: "Eventos",
  description:
    "Calendário completo da Passos Verdes: próximas largadas com inscrição aberta e o histórico das provas já realizadas.",
};

export default function Eventos() {
  return (
    <>
      <section className="mx-auto max-w-350 px-5 pb-16 pt-20 sm:px-8 sm:pt-28">
        <p className="eyebrow text-verde">Calendário</p>
        <h1 className="display mt-6 max-w-4xl text-[13vw] leading-[0.84] sm:text-[8rem]">
          Todas as
          <br />
          largadas
        </h1>
        <p className="mt-10 max-w-lg text-lg text-musgo">
          Cada prova abre inscrição com dois meses de antecedência e fecha
          quando o lote acaba. Os percursos ficam publicados aqui até a semana
          da largada.
        </p>
      </section>

      <Calendario />
    </>
  );
}
