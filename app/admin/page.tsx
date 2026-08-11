"use client";

import Link from "next/link";
import { useDados } from "@/lib/store";
import { dataCurta, ehFuturo } from "@/lib/utils";

const Icone = ({ tipo }: { tipo: "calendario" | "pessoas" | "arquivo" }) => {
  const caminhos = {
    calendario: <><path d="M5 3v3M15 3v3M3 8h14" /><rect x="3" y="5" width="14" height="12" rx="2" /></>,
    pessoas: <><path d="M13 17v-1.5c0-2-1.8-3.5-4-3.5s-4 1.5-4 3.5V17M9 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14 8a2.5 2.5 0 0 1 0 5M15 13c1.8.3 3 1.4 3 3v1" /></>,
    arquivo: <><path d="M6 3h6l4 4v10H6zM12 3v5h4M9 12h4M9 15h3" /></>,
  };

  return <svg aria-hidden viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">{caminhos[tipo]}</svg>;
};

export default function ResumoDoAdmin() {
  const { banners, eventos, inscricoes } = useDados();
  const proximos = eventos.filter(ehFuturo).sort((a, b) => a.data.localeCompare(b.data));
  const bannerAtivo = banners.find((b) => b.ativo);
  const proximoEvento = proximos[0];

  const numeros = [
    { valor: proximos.length, rotulo: "Próximas provas", apoio: "no calendário", icone: "calendario" as const },
    { valor: inscricoes.length, rotulo: "Inscrições", apoio: "confirmadas no total", icone: "pessoas" as const },
    { valor: eventos.filter((e) => !e.publicado).length, rotulo: "Rascunhos", apoio: "aguardando publicação", icone: "arquivo" as const },
  ];

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-linha bg-tinta px-6 py-8 text-branco shadow-[0_24px_80px_rgba(5,48,27,0.12)] sm:px-10 sm:py-10">
        <div aria-hidden className="absolute -right-16 -top-24 size-72 rounded-full border-[48px] border-verde/10" />
        <div aria-hidden className="absolute bottom-0 right-28 h-24 w-px rotate-45 bg-verde/30" />
        <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-5 flex items-center gap-3 text-verde"><span className="size-2 rounded-full bg-verde shadow-[0_0_0_5px_rgba(15,169,88,.16)]" /> Central de operações</p>
            <h1 className="display max-w-2xl text-4xl sm:text-6xl">Tudo pronto para a <span className="text-verde">próxima largada.</span></h1>
            <p className="mt-6 max-w-xl text-sm leading-6 text-white/60">
              Acompanhe eventos, inscrições e a comunicação da Passos Verdes em um só lugar.
            </p>
          </div>
          <Link href="/admin/eventos" className="eyebrow inline-flex w-fit items-center gap-3 rounded-full bg-verde px-5 py-4 text-white transition hover:-translate-y-0.5 hover:bg-[#12bf65]">
            Gerenciar eventos <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="visao-geral" className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <div><p className="eyebrow text-verde">Hoje</p><h2 id="visao-geral" className="display mt-3 text-2xl">Visão geral</h2></div>
          <p className="hidden text-sm text-musgo sm:block">Indicadores atualizados em tempo real</p>
        </div>
        <dl className="grid gap-4 md:grid-cols-3">
          {numeros.map((n, indice) => (
            <div key={n.rotulo} className="group relative overflow-hidden rounded-2xl border border-linha bg-branco p-6 transition duration-300 hover:-translate-y-1 hover:border-verde/50 hover:shadow-[0_16px_45px_rgba(5,48,27,.08)]">
              <div className="flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-verde-claro text-verde"><Icone tipo={n.icone} /></div>
                <span className="font-mono text-[10px] text-musgo">0{indice + 1}</span>
              </div>
              <dd className="display mt-7 text-5xl">{n.valor}</dd>
              <dt className="mt-3 text-sm font-semibold uppercase tracking-wide">{n.rotulo}</dt>
              <p className="mt-1 text-xs text-musgo">{n.apoio}</p>
              <div aria-hidden className="absolute bottom-0 left-0 h-1 w-0 bg-verde transition-all duration-300 group-hover:w-full" />
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,.55fr)]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="eyebrow text-verde">Performance</p><h2 className="display mt-3 text-2xl sm:text-3xl">Inscrições por prova</h2></div>
            <Link href="/admin/eventos" className="eyebrow text-musgo transition hover:text-verde">Ver todas →</Link>
          </div>
          <ul className="space-y-3">
            {proximos.map((evento, indice) => {
              const total = inscricoes.filter((i) => i.eventoId === evento.id).length;
              const ocupacao = Math.round((total / Math.max(1, evento.vagas)) * 100);
              return (
                <li key={evento.id}>
                  <Link href={`/admin/eventos/${evento.id}`} className="group grid gap-5 rounded-2xl border border-linha bg-branco p-5 transition duration-300 hover:border-verde/50 hover:shadow-[0_12px_35px_rgba(5,48,27,.07)] sm:grid-cols-[auto_1fr_auto] sm:items-center">
                    <div className="display flex size-12 items-center justify-center rounded-xl bg-cal text-lg text-musgo transition group-hover:bg-verde group-hover:text-white">0{indice + 1}</div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><p className="display truncate text-lg sm:text-xl">{evento.nome}</p>{!evento.publicado && <span className="eyebrow rounded-full bg-verde-claro px-2 py-1 text-verde">Rascunho</span>}</div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-musgo"><span>{dataCurta(evento.data)}</span><span>{total} de {evento.vagas} vagas</span><span>{ocupacao}% ocupado</span></div>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-linha"><div className="h-full rounded-full bg-verde transition-all duration-700" style={{ width: `${Math.min(100, ocupacao)}%` }} /></div>
                    </div>
                    <span className="flex size-10 items-center justify-center justify-self-end rounded-full border border-linha text-musgo transition group-hover:border-verde group-hover:bg-verde group-hover:text-white">↗</span>
                  </Link>
                </li>
              );
            })}
            {proximos.length === 0 && <li className="rounded-2xl border border-dashed border-linha bg-branco p-8 text-sm text-musgo">Nenhuma prova futura cadastrada. <Link href="/admin/eventos" className="font-semibold text-verde underline">Criar evento</Link></li>}
          </ul>
        </div>

        <aside className="space-y-4 lg:pt-[4.6rem]">
          <div className="rounded-2xl border border-linha bg-verde-claro p-6">
            <p className="eyebrow text-verde">Próxima largada</p>
            {proximoEvento ? <><p className="display mt-5 text-2xl">{proximoEvento.nome}</p><p className="mt-3 text-sm text-musgo">{dataCurta(proximoEvento.data)} · {proximoEvento.horario}</p><p className="mt-1 text-sm text-musgo">{proximoEvento.local}, {proximoEvento.cidade}</p><Link href={`/admin/eventos/${proximoEvento.id}`} className="eyebrow mt-6 inline-flex items-center gap-2 text-verde">Abrir evento →</Link></> : <p className="mt-4 text-sm text-musgo">Nenhum evento agendado.</p>}
          </div>
          <div className="rounded-2xl border border-linha bg-branco p-6">
            <div className="flex items-center justify-between"><p className="eyebrow text-musgo">Banner da home</p><span className={`size-2 rounded-full ${bannerAtivo ? "bg-verde shadow-[0_0_0_4px_rgba(15,169,88,.12)]" : "bg-musgo"}`} /></div>
            <p className="display mt-5 text-xl">{bannerAtivo ? `${bannerAtivo.titulo} ${bannerAtivo.destaque}` : "Sem banner ativo"}</p>
            <p className="mt-2 text-xs leading-5 text-musgo">{bannerAtivo ? "Publicado e visível para os visitantes." : "A home está usando o primeiro banner da lista."}</p>
            <Link href="/admin/banners" className="eyebrow mt-6 inline-flex items-center gap-2 text-verde">Gerenciar banner →</Link>
          </div>
        </aside>
      </section>
    </div>
  );
}
