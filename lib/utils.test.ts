import assert from "node:assert/strict";
import { test } from "node:test";
import { SEED } from "./seed.ts";
import { idade, planilhaCsv, slugify } from "./utils.ts";

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
    { ...inscritos[0], nome: 'Ana "Pace" Rodrigues' },
    ...inscritos.slice(1),
  ]);

  const linhas = csv.split("\r\n");
  assert.equal(linhas.length, inscritos.length + 1);
  assert.ok(linhas[0].startsWith("﻿Nome;E-mail;"));
  assert.ok(linhas[1].startsWith('"Ana ""Pace"" Rodrigues";'));
});
