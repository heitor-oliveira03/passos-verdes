import type { ReactNode } from "react";

/** Classe única para input, select e textarea do site e do admin. */
export const entrada =
  "w-full border border-linha bg-branco px-4 py-3 text-base text-tinta transition-colors placeholder:text-musgo/60 focus:border-verde focus:outline-none";

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
