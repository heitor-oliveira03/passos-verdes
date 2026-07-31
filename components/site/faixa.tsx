/** Faixa de imagem de ponta a ponta, para quebrar blocos de texto longos. */
export function Faixa({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- arte vetorial estática, o otimizador não tem o que fazer
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-[36svh] w-full object-cover sm:h-[52svh]"
    />
  );
}
