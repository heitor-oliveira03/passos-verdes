"use client";

import { useState } from "react";
import { Campo, entrada } from "@/components/ui/campo";
import {
  bannerVazio,
  removerBanner,
  salvarBanner,
  useDados,
} from "@/lib/store";
import type { Banner } from "@/lib/types";
import { lerImagem } from "@/lib/utils";

export default function AdminBanners() {
  const { banners } = useDados();
  const [emEdicao, setEmEdicao] = useState<Banner | null>(null);

  return (
    <>
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="display text-4xl">Banners da hero</h1>
          <p className="mt-3 max-w-lg text-musgo">
            Cada banner ativo é um slide do carrossel da home, na ordem desta
            lista.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEmEdicao(bannerVazio())}
          className="eyebrow shrink-0 bg-tinta px-5 py-3.5 text-branco transition-colors hover:bg-verde"
        >
          Novo banner
        </button>
      </div>

      <ul className="mt-10 space-y-3">
        {banners.map((banner) => (
          <li
            key={banner.id}
            className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-linha bg-branco px-5 py-5"
          >
            <span className="min-w-0 flex-1">
              <span className="display block text-xl">
                {banner.titulo}{" "}
                <span className="text-verde">{banner.destaque}</span>
              </span>
              <span className="mt-1 block truncate font-mono text-xs text-musgo">
                {banner.eyebrow}
              </span>
            </span>

            <span
              className={`eyebrow px-2 py-1 ${
                banner.ativo
                  ? "bg-verde-claro text-verde"
                  : "rounded-full border border-linha px-2 text-musgo"
              }`}
            >
              {banner.ativo ? "No carrossel" : "Inativo"}
            </span>

            {banner.ativo ? null : (
              <button
                type="button"
                onClick={() => salvarBanner({ ...banner, ativo: true })}
                className="eyebrow text-musgo underline underline-offset-4 hover:text-verde"
              >
                Publicar
              </button>
            )}
            <button
              type="button"
              onClick={() => setEmEdicao(banner)}
              className="eyebrow underline underline-offset-4 hover:text-verde"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Excluir o banner "${banner.titulo}"?`))
                  removerBanner(banner.id);
              }}
              className="eyebrow text-musgo underline underline-offset-4 hover:text-tinta"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>

      {emEdicao ? (
        <FormularioBanner
          banner={emEdicao}
          aoFechar={() => setEmEdicao(null)}
        />
      ) : null}
    </>
  );
}

function FormularioBanner({
  banner,
  aoFechar,
}: {
  banner: Banner;
  aoFechar: () => void;
}) {
  const [imagem, setImagem] = useState(banner.imagem);
  const [erroImagem, setErroImagem] = useState("");

  async function aoEscolherImagem(arquivo: File | undefined) {
    if (!arquivo) return;
    setErroImagem("");
    try {
      setImagem(await lerImagem(arquivo));
    } catch {
      setErroImagem("Não foi possível ler esse arquivo. Use JPG ou PNG.");
    }
  }

  function aoEnviar(dados: FormData) {
    salvarBanner({
      ...banner,
      imagem,
      eyebrow: String(dados.get("eyebrow") ?? ""),
      titulo: String(dados.get("titulo") ?? ""),
      destaque: String(dados.get("destaque") ?? ""),
      subtitulo: String(dados.get("subtitulo") ?? ""),
      ctaLabel: String(dados.get("ctaLabel") ?? ""),
      ctaHref: String(dados.get("ctaHref") ?? ""),
      ativo: dados.get("ativo") === "on",
    });
    aoFechar();
  }

  return (
    <form
      action={aoEnviar}
      className="mt-12 grid gap-5 rounded-2xl border border-linha bg-branco p-6 shadow-sm sm:grid-cols-2 sm:p-8"
    >
      <h2 className="display text-2xl sm:col-span-2">
        {banner.titulo ? "Editar banner" : "Novo banner"}
      </h2>

      <div className="sm:col-span-2">
        <span className="eyebrow text-musgo">Foto do slide</span>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          {imagem ? (
            // eslint-disable-next-line @next/next/no-img-element -- data URL do admin, sem otimizador
            <img
              src={imagem}
              alt=""
              className="h-24 w-40 rounded-lg border border-linha object-cover"
            />
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => aoEscolherImagem(e.target.files?.[0])}
            className="text-sm file:mr-4 file:border file:border-linha file:bg-branco file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest hover:file:border-verde"
          />
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
        <p className="mt-1.5 text-xs text-musgo">
          Horizontal, reduzida para 1400 px ao salvar. Sem foto, o slide fica no
          verde escuro.
        </p>
        {erroImagem ? (
          <p role="alert" className="mt-2 border-l-2 border-verde pl-3 text-sm">
            {erroImagem}
          </p>
        ) : null}
      </div>

      <Campo
        label="Chapéu"
        dica="Linha curta acima do título, em maiúsculas"
        className="sm:col-span-2"
      >
        <input
          name="eyebrow"
          defaultValue={banner.eyebrow}
          required
          className={entrada}
        />
      </Campo>

      <Campo label="Título" dica="Primeira linha, em preto">
        <input
          name="titulo"
          defaultValue={banner.titulo}
          required
          className={entrada}
        />
      </Campo>

      <Campo label="Destaque" dica="Segunda linha, em verde">
        <input
          name="destaque"
          defaultValue={banner.destaque}
          required
          className={entrada}
        />
      </Campo>

      <Campo label="Texto de apoio" className="sm:col-span-2">
        <textarea
          name="subtitulo"
          defaultValue={banner.subtitulo}
          rows={3}
          required
          className={entrada}
        />
      </Campo>

      <Campo label="Texto do botão">
        <input
          name="ctaLabel"
          defaultValue={banner.ctaLabel}
          required
          className={entrada}
        />
      </Campo>

      <Campo label="Link do botão" dica="Ex.: /eventos">
        <input
          name="ctaHref"
          defaultValue={banner.ctaHref}
          required
          className={entrada}
        />
      </Campo>

      <label className="flex items-center gap-3 sm:col-span-2">
        <input
          type="checkbox"
          name="ativo"
          defaultChecked={banner.ativo}
          className="size-4 accent-verde"
        />
        <span className="text-sm">Incluir este banner no carrossel da home</span>
      </label>

      <div className="flex gap-4 sm:col-span-2">
        <button
          type="submit"
          className="eyebrow bg-tinta px-6 py-4 text-branco transition-colors hover:bg-verde"
        >
          Salvar banner
        </button>
        <button
          type="button"
          onClick={aoFechar}
          className="eyebrow px-2 text-musgo underline underline-offset-4 hover:text-tinta"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
