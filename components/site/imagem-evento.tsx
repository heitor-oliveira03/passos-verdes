import type { Evento } from "@/lib/types";
import { MODALIDADES } from "@/lib/types";
import { ano } from "@/lib/utils";

/**
 * Foto da prova. Sem foto, entra o número de peito: a placa é parte da
 * identidade, não um remendo de imagem faltando.
 */
export function ImagemEvento({
  evento,
  className = "",
}: {
  evento: Evento;
  className?: string;
}) {
  if (evento.imagem) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- fonte é data URL do admin, sem otimizador
      <img
        src={evento.imagem}
        alt={`${evento.nome}, ${evento.edicao}ª edição`}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden bg-mata p-6 text-branco ${className}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #0fa958 0 2px, transparent 2px 22px)",
        }}
      />
      <p className="eyebrow relative text-verde">
        {MODALIDADES[evento.modalidade]} · {ano(evento.data)}
      </p>
      <p className="display relative text-[22vw] leading-[0.78] sm:text-[8rem]">
        {String(evento.edicao).padStart(2, "0")}
      </p>
      <p className="relative font-mono text-xs text-white/60">
        {evento.distancias.join(" / ")}
      </p>
    </div>
  );
}
