"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ImagemEvento } from "@/components/site/imagem-evento";
import { Campo, entrada } from "@/components/ui/campo";
import {
  eventoVazio,
  removerEvento,
  removerInscricao,
  salvarEvento,
  useDados,
} from "@/lib/store";
import { MODALIDADES, type Evento, type Modalidade } from "@/lib/types";
import {
  baixarPlanilha,
  dataLonga,
  idade,
  lerImagem,
  slugify,
} from "@/lib/utils";

export default function EditarEvento() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { eventos, inscricoes } = useDados();

  const [rascunho] = useState(eventoVazio);
  const evento = id === "novo" ? rascunho : eventos.find((e) => e.id === id);

  // A imagem salva vem do store; o estado só existe enquanto ela é trocada.
  const [imagemNova, setImagem] = useState<string | null>(null);
  const [erroImagem, setErroImagem] = useState("");
  const imagem = imagemNova ?? evento?.imagem ?? "";

  if (!evento) {
    return (
      <>
        <h1 className="display text-4xl">Evento não encontrado</h1>
        <Link
          href="/admin/eventos"
          className="eyebrow mt-6 inline-block underline underline-offset-4 hover:text-verde"
        >
          Voltar para a lista
        </Link>
      </>
    );
  }

  const participantes = inscricoes
    .filter((i) => i.eventoId === evento.id)
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));

  function aoSalvar(dados: FormData) {
    const nome = String(dados.get("nome") ?? "").trim();
    const data = String(dados.get("data") ?? "");
    const atualizado: Evento = {
      ...evento!,
      nome,
      slug: slugify(`${nome} ${data.slice(0, 4)}`),
      edicao: Number(dados.get("edicao") ?? 1),
      modalidade: dados.get("modalidade") as Modalidade,
      data,
      horario: String(dados.get("horario") ?? ""),
      local: String(dados.get("local") ?? "").trim(),
      cidade: String(dados.get("cidade") ?? "").trim(),
      distancias: String(dados.get("distancias") ?? "")
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
      preco: Number(dados.get("preco") ?? 0),
      vagas: Number(dados.get("vagas") ?? 0),
      imagem,
      descricao: String(dados.get("descricao") ?? "").trim(),
      publicado: dados.get("publicado") === "on",
    };
    salvarEvento(atualizado);
    router.replace(`/admin/eventos/${atualizado.id}`);
  }

  async function aoEscolherImagem(arquivo: File | undefined) {
    if (!arquivo) return;
    setErroImagem("");
    try {
      setImagem(await lerImagem(arquivo));
    } catch {
      setErroImagem("Não foi possível ler esse arquivo. Use JPG ou PNG.");
    }
  }

  return (
    <>
      <Link
        href="/admin/eventos"
        className="eyebrow text-musgo hover:text-verde"
      >
        ← Eventos
      </Link>

      <h1 className="display mt-6 text-4xl">
        {id === "novo" ? "Novo evento" : evento.nome}
      </h1>

      <form
        action={aoSalvar}
        className="mt-10 grid gap-5 rounded-2xl border border-linha bg-branco p-6 shadow-sm sm:grid-cols-2 sm:p-8"
      >
        <Campo label="Nome da prova">
          <input
            name="nome"
            defaultValue={evento.nome}
            required
            className={entrada}
          />
        </Campo>

        <Campo label="Edição" dica="Número da edição, ex.: 4">
          <input
            name="edicao"
            type="number"
            min={1}
            defaultValue={evento.edicao}
            required
            className={entrada}
          />
        </Campo>

        <Campo label="Modalidade">
          <select
            name="modalidade"
            defaultValue={evento.modalidade}
            className={entrada}
          >
            {Object.entries(MODALIDADES).map(([valor, rotulo]) => (
              <option key={valor} value={valor}>
                {rotulo}
              </option>
            ))}
          </select>
        </Campo>

        <Campo label="Data">
          <input
            name="data"
            type="date"
            defaultValue={evento.data}
            required
            className={entrada}
          />
        </Campo>

        <Campo label="Horário da largada" dica="Ex.: 19h30">
          <input
            name="horario"
            defaultValue={evento.horario}
            required
            className={entrada}
          />
        </Campo>

        <Campo label="Local">
          <input
            name="local"
            defaultValue={evento.local}
            required
            className={entrada}
          />
        </Campo>

        <Campo label="Cidade">
          <input
            name="cidade"
            defaultValue={evento.cidade}
            required
            className={entrada}
          />
        </Campo>

        <Campo label="Distâncias" dica="Separadas por vírgula: 5 km, 10 km">
          <input
            name="distancias"
            defaultValue={evento.distancias.join(", ")}
            required
            className={entrada}
          />
        </Campo>

        <Campo label="Valor da inscrição" dica="Em reais, só números">
          <input
            name="preco"
            type="number"
            min={0}
            step={1}
            defaultValue={evento.preco}
            required
            className={entrada}
          />
        </Campo>

        <Campo label="Vagas">
          <input
            name="vagas"
            type="number"
            min={1}
            defaultValue={evento.vagas}
            required
            className={entrada}
          />
        </Campo>

        <Campo label="Descrição" className="sm:col-span-2">
          <textarea
            name="descricao"
            rows={4}
            defaultValue={evento.descricao}
            required
            className={entrada}
          />
        </Campo>

        <div className="sm:col-span-2">
          <span className="eyebrow text-musgo">Imagem da prova</span>
          <div className="mt-3 grid gap-5 sm:grid-cols-[16rem_1fr]">
            <div className="aspect-4/3 overflow-hidden rounded-2xl border border-linha bg-cal">
              <ImagemEvento evento={{ ...evento, imagem }} />
            </div>
            <div className="flex flex-col items-start gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => aoEscolherImagem(e.target.files?.[0])}
                className="text-sm file:mr-4 file:border file:border-linha file:bg-branco file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest hover:file:border-verde"
              />
              <p className="text-xs text-musgo">
                A imagem é reduzida para 1400 px de largura ao salvar. Sem
                imagem, entra a placa com o número da edição.
              </p>
              {erroImagem ? (
                <p
                  role="alert"
                  className="border-l-2 border-verde pl-3 text-sm"
                >
                  {erroImagem}
                </p>
              ) : null}
              {imagem ? (
                <button
                  type="button"
                  onClick={() => setImagem("")}
                  className="eyebrow text-musgo underline underline-offset-4 hover:text-tinta"
                >
                  Remover imagem
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <label className="flex items-center gap-3 sm:col-span-2">
          <input
            type="checkbox"
            name="publicado"
            defaultChecked={evento.publicado}
            className="size-4 accent-verde"
          />
          <span className="text-sm">Publicar no site</span>
        </label>

        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button
            type="submit"
            className="eyebrow bg-tinta px-6 py-4 text-branco transition-colors hover:bg-verde"
          >
            Salvar evento
          </button>
          {id === "novo" ? null : (
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    `Excluir "${evento.nome}" e as ${participantes.length} inscrições?`,
                  )
                ) {
                  removerEvento(evento.id);
                  router.replace("/admin/eventos");
                }
              }}
              className="eyebrow text-musgo underline underline-offset-4 hover:text-tinta"
            >
              Excluir evento
            </button>
          )}
        </div>
      </form>

      {id === "novo" ? null : (
        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="display text-2xl">Participantes</h2>
              <p className="mt-2 font-mono text-xs text-musgo">
                {participantes.length} de {evento.vagas} vagas
                {evento.data ? ` · ${dataLonga(evento.data)}` : ""}
              </p>
            </div>
            <button
              type="button"
              disabled={participantes.length === 0}
              onClick={() => baixarPlanilha(evento, participantes)}
              className="eyebrow bg-tinta px-5 py-3.5 text-branco transition-colors hover:bg-verde disabled:cursor-not-allowed disabled:bg-linha disabled:text-musgo"
            >
              Baixar planilha
            </button>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-linha bg-branco">
            <table className="w-full min-w-208 text-sm">
              <thead>
                <tr className="border-b border-linha text-left">
                  {[
                    "Nome",
                    "Contato",
                    "Idade",
                    "Distância",
                    "Camiseta",
                    "Equipe",
                    "",
                  ].map((coluna) => (
                    <th key={coluna} className="eyebrow px-4 py-3 text-musgo">
                      {coluna}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {participantes.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-linha last:border-0"
                  >
                    <td className="px-4 py-3">{p.nome}</td>
                    <td className="px-4 py-3 font-mono text-xs text-musgo">
                      {p.email}
                      <br />
                      {p.telefone}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs tabular-nums">
                      {idade(p.nascimento, evento.data)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {p.distancia}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {p.camiseta}
                    </td>
                    <td className="px-4 py-3 text-musgo">{p.equipe || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remover a inscrição de ${p.nome}?`))
                            removerInscricao(p.id);
                        }}
                        className="eyebrow text-musgo underline underline-offset-4 hover:text-tinta"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
                {participantes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-musgo">
                      Ninguém inscrito ainda. As inscrições feitas no site
                      aparecem aqui na hora.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
