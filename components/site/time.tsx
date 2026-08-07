"use client";

import { useState } from "react";
import { Seta } from "@/components/ui/seta";

/**
 * Quem monta a prova, um de cada vez. Não passa pelo admin: a equipe muda
 * uma vez por ano, editar aqui é mais barato que uma tela de CRUD.
 *
 * ponytail: retratos de exemplo (public/imagens/creditos.txt). Trocar pelas
 * fotos reais da equipe antes de publicar.
 */
const TIME = [
  {
    nome: "Guilherme Nogueira",
    cargo: "Criador e maratonista",
    foto: "/imagens/time/rafael.jpg",
    texto: "Guilherme é o criador....",
  },
  {
    nome: "Steffani Magalhães",
    cargo: "Maratonista",
    foto: "/imagens/time/marina.jpg",
    texto: "criadora.....",
  },
  {
    nome: "Thiago SOuza",
    cargo: "Percurso",
    foto: "/imagens/time/caio.jpg",
    texto: "Trabalha com ed. fisica desde a primeira edição.",
  },
  {
    nome: "Theo Gouveia",
    cargo: "Maratonista",
    foto: "/imagens/time/tiago.jpg",
    texto: "Maratonista",
  },
];

export function Time() {
  const [atual, setAtual] = useState(0);
  const pessoa = TIME[atual];
  const ir = (passo: number) =>
    setAtual((i) => (i + passo + TIME.length) % TIME.length);

  return (
    <section id="time" className="scroll-mt-20 px-3 sm:px-5">
      <div className="mx-auto max-w-350 rounded-3xl bg-cal px-6 py-16 sm:rounded-4xl sm:px-12 sm:py-20">
        <p className="eyebrow text-verde">Nosso time</p>
        <h2 className="display mt-5 max-w-2xl text-4xl sm:text-6xl">
          Quatro pessoas
          <br />
          montam a largada
        </h2>

        <div className="mt-12 grid items-center gap-10 sm:grid-cols-[auto_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element -- retrato local pequeno, sem ganho no otimizador */}
          <img
            key={pessoa.foto}
            src={pessoa.foto}
            alt={pessoa.nome}
            width={128}
            height={128}
            className="size-36 rounded-full object-cover ring-4 ring-verde/25 sm:h-44 sm:w-44"
          />

          <div>
            <p className="eyebrow text-musgo">{pessoa.cargo}</p>
            <h3 className="display mt-3 text-3xl sm:text-4xl">{pessoa.nome}</h3>
            <p className="mt-4 max-w-xl text-musgo">{pessoa.texto}</p>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4">
          {[
            { passo: -1, para: "esquerda", rotulo: "Pessoa anterior" },
            { passo: 1, para: "direita", rotulo: "Próxima pessoa" },
          ].map((b) => (
            <button
              key={b.passo}
              type="button"
              onClick={() => ir(b.passo)}
              aria-label={b.rotulo}
              className="flex size-11 items-center justify-center rounded-full border border-linha bg-branco text-lg transition-all hover:scale-110 hover:border-verde hover:text-verde"
            >
              <Seta para={b.para as "esquerda" | "direita"} />
            </button>
          ))}

          <div className="ml-2 flex gap-2">
            {TIME.map((p, i) => (
              <button
                key={p.nome}
                type="button"
                onClick={() => setAtual(i)}
                aria-label={`Ver ${p.nome}`}
                aria-current={i === atual}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === atual ? "w-10 bg-verde" : "w-5 bg-musgo/35"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
