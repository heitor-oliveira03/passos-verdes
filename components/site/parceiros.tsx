/**
 * Esteira de patrocinadores. A lista sai da largura da tela de propósito —
 * quem vê entende que continua. A animação é CSS puro (ver `.esteira`), e a
 * lista aparece duas vezes para o laço não ter emenda.
 *
 * ponytail: logos de exemplo (simple-icons). Trocar pelos patrocinadores reais.
 */
const PARCEIROS = [
  "nike",
  "adidas",
  "puma",
  "newbalance",
  "underarmour",
  "garmin",
  "strava",
  "fitbit",
  "reebok",
  "thenorthface",
  "redbull",
];

export function Parceiros() {
  return (
    <section id="parceiros" className="scroll-mt-20 overflow-hidden py-20">
      <p className="eyebrow mx-auto max-w-350 px-6 text-center text-musgo sm:px-12">
        Nossos apoiadores
      </p>

      <div className="relative mt-10">
        {/* Bordas esfumadas: a esteira some no branco em vez de cortar seco. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-branco to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-branco to-transparent"
        />

        <ul className="esteira flex w-max items-center gap-16 px-8">
          {[...PARCEIROS, ...PARCEIROS].map((marca, i) => (
            <li key={`${marca}-${i}`} aria-hidden={i >= PARCEIROS.length}>
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático, o otimizador não converte */}
              <img
                src={`/imagens/logos/${marca}.svg`}
                alt={marca}
                width={40}
                height={40}
                loading="lazy"
                className="h-9 w-auto opacity-40 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
