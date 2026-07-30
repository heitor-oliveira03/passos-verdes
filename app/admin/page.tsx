"use client";

import Link from "next/link";
import { useDados } from "@/lib/store";
import { dataCurta, ehFuturo } from "@/lib/utils";

export default function ResumoDoAdmin() {
  const { banners, eventos, inscricoes } = useDados();
  const proximos = eventos
    .filter(ehFuturo)
    .sort((a, b) => a.data.localeCompare(b.data));
  const bannerAtivo = banners.find((b) => b.ativo);

  const numeros = [
    { valor: proximos.length, rotulo: "Provas com data futura" },
    { valor: inscricoes.length, rotulo: "Inscrições no total" },
    {
      valor: eventos.filter((e) => !e.publicado).length,
      rotulo: "Eventos em rascunho",
    },
  ];

  return (
    <>
      <h1 className="display text-4xl">Resumo</h1>
      <p className="mt-3 text-musgo">
        Hero no ar:{" "}
        {bannerAtivo ? (
          <Link href="/admin/banners" className="underline hover:text-verde">
            {bannerAtivo.titulo} {bannerAtivo.destaque}
          </Link>
        ) : (
          <Link href="/admin/banners" className="underline hover:text-verde">
            nenhum banner ativo — a home usa o primeiro da lista
          </Link>
        )}
      </p>

      <dl className="mt-10 grid gap-px border border-linha bg-linha sm:grid-cols-3">
        {numeros.map((n) => (
          <div key={n.rotulo} className="bg-branco p-6">
            <dd className="display text-5xl">{n.valor}</dd>
            <dt className="eyebrow mt-3 text-musgo">{n.rotulo}</dt>
          </div>
        ))}
      </dl>

      <h2 className="display mt-16 text-2xl">Inscrições por prova</h2>
      <ul className="mt-6 border-t border-linha">
        {proximos.map((evento) => {
          const total = inscricoes.filter(
            (i) => i.eventoId === evento.id,
          ).length;
          const ocupacao = Math.round(
            (total / Math.max(1, evento.vagas)) * 100,
          );
          return (
            <li key={evento.id}>
              <Link
                href={`/admin/eventos/${evento.id}`}
                className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-linha bg-branco px-5 py-5 transition-colors hover:bg-verde-claro"
              >
                <div className="min-w-0">
                  <p className="display text-xl">{evento.nome}</p>
                  <p className="mt-1 font-mono text-xs text-musgo">
                    {dataCurta(evento.data)} · {total} de {evento.vagas} vagas
                    {evento.publicado ? "" : " · rascunho"}
                  </p>
                  <div
                    className="mt-3 h-1 w-full max-w-xs bg-linha"
                    role="presentation"
                  >
                    <div
                      className="h-full bg-verde"
                      style={{ width: `${Math.min(100, ocupacao)}%` }}
                    />
                  </div>
                </div>
                <span className="eyebrow text-musgo">Ver participantes →</span>
              </Link>
            </li>
          );
        })}
        {proximos.length === 0 ? (
          <li className="border-b border-linha bg-branco px-5 py-8 text-musgo">
            Nenhuma prova futura cadastrada.{" "}
            <Link href="/admin/eventos" className="underline hover:text-verde">
              Criar evento
            </Link>
          </li>
        ) : null}
      </ul>
    </>
  );
}
