import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const derivar = promisify(scrypt) as (
  senha: string,
  salt: string,
  tamanho: number,
) => Promise<Buffer>;

const TAMANHO_HASH = 64;

/**
 * Guarda como `salt:hash`. O salt é sorteado a cada senha, então duas pessoas
 * com a mesma senha viram hashes diferentes — é o que mata rainbow table.
 */
export async function gerarHash(senha: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = await derivar(senha, salt, TAMANHO_HASH);
  return `${salt}:${hash.toString("hex")}`;
}

export async function conferirSenha(
  senha: string,
  guardado: string | undefined,
): Promise<boolean> {
  const [salt, hash] = String(guardado).split(":");
  if (!salt || !hash) return false;

  const esperado = Buffer.from(hash, "hex");
  if (esperado.length !== TAMANHO_HASH) return false;

  const calculado = await derivar(senha, salt, TAMANHO_HASH);
  // timingSafeEqual, não `===`: comparar string para no primeiro byte diferente,
  // e esse tempo a mais entrega o hash byte a byte pra quem cronometrar.
  return timingSafeEqual(esperado, calculado);
}

// `node src/auth/senha.ts minhasenha` imprime o hash pronto pro .env.
if (process.argv[1]?.endsWith("senha.ts") && process.argv[2]) {
  console.log(await gerarHash(process.argv[2]));
}
