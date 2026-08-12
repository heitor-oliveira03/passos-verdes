/**
 * Monta INSERT/UPDATE a partir da lista branca de colunas.
 *
 * Tabela e colunas são constantes do código, nunca vêm do request — o que vem
 * de fora entra só como parâmetro ($1, $2...), que o driver nunca interpola.
 */

export const insercao = (tabela: string, colunas: readonly string[]): string => {
  const marcadores = colunas.map((_, i) => `$${i + 1}`).join(", ");
  return `insert into ${tabela} (${colunas.join(", ")})
          values (${marcadores}) returning *`;
};

export const atualizacao = (
  tabela: string,
  colunas: readonly string[],
): string => {
  const atribuicoes = colunas.map((c, i) => `${c} = $${i + 1}`).join(", ");
  return `update ${tabela} set ${atribuicoes}
          where id = $${colunas.length + 1} returning *`;
};
