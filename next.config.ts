import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Há outros lockfiles acima na árvore; fixa a raiz neste projeto.
  turbopack: { root: path.resolve(".") },

  // O front chama /api/* na própria origem e o Next repassa pro Express.
  // Mesma origem: o cookie de sessão viaja sozinho e CORS deixa de existir.
  async rewrites() {
    return [
      { source: "/api/:caminho*", destination: "http://localhost:3001/:caminho*" },
    ];
  },
};

export default nextConfig;
