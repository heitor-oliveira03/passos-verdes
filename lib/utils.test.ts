import assert from "node:assert/strict";
import { test } from "node:test";
import { SEED } from "./seed.ts";
import {
  idade,
  mesVizinho,
  planilhaCsv,
  semanasDoMes,
  slugify,
} from "./utils.ts";

test("semanasDoMes alinha o mês no domingo e completa as pontas com vazio", () => {
  // Setembro/2026 começa numa terça e tem 30 dias: 2 vazios, depois 5 semanas.
  const semanas = semanasDoMes("2026-09");
  assert.equal(semanas.length, 5);
  assert.deepEqual(semanas[0].slice(0, 3), [null, null, "2026-09-01"]);
  assert.equal(semanas.at(-1)?.at(3), "2026-09-30");
  assert.equal(semanas.at(-1)?.at(4), null);
  assert.equal(semanas.flat().filter(Boolean).length, 30);
  // Fevereiro bissexto que começa no domingo: 29 dias exatos, sem sobra.
  assert.equal(semanasDoMes("2032-02").flat().filter(Boolean).length, 29);
});

test("mesVizinho vira o ano nas duas direções", () => {
  assert.equal(mesVizinho("2026-12", 1), "2027-01");
  assert.equal(mesVizinho("2026-01", -1), "2025-12");
});

test("idade desconta o aniversário que ainda não chegou na data da prova", () => {
  assert.equal(idade("1994-03-18", "2026-09-12"), 32);
  assert.equal(idade("1994-12-30", "2026-09-12"), 31);
  assert.equal(idade("", "2026-09-12"), "");
});

test("slugify tira acento e pontuação", () => {
  assert.equal(slugify("Noturna do Parque 2026"), "noturna-do-parque-2026");
  assert.equal(slugify("Circuito Verde — 21K!"), "circuito-verde-21k");
});

test("planilha escapa aspas e mantém uma linha por participante", () => {
  const evento = SEED.eventos[0];
  const inscritos = SEED.inscricoes.filter((i) => i.eventoId === evento.id);
  const csv = planilhaCsv(evento, [
    { ...inscritos[0], nome: 'Ana "Pace" Rodrigues', numeroPeito: 1 },
    ...inscritos.slice(1),
  ]);

  const linhas = csv.split("\r\n");
  assert.equal(linhas.length, inscritos.length + 1);
  assert.ok(linhas[0].startsWith("﻿Número de peito;Nome;E-mail;"));
  assert.ok(linhas[1].startsWith('"0001";"Ana ""Pace"" Rodrigues";'));
});
