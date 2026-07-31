import type { Metadata } from "next";
import { FormularioContato } from "@/components/site/formulario-contato";
import { CIDADE, CONTATO } from "@/lib/seed";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a organização da Passos Verdes sobre inscrição, patrocínio, imprensa ou voluntariado.",
};

const somenteDigitos = CONTATO.telefone.replace(/\D/g, "");

/** Canais na mesma gramática da lista de provas: rótulo, valor e seta. */
const CANAIS = [
  { rotulo: "E-mail", valor: CONTATO.email, href: `mailto:${CONTATO.email}` },
  {
    rotulo: "Telefone e WhatsApp",
    valor: CONTATO.telefone,
    href: `https://wa.me/${somenteDigitos}`,
  },
  {
    rotulo: "Instagram",
    valor: CONTATO.instagram,
    href: `https://instagram.com/${CONTATO.instagram.replace("@", "")}`,
  },
];

export default function Contato() {
  return (
    <>
      <section className="@container mx-auto max-w-350 px-5 pb-14 pt-20 sm:px-8 sm:pt-28">
        <p className="eyebrow text-verde">Contato</p>
        <h1 className="display mt-6 max-w-4xl text-[12cqw] leading-[0.84] sm:text-[8rem]">
          Fale com
          <br />a gente
        </h1>
      </section>

      <section className="mx-auto grid max-w-350 items-start gap-10 px-3 pb-28 sm:px-5 lg:grid-cols-5">
        <div className="px-3 sm:px-4 lg:col-span-2">
          <p className="max-w-sm text-lg text-musgo">
            Respondemos em até dois dias úteis. Na semana de prova, o retorno é
            no mesmo dia.
          </p>

          <ul className="mt-10">
            {CANAIS.map((canal) => (
              <li key={canal.rotulo}>
                <a
                  href={canal.href}
                  className="group flex items-baseline justify-between gap-6 border-t border-linha py-6 transition-colors hover:text-verde"
                >
                  <span>
                    <span className="eyebrow block text-musgo">
                      {canal.rotulo}
                    </span>
                    <span className="mt-2 block font-mono text-sm">
                      {canal.valor}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="text-musgo transition-transform group-hover:translate-x-1 group-hover:text-verde"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
            <li className="border-t border-linha py-6">
              <span className="eyebrow block text-musgo">Base</span>
              <span className="mt-2 block font-mono text-sm">{CIDADE}</span>
            </li>
          </ul>
        </div>

        <div className="overflow-hidden rounded-3xl bg-cal sm:rounded-4xl lg:col-span-3">
          <p className="eyebrow flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-linha px-6 py-4 text-musgo sm:px-10">
            Formulário
            <span className="text-verde">Resposta em até 2 dias úteis</span>
          </p>
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <FormularioContato />
          </div>
        </div>
      </section>
    </>
  );
}
