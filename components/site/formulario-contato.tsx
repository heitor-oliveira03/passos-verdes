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

      <Campo label="Assunto" className="sm:col-span-2">
        <select name="assunto" defaultValue={ASSUNTOS[0]} className={entrada}>
          {ASSUNTOS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </Campo>

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
