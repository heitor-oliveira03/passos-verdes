"use client";

import { useState } from "react";
import { Campo, entrada } from "@/components/ui/campo";
import { CampoData } from "@/components/ui/campo-data";
import { EntradaFormatada } from "@/components/ui/entrada-formatada";
import { Seletor } from "@/components/ui/seletor";
import { inscrever } from "@/lib/store";
import type { Camiseta, Evento } from "@/lib/types";
import { numeroDePeito, preco } from "@/lib/utils";

const CAMISETAS: Camiseta[] = ["PP", "P", "M", "G", "GG"];

export function FormularioInscricao({ evento }: { evento: Evento }) {
  const [confirmado, setConfirmado] = useState<{
    nome: string;
    numeroPeito: number;
  } | null>(null);

  if (confirmado) {
    return (
      <div className="rounded-3xl border border-verde bg-verde-claro p-8">
        <p className="eyebrow text-verde">Inscrição confirmada</p>
        <h3 className="display mt-4 text-3xl">
          Até {evento.horario}, {confirmado.nome}.
        </h3>
        <div className="mt-6 flex items-center justify-between gap-5 rounded-2xl border border-verde/25 bg-branco/70 p-5">
          <div>
            <p className="eyebrow text-musgo">Seu número de peito</p>
            <p className="mt-2 text-sm text-tinta/70">Guarde este número para a retirada do kit.</p>
          </div>
          <strong className="display text-4xl text-verde sm:text-5xl">
            {numeroDePeito(confirmado.numeroPeito)}
          </strong>
        </div>
        <p className="mt-4 text-tinta/70">
          A retirada do kit abre na véspera, no {evento.local}. Seu número é
          exclusivo nesta prova e também constará na lista da organização.
        </p>
        <button
          type="button"
          onClick={() => setConfirmado(null)}
          className="eyebrow mt-6 underline underline-offset-4"
        >
          Inscrever outra pessoa
        </button>
      </div>
    );
  }

  function aoEnviar(dadosDoForm: FormData) {
    const nome = String(dadosDoForm.get("nome") ?? "").trim();
    const inscricao = inscrever({
      eventoId: evento.id,
      nome,
      email: String(dadosDoForm.get("email") ?? "").trim(),
      cpf: String(dadosDoForm.get("cpf") ?? "").trim(),
      telefone: String(dadosDoForm.get("telefone") ?? "").trim(),
      nascimento: String(dadosDoForm.get("nascimento") ?? ""),
      sexo: dadosDoForm.get("sexo") as "F" | "M" | "Outro",
      distancia: String(dadosDoForm.get("distancia") ?? ""),
      camiseta: dadosDoForm.get("camiseta") as Camiseta,
      equipe: String(dadosDoForm.get("equipe") ?? "").trim(),
    });
    setConfirmado({
      nome: nome.split(" ")[0],
      numeroPeito: inscricao.numeroPeito ?? 0,
    });
  }

  return (
    <form action={aoEnviar} className="grid gap-5 sm:grid-cols-2">
      <Campo label="Nome completo" className="sm:col-span-2">
        <input name="nome" required autoComplete="name" className={entrada} />
      </Campo>

      <Campo label="E-mail">
        <EntradaFormatada
          formato="email"
          name="email"
          required
          className={entrada}
        />
      </Campo>

      <Campo label="Telefone">
        <EntradaFormatada
          formato="telefone"
          name="telefone"
          required
          placeholder="(15) 99999-0000"
          className={entrada}
        />
      </Campo>

      <Campo label="CPF">
        <EntradaFormatada
          formato="cpf"
          name="cpf"
          required
          placeholder="000.000.000-00"
          className={entrada}
        />
      </Campo>

      <Campo label="Data de nascimento">
        <CampoData name="nascimento" />
      </Campo>

      <Campo label="Sexo">
        <Seletor
          name="sexo"
          valorInicial="F"
          opcoes={[
            { valor: "F", rotulo: "Feminino" },
            { valor: "M", rotulo: "Masculino" },
            { valor: "Outro", rotulo: "Outro" },
          ]}
        />
      </Campo>

      <Campo label="Distância">
        <Seletor
          name="distancia"
          valorInicial={evento.distancias[0]}
          opcoes={evento.distancias.map((distancia) => ({
            valor: distancia,
            rotulo: distancia,
          }))}
        />
      </Campo>

      <Campo label="Camiseta">
        <Seletor
          name="camiseta"
          valorInicial="M"
          opcoes={CAMISETAS.map((camiseta) => ({
            valor: camiseta,
            rotulo: camiseta,
          }))}
        />
      </Campo>

      <Campo label="Equipe" dica="Opcional" className="sm:col-span-2">
        <input name="equipe" className={entrada} />
      </Campo>

      <button
        type="submit"
        className="eyebrow mt-2 rounded-full bg-tinta px-6 py-4 text-branco transition-all hover:scale-[1.02] hover:bg-verde sm:col-span-2"
      >
        Confirmar inscrição · {preco(evento.preco)}
      </button>
    </form>
  );
}
