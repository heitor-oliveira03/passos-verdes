/**
 * Seta dos carrosséis. É SVG e não o glifo "←": a métrica da fonte deixa a
 * flecha fora do centro óptico do botão redondo — o desenho já vem centrado.
 */
export function Seta({ para }: { para: "esquerda" | "direita" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`size-[1em] ${para === "esquerda" ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}
