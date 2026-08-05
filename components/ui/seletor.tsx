"use client";

import { useEffect, useId, useRef, useState } from "react";

type Opcao = { valor: string; rotulo: string };

export function Seletor({
  name,
  opcoes,
  valorInicial,
}: {
  name: string;
  opcoes: Opcao[];
  valorInicial: string;
}) {
  const [valor, setValor] = useState(valorInicial);
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const listaId = useId();
  const selecionada = opcoes.find((opcao) => opcao.valor === valor) ?? opcoes[0];

  useEffect(() => {
    function fechar(evento: PointerEvent) {
      if (!raiz.current?.contains(evento.target as Node)) setAberto(false);
    }
    document.addEventListener("pointerdown", fechar);
    return () => document.removeEventListener("pointerdown", fechar);
  }, []);

  function mover(direcao: number) {
    const atual = Math.max(0, opcoes.findIndex((opcao) => opcao.valor === valor));
    const proxima = (atual + direcao + opcoes.length) % opcoes.length;
    setValor(opcoes[proxima].valor);
  }

  return (
    <div ref={raiz} className="relative">
      <input type="hidden" name={name} value={valor} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls={listaId}
        onClick={() => setAberto((estado) => !estado)}
        onKeyDown={(evento) => {
          if (evento.key === "Escape") setAberto(false);
          if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
            evento.preventDefault();
            mover(evento.key === "ArrowDown" ? 1 : -1);
            setAberto(true);
          }
        }}
        className={`flex min-h-12 w-full items-center justify-between gap-4 rounded-xl border bg-branco px-4 py-3 text-left text-base leading-6 text-tinta shadow-sm transition-all hover:border-musgo/50 focus:outline-none ${
          aberto
            ? "border-verde shadow-[0_0_0_4px_var(--color-verde-claro)]"
            : "border-linha"
        }`}
      >
        <span className="truncate">{selecionada?.rotulo}</span>
        <Seta aberta={aberto} />
      </button>

      {aberto ? (
        <div
          id={listaId}
          role="listbox"
          aria-label={`Opções de ${name}`}
          className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-linha bg-branco p-1.5 text-tinta shadow-xl"
        >
          {opcoes.map((opcao) => {
            const ativa = opcao.valor === valor;
            return (
              <button
                key={opcao.valor}
                type="button"
                role="option"
                aria-selected={ativa}
                onClick={() => {
                  setValor(opcao.valor);
                  setAberto(false);
                }}
                className={`flex min-h-10 w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  ativa
                    ? "bg-verde-claro font-semibold text-verde"
                    : "hover:bg-cal"
                }`}
              >
                {opcao.rotulo}
                {ativa ? <span aria-hidden>✓</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function Seta({ aberta }: { aberta: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 8"
      className={`h-2 w-3 shrink-0 text-verde transition-transform ${aberta ? "rotate-180" : ""}`}
    >
      <path
        d="M1 1.5 6 6.5l5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
