"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Marca } from "@/components/site/cabecalho";
import { Campo, entrada } from "@/components/ui/campo";
import { entrar, sair, useAutenticado } from "@/lib/store";

const MENU = [
  { href: "/admin", label: "Resumo" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/eventos", label: "Eventos" },
];

const CHAVE_TEMA = "passos-verdes/admin/tema";

/**
 * Tema do painel, no mesmo formato do resto do estado do app: fonte externa
 * (localStorage) lida via useSyncExternalStore, para o servidor renderizar
 * claro e o cliente corrigir sem divergência.
 */
const ouvintesDoTema = new Set<() => void>();

function lerTema() {
  try {
    return localStorage.getItem(CHAVE_TEMA) === "escuro";
  } catch {
    return false;
  }
}

function useTemaEscuro() {
  return useSyncExternalStore(
    (ouvir: () => void) => {
      ouvintesDoTema.add(ouvir);
      return () => ouvintesDoTema.delete(ouvir);
    },
    lerTema,
    () => false,
  );
}

function BotaoTema({ escuro }: { escuro: boolean }) {
  return (
    <button
      type="button"
      onClick={() => {
        localStorage.setItem(CHAVE_TEMA, escuro ? "claro" : "escuro");
        ouvintesDoTema.forEach((ouvir) => ouvir());
      }}
      role="switch"
      aria-checked={escuro}
      aria-label="Tema escuro"
      title={escuro ? "Mudar para o tema claro" : "Mudar para o tema escuro"}
      className="relative flex h-8 w-14 shrink-0 items-center rounded-full border border-linha bg-cal transition-colors hover:border-verde"
    >
      {/* Botão físico: o disco corre para o lado do tema ligado. */}
      <span
        aria-hidden
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-verde text-xs transition-transform duration-300 ${
          escuro ? "translate-x-7" : "translate-x-1"
        }`}
      >
        {escuro ? "☾" : "☀"}
      </span>
    </button>
  );
}

export default function LayoutDoAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const autenticado = useAutenticado();
  const caminho = usePathname();
  const escuro = useTemaEscuro();

  if (!autenticado) return <Login escuro={escuro} />;

  return (
    <div
      className={`flex min-h-dvh flex-col bg-cal ${escuro ? "tema-escuro" : ""}`}
    >
      <header className="border-b border-linha bg-branco">
        <div className="mx-auto flex h-16 max-w-300 items-center gap-8 px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Marca className="text-base" />
          </Link>
          <span className="eyebrow rounded-full border border-linha px-2.5 py-1 text-musgo">
            Admin
          </span>

          <nav className="ml-auto flex items-center gap-6">
            {MENU.map((item) => {
              const ativo =
                item.href === "/admin"
                  ? caminho === "/admin"
                  : caminho.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={ativo ? "page" : undefined}
                  className={`eyebrow transition-colors ${
                    ativo ? "text-verde" : "text-musgo hover:text-tinta"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <BotaoTema escuro={escuro} />
            <button
              type="button"
              onClick={sair}
              className="eyebrow text-musgo hover:text-tinta"
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-300 flex-1 px-5 py-12 sm:px-8">
        {children}
      </main>
    </div>
  );
}

function Login({ escuro }: { escuro: boolean }) {
  const [erro, setErro] = useState(false);

  function aoEnviar(dados: FormData) {
    setErro(!entrar(String(dados.get("senha") ?? "")));
  }

  return (
    <div
      className={`flex min-h-dvh items-center justify-center bg-cal px-5 py-20 ${escuro ? "tema-escuro" : ""}`}
    >
      <div className="w-full max-w-sm">
        <Marca />
        <h1 className="display mt-8 text-4xl">Painel da organização</h1>
        <p className="mt-3 text-sm text-musgo">
          Área restrita à equipe da Passos Verdes.
        </p>

        <form action={aoEnviar} className="mt-8 space-y-4">
          <Campo label="Senha">
            <input
              name="senha"
              type="password"
              required
              autoComplete="current-password"
              autoFocus
              className={entrada}
            />
          </Campo>

          {erro ? (
            <p
              role="alert"
              className="border-l-2 border-verde pl-3 text-sm text-tinta"
            >
              Senha incorreta. Tente de novo.
            </p>
          ) : null}

          <button
            type="submit"
            className="eyebrow w-full rounded-full bg-tinta px-6 py-4 text-branco transition-colors hover:bg-verde"
          >
            Entrar
          </button>
        </form>

        {/* ponytail: sem backend, a senha é fixa. Trocar por auth de verdade. */}
        <p className="mt-6 font-mono text-xs text-musgo">senha: verde2026</p>
      </div>
    </div>
  );
}
