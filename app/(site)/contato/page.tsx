import type { Metadata } from "next";
import { FormularioContato } from "@/components/site/formulario-contato";
import { CIDADE, CONTATO } from "@/lib/seed";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a organização da Passos Verdes sobre inscrição, patrocínio, imprensa ou voluntariado.",
};

export default function Contato() {
  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pb-14 pt-20 sm:px-8 sm:pt-28">
        <p className="eyebrow text-verde">Contato</p>
        <h1 className="display mt-6 max-w-4xl text-[13vw] leading-[0.84] sm:text-[8rem]">
          Fale com
          <br />a gente
        </h1>
      </section>

      <section className="mx-auto grid max-w-[1400px] gap-16 px-5 pb-28 sm:px-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="border-t border-linha pt-8">
          <p className="max-w-sm text-musgo">
            Respondemos em até dois dias úteis. Na semana de prova, o retorno é
            no mesmo dia.
          </p>

          <dl className="mt-12 space-y-8">
            <div>
              <dt className="eyebrow text-musgo">E-mail</dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${CONTATO.email}`}
                  className="font-mono text-sm hover:text-verde"
                >
                  {CONTATO.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-musgo">Telefone e WhatsApp</dt>
              <dd className="mt-2 font-mono text-sm">{CONTATO.telefone}</dd>
            </div>
            <div>
              <dt className="eyebrow text-musgo">Instagram</dt>
              <dd className="mt-2 font-mono text-sm">{CONTATO.instagram}</dd>
            </div>
            <div>
              <dt className="eyebrow text-musgo">Base</dt>
              <dd className="mt-2 font-mono text-sm">{CIDADE}</dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-linha pt-8">
          <FormularioContato />
        </div>
      </section>
    </>
  );
}
