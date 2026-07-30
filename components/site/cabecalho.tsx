import Link from "next/link";

const LINKS = [
  { href: "/sobre", label: "Sobre nós" },
  { href: "/eventos", label: "Eventos" },
  { href: "/contato", label: "Contato" },
];

export function Marca({ className = "" }: { className?: string }) {
  return (
    <span className={`display text-lg leading-none ${className}`}>
      Passos<span className="text-verde">Verdes</span>
    </span>
  );
}

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-50 border-b border-linha bg-branco/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Passos Verdes, página inicial">
          <Marca />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="eyebrow text-musgo transition-colors hover:text-tinta"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/eventos"
            className="eyebrow bg-tinta px-4 py-2.5 text-branco transition-colors hover:bg-verde"
          >
            Inscreva-se
          </Link>
        </nav>

        {/* ponytail: <details> nativo no lugar de um menu com estado. */}
        <details className="group md:hidden [&[open]_.fechar]:block [&[open]_.abrir]:hidden">
          <summary className="eyebrow list-none py-2 text-tinta [&::-webkit-details-marker]:hidden">
            <span className="abrir">Menu</span>
            <span className="fechar hidden">Fechar</span>
          </summary>
          <div className="fixed inset-x-0 top-16 border-b border-linha bg-branco px-5 pb-8 pt-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="display block border-b border-linha py-5 text-3xl"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
