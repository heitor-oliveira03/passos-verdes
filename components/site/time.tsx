"use client";

import { useState } from "react";

/**
 * Quem monta a prova, um de cada vez. Não passa pelo admin: a equipe muda
 * uma vez por ano, editar aqui é mais barato que uma tela de CRUD.
 *
 * ponytail: retratos de exemplo (public/imagens/creditos.txt). Trocar pelas
 * fotos reais da equipe antes de publicar.
 */
const TIME = [
  {
    nome: "Rafael Nogueira",
    cargo: "Direção de prova",
    foto: "/imagens/time/rafael.jpg",
    texto:
      "Desenha o percurso e caminha o trajeto inteiro na véspera. Corre desde 2011 e já cruzou seis maratonas.",
  },
  {
    nome: "Marina Salles",
    cargo: "Operações e kit",
    foto: "/imagens/time/marina.jpg",
    texto:
      "Cuida da retirada de kit, do guarda-volumes e da fila que ninguém quer pegar. Se a largada saiu no horário, foi ela.",
  },
  {
    nome: "Caio Ferraz",
    cargo: "Percurso e sinalização",
    foto: "/imagens/time/caio.jpg",
    texto:
      "Responsável pelos balizadores, cones e pela equipe de batedores. Trabalha com trail desde a primeira edição.",
  },
  {
    nome: "Tiago Lemos",
    cargo: "Cronometragem",
    foto: "/imagens/time/tiago.jpg",
    texto:
      "Monta o portal de chip e publica o resultado no mesmo dia — inclusive de quem termina por último.",
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
            className="h-36 w-36 rounded-full object-cover ring-4 ring-verde/25 sm:h-44 sm:w-44"
          />

          <div>
            <p className="eyebrow text-musgo">{pessoa.cargo}</p>
            <h3 className="display mt-3 text-3xl sm:text-4xl">{pessoa.nome}</h3>
            <p className="mt-4 max-w-xl text-musgo">{pessoa.texto}</p>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4">
          {[
            { passo: -1, seta: "←", rotulo: "Pessoa anterior" },
            { passo: 1, seta: "→", rotulo: "Próxima pessoa" },
          ].map((b) => (
            <button
              key={b.passo}
              type="button"
              onClick={() => ir(b.passo)}
              aria-label={b.rotulo}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-linha bg-branco text-lg transition-all hover:scale-110 hover:border-verde hover:text-verde"
            >
              <span aria-hidden>{b.seta}</span>
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
