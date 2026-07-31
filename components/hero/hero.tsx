"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDados } from "@/lib/store";
import { dataCurta, ehFuturo } from "@/lib/utils";

const INTERVALO = 6000;

/**
 * Hero da home: carrossel dos banners ativos, editáveis em /admin/banners.
 * Cada banner é um slide — foto de fundo mais o seu próprio texto.
 */
export function Hero() {
  const { banners, eventos } = useDados();
  const slides = banners.filter((b) => b.ativo);
  const proxima = eventos
    .filter((e) => e.publicado && ehFuturo(e))
    .sort((a, b) => a.data.localeCompare(b.data))[0];

  const [atual, setAtual] = useState(0);
  const palcoRef = useRef<HTMLDivElement>(null);

  const total = slides.length;
  // `atual` na dependência: clicar na seta reinicia a contagem do slide.
  useEffect(() => {
    if (total < 2) return;
    const t = setInterval(() => setAtual((i) => (i + 1) % total), INTERVALO);
    return () => clearInterval(t);
  }, [total, atual]);

  const ir = (passo: number) => setAtual((i) => (i + passo + total) % total);

  useEffect(() => {
    const palco = palcoRef.current;
    if (!palco) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let matar: (() => void) | undefined;
    import("gsap").then(({ gsap }) => {
      const ctx = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from("[data-entra]", {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.09,
          })
          .from(
            "[data-surge]",
            { opacity: 0, duration: 0.8, stagger: 0.1 },
            0.5,
          );
      }, palco);
      matar = () => ctx.revert();
    });

    return () => matar?.();
  }, []);

  const banner = slides[atual] ?? slides[0];
  if (!banner) return null;

  return (
    <div ref={palcoRef}>
      <section className="relative isolate flex min-h-[84svh] flex-col justify-end overflow-hidden bg-mata text-branco">
        {slides.map((slide, i) =>
          slide.imagem ? (
            // eslint-disable-next-line @next/next/no-img-element -- fonte é data URL do admin, sem otimizador
            <img
              key={slide.id}
              src={slide.imagem}
              alt=""
              aria-hidden
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === atual ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : null,
        )}
        {/* Véu: a foto é fundo, o texto é o assunto. */}
        <div aria-hidden className="absolute inset-0 bg-tinta/55" />

        {total > 1 ? (
          // Alinhadas ao topo: o título ocupa a metade de baixo da hero.
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-start justify-between px-2 pt-[16svh] sm:px-4">
            {[
              { passo: -1, seta: "←", rotulo: "Slide anterior" },
              { passo: 1, seta: "→", rotulo: "Próximo slide" },
            ].map((b) => (
              <button
                key={b.passo}
                type="button"
                onClick={() => ir(b.passo)}
                aria-label={b.rotulo}
                className="pointer-events-auto flex h-12 w-12 items-center justify-center border border-branco/30 bg-tinta/30 text-xl text-branco backdrop-blur-sm transition-colors hover:border-verde hover:bg-verde"
              >
                <span aria-hidden>{b.seta}</span>
              </button>
            ))}
          </div>
        ) : null}

        <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-24 pt-16 sm:px-8 sm:pt-24">
          <p data-surge className="eyebrow text-verde">
            {banner.eyebrow}
          </p>

          <h1 className="display mt-6 text-[14vw] leading-[0.82] sm:text-[10vw] xl:text-[8.5rem]">
            <span className="block overflow-hidden">
              <span data-entra className="block">
                {banner.titulo}
              </span>
            </span>
            <span className="block overflow-hidden text-verde">
              <span data-entra className="block">
                {banner.destaque}
              </span>
            </span>
          </h1>

          <div className="mt-8 flex max-w-xl flex-col gap-6 sm:flex-row sm:items-center">
            <p data-surge className="text-branco/80">
              {banner.subtitulo}
            </p>
          </div>

          <Link
            data-surge
            href={banner.ctaHref}
            className="eyebrow mt-8 inline-flex items-center gap-3 bg-verde px-6 py-4 text-branco transition-colors hover:bg-branco hover:text-tinta"
          >
            {banner.ctaLabel}
            <span aria-hidden>→</span>
          </Link>

          {total > 1 ? (
            <div className="mt-12 flex gap-3">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setAtual(i)}
                  aria-label={`Ver ${slide.titulo} ${slide.destaque}`}
                  aria-current={i === atual}
                  className={`h-1 w-12 transition-colors ${
                    i === atual ? "bg-verde" : "bg-branco/35 hover:bg-branco/70"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Fita de dados: a próxima largada, logo abaixo da hero. */}
      {proxima ? (
        <div data-surge className="bg-branco">
          <dl className="mx-auto flex max-w-[1400px] flex-wrap items-baseline gap-x-10 gap-y-3 border-t border-tinta/15 px-5 py-4 sm:px-8">
            <div>
              <dt className="eyebrow text-musgo">Próxima largada</dt>
              <dd className="mt-2 font-mono text-sm">
                {dataCurta(proxima.data)} · {proxima.horario}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-musgo">Prova</dt>
              <dd className="mt-2 font-mono text-sm">
                {proxima.nome} · {proxima.edicao}ª ed.
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-musgo">Distâncias</dt>
              <dd className="mt-2 font-mono text-sm">
                {proxima.distancias.join(" / ")}
              </dd>
            </div>
            <Link
              href={`/eventos/${proxima.slug}`}
              className="eyebrow ml-auto self-center underline underline-offset-4 hover:text-verde"
            >
              Inscrever
            </Link>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
