import type { ReactNode } from "react";

/** Classe única para input, select e textarea do site e do admin. */
export const entrada =
  "block min-h-12 w-full rounded-xl border border-linha bg-branco px-4 py-3 text-base leading-6 text-tinta shadow-sm transition-all duration-200 placeholder:text-musgo/60 hover:border-musgo/50 focus:border-verde focus:shadow-[0_0_0_4px_var(--color-verde-claro)] focus:outline-none";

/** Mesma caixa da `entrada`, mais a seta desenhada por nós (ver globals.css). */
export const selecao = `${entrada} selecao`;

/** Botão sólido. Pílula, como os do site — o painel usa a mesma linguagem. */
export const botao =
  "eyebrow inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-tinta px-6 py-3 text-center text-branco transition-colors hover:bg-verde";

/** Etiqueta de estado numa lista: publicado, no carrossel, rascunho. */
export const etiqueta =
  "eyebrow inline-flex min-h-7 shrink-0 items-center justify-center rounded-full px-3 py-1 text-center";

/** Botão do `<input type="file">`, que o navegador não deixa herdar estilo. */
export const arquivo =
  "block h-12 w-full max-w-md rounded-xl border border-linha bg-branco p-1 text-sm leading-10 text-musgo transition-colors file:mr-3 file:h-10 file:rounded-lg file:border-0 file:bg-cal file:px-4 file:font-mono file:text-[0.6875rem] file:leading-10 file:uppercase file:tracking-[0.14em] file:text-tinta hover:border-verde hover:file:text-verde";

export function Campo({
  label,
  dica,
  children,
  className = "",
}: {
  label: string;
  dica?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex min-w-0 flex-col ${className}`}>
      <span className="eyebrow text-musgo">{label}</span>
      <span className="mt-2 block min-w-0">{children}</span>
      {dica ? (
        <span className="mt-1.5 block text-xs text-musgo">{dica}</span>
      ) : null}
    </label>
  );
}
