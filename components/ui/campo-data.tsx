"use client";

import { useEffect, useId, useRef, useState } from "react";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

const isoLocal = (data: Date) =>
  `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;

function isoDoTexto(texto: string) {
  const resultado = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!resultado) return "";
  const [, dia, mes, ano] = resultado;
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
  return data.getFullYear() === Number(ano) &&
    data.getMonth() === Number(mes) - 1 &&
    data.getDate() === Number(dia)
    ? `${ano}-${mes}-${dia}`
    : "";
}

function formatarDigitacao(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 8);
  return [digitos.slice(0, 2), digitos.slice(2, 4), digitos.slice(4, 8)]
    .filter(Boolean)
    .join("/");
}

export function CampoData({ name }: { name: string }) {
  const hoje = new Date();
  const [texto, setTexto] = useState("");
  const [aberto, setAberto] = useState(false);
  const [mesVisivel, setMesVisivel] = useState(
    () => new Date(hoje.getFullYear() - 18, hoje.getMonth(), 1),
  );
  const raiz = useRef<HTMLDivElement>(null);
  const calendarioId = useId();
  const valorIso = isoDoTexto(texto);

  useEffect(() => {
    function fechar(evento: PointerEvent) {
      if (!raiz.current?.contains(evento.target as Node)) setAberto(false);
    }
    document.addEventListener("pointerdown", fechar);
    return () => document.removeEventListener("pointerdown", fechar);
  }, []);

  function navegar(meses: number) {
    setMesVisivel(
      (atual) => new Date(atual.getFullYear(), atual.getMonth() + meses, 1),
    );
  }

  const primeiroDia = new Date(
    mesVisivel.getFullYear(),
    mesVisivel.getMonth(),
    1,
  ).getDay();
  const totalDias = new Date(
    mesVisivel.getFullYear(),
    mesVisivel.getMonth() + 1,
    0,
  ).getDate();

  return (
    <div ref={raiz} className="relative">
      <input type="hidden" name={name} value={valorIso} />
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          required
          pattern="\d{2}/\d{2}/\d{4}"
          placeholder="dd/mm/aaaa"
          value={texto}
          aria-controls={calendarioId}
          onChange={(evento) => setTexto(formatarDigitacao(evento.target.value))}
          onFocus={() => setAberto(true)}
          className="block min-h-12 w-full rounded-xl border border-linha bg-branco py-3 pl-4 pr-12 text-base leading-6 text-tinta shadow-sm transition-all placeholder:text-musgo/60 hover:border-musgo/50 focus:border-verde focus:shadow-[0_0_0_4px_var(--color-verde-claro)] focus:outline-none"
        />
        <button
          type="button"
          aria-label="Abrir calendário"
          onClick={() => setAberto((estado) => !estado)}
          className="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-musgo transition-colors hover:text-verde"
        >
          <IconeCalendario />
        </button>
      </div>

      {aberto ? (
        <div
          id={calendarioId}
          className="absolute right-0 z-30 mt-2 w-full min-w-72 rounded-2xl border border-linha bg-branco p-4 text-tinta shadow-xl sm:left-0 sm:right-auto"
        >
          <div className="flex items-center justify-between gap-2">
            <button type="button" onClick={() => navegar(-12)} aria-label="Ano anterior" className="eyebrow rounded-lg px-2 py-2 text-musgo hover:bg-cal hover:text-verde">−1a</button>
            <button type="button" onClick={() => navegar(-1)} aria-label="Mês anterior" className="inline-flex size-9 items-center justify-center rounded-lg text-xl hover:bg-cal hover:text-verde">‹</button>
            <p className="min-w-32 text-center font-mono text-xs font-semibold uppercase tracking-wider">
              {MESES[mesVisivel.getMonth()]} {mesVisivel.getFullYear()}
            </p>
            <button type="button" onClick={() => navegar(1)} aria-label="Próximo mês" className="inline-flex size-9 items-center justify-center rounded-lg text-xl hover:bg-cal hover:text-verde">›</button>
            <button type="button" onClick={() => navegar(12)} aria-label="Próximo ano" className="eyebrow rounded-lg px-2 py-2 text-musgo hover:bg-cal hover:text-verde">+1a</button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center">
            {SEMANA.map((dia, indice) => (
              <span key={`${dia}-${indice}`} className="eyebrow py-1 text-musgo">{dia}</span>
            ))}
            {Array.from({ length: primeiroDia }, (_, indice) => <span key={`vazio-${indice}`} />)}
            {Array.from({ length: totalDias }, (_, indice) => {
              const dia = indice + 1;
              const data = new Date(mesVisivel.getFullYear(), mesVisivel.getMonth(), dia);
              const iso = isoLocal(data);
              const selecionado = iso === valorIso;
              const futuro = data > hoje;
              return (
                <button
                  key={dia}
                  type="button"
                  disabled={futuro}
                  aria-label={`${dia} de ${MESES[mesVisivel.getMonth()]} de ${mesVisivel.getFullYear()}`}
                  onClick={() => {
                    setTexto(`${String(dia).padStart(2, "0")}/${String(mesVisivel.getMonth() + 1).padStart(2, "0")}/${mesVisivel.getFullYear()}`);
                    setAberto(false);
                  }}
                  className={`aspect-square rounded-lg text-sm transition-colors ${
                    selecionado
                      ? "bg-verde font-semibold text-branco"
                      : "hover:bg-verde-claro hover:text-verde disabled:text-musgo/35 disabled:hover:bg-transparent"
                  }`}
                >
                  {dia}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => {
              setMesVisivel(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
              setTexto(`${String(hoje.getDate()).padStart(2, "0")}/${String(hoje.getMonth() + 1).padStart(2, "0")}/${hoje.getFullYear()}`);
              setAberto(false);
            }}
            className="eyebrow mt-3 w-full rounded-lg border border-linha px-3 py-2 text-verde hover:bg-verde-claro"
          >
            Selecionar hoje
          </button>
        </div>
      ) : null}
    </div>
  );
}

function IconeCalendario() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}
