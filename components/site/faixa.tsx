/** Faixa de imagem larga, para quebrar blocos de texto longos. */
export function Faixa({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="px-3 sm:px-5">
      {/* eslint-disable-next-line @next/next/no-img-element -- foto local, mesmo caminho das outras */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-[36svh] w-full rounded-3xl object-cover sm:h-[52svh] sm:rounded-4xl"
      />
    </div>
  );
}
