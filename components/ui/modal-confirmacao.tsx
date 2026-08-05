"use client";

import { useEffect, useRef } from "react";

type ModalConfirmacaoProps = {
  aberto: boolean;
  titulo: string;
  descricao: string;
  rotuloConfirmar?: string;
  aoConfirmar: () => void;
  aoFechar: () => void;
};

export function ModalConfirmacao({
  aberto,
  titulo,
  descricao,
  rotuloConfirmar = "Confirmar",
  aoConfirmar,
  aoFechar,
}: ModalConfirmacaoProps) {
  const dialogo = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const elemento = dialogo.current;
    if (!elemento) return;

    if (aberto && !elemento.open) elemento.showModal();
    if (!aberto && elemento.open) elemento.close();
  }, [aberto]);

  if (!aberto) return null;

  return (
    <dialog
      ref={dialogo}
      onCancel={(evento) => {
        evento.preventDefault();
        aoFechar();
      }}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) aoFechar();
      }}
      aria-labelledby="titulo-modal-confirmacao"
      aria-describedby="descricao-modal-confirmacao"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-linha bg-branco p-0 text-tinta shadow-2xl backdrop:bg-tinta/65 backdrop:backdrop-blur-sm"
    >
      <div className="border-t-4 border-verde px-6 pb-6 pt-5 sm:px-8 sm:pb-8 sm:pt-7">
        <span className="eyebrow text-verde">Confirmar ação</span>
        <h2 id="titulo-modal-confirmacao" className="display mt-4 text-2xl">
          {titulo}
        </h2>
        <p id="descricao-modal-confirmacao" className="mt-3 text-sm text-musgo">
          {descricao}
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            autoFocus
            onClick={aoFechar}
            className="eyebrow rounded-full border border-linha bg-branco px-6 py-3.5 text-musgo transition-colors hover:border-verde hover:text-tinta"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              aoConfirmar();
              aoFechar();
            }}
            className="eyebrow rounded-full bg-tinta px-6 py-3.5 text-branco transition-colors hover:bg-verde"
          >
            {rotuloConfirmar}
          </button>
        </div>
      </div>
    </dialog>
  );
}
