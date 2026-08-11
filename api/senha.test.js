import assert from "node:assert/strict";
import { test } from "node:test";
import { conferirSenha, gerarHash } from "./senha.js";

test("senha certa entra, senha errada não", async () => {
  const guardado = await gerarHash("verde2026");
  assert.ok(await conferirSenha("verde2026", guardado));
  assert.ok(!(await conferirSenha("verde2025", guardado)));
});

test("hash corrompido nega em vez de explodir", async () => {
  assert.ok(!(await conferirSenha("verde2026", "lixo")));
  assert.ok(!(await conferirSenha("verde2026", "")));
  assert.ok(!(await conferirSenha("verde2026", "salt:naoehex")));
});

test("mesma senha gera hashes diferentes (salt)", async () => {
  assert.notEqual(await gerarHash("x"), await gerarHash("x"));
});
