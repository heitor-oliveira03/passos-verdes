/**
 * Faixa de imagem larga, para quebrar blocos de texto longos.
 *
 * Respiro igual dos quatro lados: a faixa encosta em cartões arredondados
 * (linha do tempo, parceiros) e sem o gap vertical os dois viram um bloco só.
 * Mesma medida da calha lateral do site.
 */
export function Faixa({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  /** Ajuste de recorte, ex.: `object-bottom` quando o assunto está no pé da foto. */
  className?: string;
}) {
  return (
    <div className="p-3 sm:p-5">
      {/* eslint-disable-next-line @next/next/no-img-element -- foto local, mesmo caminho das outras */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-[36svh] w-full rounded-3xl object-cover sm:h-[52svh] sm:rounded-4xl ${className}`}
      />
    </div>
  );
}
