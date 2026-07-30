"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Seletor dos itens a revelar em sequência. Sem ele, revela o bloco todo. */
  seletor?: string;
  className?: string;
};

/** Revelação no scroll. Um único padrão para o site inteiro, sem variações. */
export function Revelar({ children, seletor, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let matar: (() => void) | undefined;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        const alvos = seletor
          ? Array.from(elemento.querySelectorAll(seletor))
          : [elemento];
        if (alvos.length === 0) return;

        const animacao = gsap.from(alvos, {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: seletor ? 0.07 : 0,
          scrollTrigger: { trigger: elemento, start: "top 85%" },
        });

        matar = () => {
          animacao.scrollTrigger?.kill();
          animacao.kill();
          gsap.set(alvos, { clearProps: "all" });
        };
      },
    );

    return () => matar?.();
  }, [seletor]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
