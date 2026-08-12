/**
 * Exige ISO. Sem isso o Postgres lê "12/09/2026" como MM/DD e grava 9 de
 * dezembro no lugar de 12 de setembro — com status 201, sem erro nenhum.
 * Formato ambíguo tem que morrer na fronteira da API.
 */
export const ehDataISO = (valor: unknown): valor is string =>
  typeof valor === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valor);
