"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Seta } from "@/components/ui/seta";
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

    let cancelado = false;
    let matar: (() => void) | undefined;
    import("gsap").then(({ gsap }) => {
      // A importação é assíncrona: a rota pode ter desmontado enquanto o
      // pacote carregava. Nesse caso, não aplica estilos ao DOM antigo.
      if (cancelado || !palco.isConnected) return;
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

    return () => {
      cancelado = true;
      matar?.();
    };
  }, []);

  const banner = slides[atual] ?? slides[0];
  if (!banner) return null;

  return (
    <div ref={palcoRef} className="px-3 pt-3 sm:px-5 sm:pt-5">
      {/* Altura fixa: cada banner tem um texto de tamanho diferente e a hero
          não pode pular de altura ao trocar de slide. `min-h-max` é a válvula
          — se algum título editado no admin crescer demais, cresce em vez de
          cortar. */}
      <section className="relative isolate flex h-[78svh] min-h-max flex-col justify-end overflow-hidden rounded-3xl bg-mata text-branco sm:rounded-4xl">
        {slides.map((slide, i) =>
          slide.imagem ? (
            // eslint-disable-next-line @next/next/no-img-element -- fonte é data URL do admin, sem otimizador
            <img
              key={slide.id}
              src={slide.imagem}
              alt=""
              aria-hidden
              // ponytail: as artes são verticais e a hero é uma faixa larga —
              // centralizado sobra torso e a tarja de data bate no título. 15%
              // pega os rostos e joga a tarja para fora do corte.
              className={`absolute inset-0 h-full w-full object-cover object-[50%_15%] transition-opacity duration-1000 ${
                i === atual ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : null,
        )}
        {/* Dois véus: um do pé para cima, outro da esquerda — é onde o texto
            mora. A foto continua legível na diagonal oposta. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-tinta/95 via-tinta/60 to-tinta/25"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-tinta/80 via-transparent to-transparent"
        />

        {total > 1 ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-3 sm:px-5">
            {[
              { passo: -1, para: "esquerda", rotulo: "Slide anterior" },
              { passo: 1, para: "direita", rotulo: "Próximo slide" },
            ].map((b) => (
              <button
                key={b.passo}
                type="button"
                onClick={() => ir(b.passo)}
                aria-label={b.rotulo}
                className="pointer-events-auto flex size-12 items-center justify-center rounded-full border border-branco/25 bg-tinta/25 text-xl text-branco backdrop-blur-md transition-all hover:scale-110 hover:border-verde hover:bg-verde"
              >
                <Seta para={b.para as "esquerda" | "direita"} />
              </button>
            ))}
          </div>
        ) : null}

        <div className="relative mx-auto w-full max-w-350 px-6 pb-14 pt-16 sm:px-12 sm:pb-16 sm:pt-24">
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
            className="eyebrow mt-8 inline-flex items-center gap-3 rounded-full bg-verde px-7 py-4 text-branco transition-all hover:scale-[1.03] hover:bg-branco hover:text-tinta"
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
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === atual
                      ? "w-14 bg-verde"
                      : "w-8 bg-branco/35 hover:bg-branco/70"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Fita de dados: a próxima largada, logo abaixo da hero. */}
      {proxima ? (
        <div data-surge className="px-3 pt-3 sm:px-5 sm:pt-4">
          <dl className="mx-auto flex max-w-350 flex-wrap items-baseline gap-x-10 gap-y-3 rounded-2xl bg-cal px-6 py-5 sm:px-8">
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
