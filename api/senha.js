import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derivar = promisify(scrypt);

/**
 * Guarda como `salt:hash`. O salt é sorteado a cada senha, então duas pessoas
 * com a mesma senha viram hashes diferentes — é o que mata rainbow table.
 */
export async function gerarHash(senha) {
  const salt = randomBytes(16).toString("hex");
  const hash = await derivar(senha, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}

export async function conferirSenha(senha, guardado) {
  const [salt, hash] = String(guardado).split(":");
  if (!salt || !hash) return false;

  const esperado = Buffer.from(hash, "hex");
  if (esperado.length !== 64) return false;

  const calculado = await derivar(senha, salt, 64);
  // timingSafeEqual, não `===`: comparar string para no primeiro byte diferente,
  // e esse tempo a mais entrega o hash byte a byte pra quem cronometrar.
  return timingSafeEqual(esperado, calculado);
}

// `node senha.js minhasenha` imprime o hash pronto pra colar no .env.
if (process.argv[1]?.endsWith("senha.js") && process.argv[2]) {
  console.log(await gerarHash(process.argv[2]));
}
