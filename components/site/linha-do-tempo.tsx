"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ITENS = [
  { periodo: "MAR 2025", titulo: "O projeto nasce", texto: "Da paixão pela corrida e da vontade de criar uma comunidade vibrante em Santo Aleixo. Os primeiros treinos em grupo abriram espaço para todo mundo, do iniciante ao corredor experiente." },
  { periodo: "2025", titulo: "A primeira Corrida de Santo Aleixo", texto: "2,5 mil corredores, 7 km e um percurso com subidas, descidas e grandes retas. A cidade inteira acompanhou a largada em Andorinhas e a chegada na Capela." },
  { periodo: "2025", titulo: "Nasce a Kids", texto: "Baterias por faixa etária levaram a energia da corrida para as crianças. Na primeira edição, todo pequeno atleta cruzou a linha com uma medalha." },
  { periodo: "ABR 2026", titulo: "Um ano de Passos Verdes", texto: "A Corrida Passos Verdes celebrou o primeiro aniversário do projeto com a comunidade inteira reunida e uma nova geração descobrindo as ruas da região." },
  { periodo: "AGORA", titulo: "Quatro provas na temporada", texto: "Passos Verdes, Santo Aleixo, Kids Minecraft e Garytos formam um calendário que movimenta a cidade de ponta a ponta. A próxima largada já está sendo construída.", atual: true },
];

export function LinhaDoTempo() {
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const contexto = gsap.context(() => {
      const itens = gsap.utils.toArray<HTMLElement>("[data-item-timeline]");
      gsap.fromTo("[data-linha-timeline]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: raiz.current, start: "top 72%", end: "bottom 72%", scrub: 0.6 } });
      gsap.fromTo(itens, { autoAlpha: 0, y: 44 }, { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: raiz.current, start: "top 72%", once: true } });
    }, raiz);
    return () => contexto.revert();
  }, []);

  return (
    <div ref={raiz} className="relative mx-auto mt-14 max-w-3xl">
      <div aria-hidden className="absolute bottom-3 left-[7px] top-3 w-px bg-linha sm:left-[9px]" />
      <div data-linha-timeline aria-hidden className="absolute bottom-3 left-[7px] top-3 w-px origin-top bg-verde sm:left-[9px]" />
      <ol className="space-y-14 sm:space-y-18">
        {ITENS.map((item, indice) => (
          <li key={item.titulo} data-item-timeline className="relative pl-10 sm:pl-16">
            <span aria-hidden className={`absolute left-0 top-2 grid size-4 place-items-center rounded-full border-2 sm:size-5 ${item.atual ? "border-verde bg-verde" : "border-musgo/45 bg-cal"}`}>
              {item.atual ? <span className="absolute size-full animate-ping rounded-full bg-verde/55" /> : null}
            </span>
            <div className="grid gap-4 border-b border-linha pb-12 sm:grid-cols-[7rem_1fr] sm:gap-8 sm:pb-14">
              <div><p className="eyebrow text-verde">{item.periodo}</p><span className="mt-3 block font-mono text-[10px] text-musgo/55">0{indice + 1}</span></div>
              <div><h3 className="display text-2xl sm:text-3xl">{item.titulo}</h3><p className="mt-4 max-w-xl leading-7 text-musgo">{item.texto}</p></div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
