"use client";

import { Campo, entrada } from "@/components/ui/campo";
import { CONTATO } from "@/lib/seed";

const ASSUNTOS = [
  "Inscrição e pagamento",
  "Patrocínio",
  "Imprensa",
  "Voluntariado",
  "Outro assunto",
];

/**
 * ponytail: sem backend, o envio abre o e-mail do visitante já preenchido.
 * A mensagem chega de verdade — melhor que um "enviado!" que não envia nada.
 */
export function FormularioContato() {
  function aoEnviar(dados: FormData) {
    const assunto = encodeURIComponent(
      `[Site] ${dados.get("assunto")} — ${dados.get("nome")}`,
    );
    const corpo = encodeURIComponent(
      `${dados.get("mensagem")}\n\n—\n${dados.get("nome")}\n${dados.get("email")}`,
    );
    location.href = `mailto:${CONTATO.email}?subject=${assunto}&body=${corpo}`;
  }

  return (
    <form action={aoEnviar} className="grid gap-5 sm:grid-cols-2">
      <Campo label="Seu nome">
        <input name="nome" required autoComplete="name" className={entrada} />
      </Campo>

      <Campo label="E-mail">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={entrada}
        />
      </Campo>

      {/* Cinco opções curtas cabem na tela: viram escolha à vista, no lugar de
          um dropdown cujo painel aberto é do sistema operacional. */}
      <fieldset className="sm:col-span-2">
        <legend className="eyebrow text-musgo">Assunto</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {ASSUNTOS.map((assunto, i) => (
            <label key={assunto} className="cursor-pointer">
              <input
                type="radio"
                name="assunto"
                value={assunto}
                defaultChecked={i === 0}
                className="peer sr-only"
              />
              <span className="eyebrow block rounded-full border border-linha bg-branco px-4 py-3 text-musgo transition-colors hover:border-musgo peer-checked:border-tinta peer-checked:bg-tinta peer-checked:text-branco peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-verde">
                {assunto}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Campo label="Mensagem" className="sm:col-span-2">
        <textarea name="mensagem" required rows={6} className={entrada} />
      </Campo>

      <button
        type="submit"
        className="eyebrow rounded-full bg-tinta px-6 py-4 text-branco transition-all hover:scale-[1.02] hover:bg-verde sm:col-span-2"
      >
        Enviar mensagem
      </button>
    </form>
  );
}
