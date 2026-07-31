import type { ReactNode } from "react";

/** Classe única para input, select e textarea do site e do admin. */
export const entrada =
  "w-full rounded-xl border border-linha bg-branco px-4 py-3 text-base text-tinta shadow-sm transition-all duration-200 placeholder:text-musgo/60 hover:border-musgo/50 focus:border-verde focus:shadow-[0_0_0_4px_var(--color-verde-claro)] focus:outline-none";

/** Mesma caixa da `entrada`, mais a seta desenhada por nós (ver globals.css). */
export const selecao = `${entrada} selecao`;

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
    <label className={`block ${className}`}>
      <span className="eyebrow text-musgo">{label}</span>
      <span className="mt-2 block">{children}</span>
      {dica ? (
        <span className="mt-1.5 block text-xs text-musgo">{dica}</span>
      ) : null}
    </label>
  );
}
