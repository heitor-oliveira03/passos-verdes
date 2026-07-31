"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Seletor dos itens a revelar em sequência. Sem ele, revela o bloco todo. */
  seletor?: string;
  className?: string;
};

/**
 * Revelação no scroll. Um único padrão para o site inteiro, sem variações.
 *
 * IntersectionObserver + transição CSS em vez do ScrollTrigger do GSAP: o
 * plugin mede a posição do gatilho no momento em que carrega e não remedia
 * sozinho quando a foto abaixo dele entra e empurra a página — o bloco ficava
 * preso em opacidade 0 para sempre. O observer reage ao layout real.
 *
 * O estado escondido é aplicado por JS, nunca no HTML: se o script falhar, o
 * conteúdo aparece.
 */
export function Revelar({ children, seletor, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const alvos = seletor
      ? Array.from(elemento.querySelectorAll<HTMLElement>(seletor))
      : [elemento];
    if (alvos.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          (entrada.target as HTMLElement).dataset.revelar = "visivel";
          observador.unobserve(entrada.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    alvos.forEach((alvo, i) => {
      alvo.dataset.revelar = "";
      alvo.style.transitionDelay = `${i * 70}ms`;
      observador.observe(alvo);
    });

    return () => {
      observador.disconnect();
      alvos.forEach((alvo) => {
        delete alvo.dataset.revelar;
        alvo.style.transitionDelay = "";
      });
    };
  }, [seletor]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
