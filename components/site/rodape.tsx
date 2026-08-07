import Link from "next/link";
import { CIDADE, CONTATO } from "@/lib/seed";

export function Rodape() {
  return (
    <footer className="rounded-t-3xl bg-mata text-branco sm:rounded-t-4xl">
      <div className="@container mx-auto max-w-350 px-5 py-16 sm:px-8">
        {/* ponytail: cqw em vez de vw — o container trava em 1400px e o vw não,
            por isso a palavra vazava. 9.5 = largura de "PassosVerdes" no Archivo
            wdth 125; reajustar se a fonte mudar. */}
        <div className="flex items-start justify-between gap-6">
          <p className="display text-[9.5cqw] leading-[0.8]">
            Passos<span className="text-verde">Verdes</span>
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element -- arquivo local, mesmo caminho das outras */}
          <img
            src="/imagens/logo.png"
            alt="Logotipo da Passos Verdes"
            loading="lazy"
            className="size-16 shrink-0 object-contain sm:size-24"
          />
        </div>

        <div className="mt-14 grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-3">
          <div>
            <p className="eyebrow text-verde">Onde corremos</p>
            <p className="mt-3 text-white/70">{CIDADE} — Andorinhas</p>
          </div>

          <div>
            <p className="eyebrow text-verde">Falar com a gente</p>
            <ul className="mt-3 space-y-1 text-white/70">
              <li>
                <a
                  className="hover:text-branco"
                  href={`mailto:${CONTATO.email}`}
                >
                  {CONTATO.email}
                </a>
              </li>
              <li>
                <a
                  className="hover:text-branco"
                  href={`tel:${CONTATO.telefone.replace(/\D/g, "")}`}
                >
                  {CONTATO.telefone}
                </a>
              </li>
              <li>{CONTATO.instagram}</li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-verde">Navegar</p>
            <ul className="mt-3 space-y-1 text-white/70">
              <li>
                <Link className="hover:text-branco" href="/sobre">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link className="hover:text-branco" href="/eventos">
                  Eventos
                </Link>
              </li>
              <li>
                <Link className="hover:text-branco" href="/contato">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="eyebrow mt-14 text-white/35">
          © {new Date().getFullYear()} Passos Verdes ·{" "}
          <a
            href="/imagens/creditos.txt"
            className="underline underline-offset-4 hover:text-verde"
          >
            Créditos das fotos
          </a>
        </p>
      </div>
    </footer>
  );
}
