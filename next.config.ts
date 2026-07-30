import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Há outros lockfiles acima na árvore; fixa a raiz neste projeto.
  turbopack: { root: path.resolve(".") },
};

export default nextConfig;
