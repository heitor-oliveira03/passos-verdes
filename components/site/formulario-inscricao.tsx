"use client";

import { useState } from "react";
import { Campo, entrada } from "@/components/ui/campo";
import { inscrever } from "@/lib/store";
import type { Camiseta, Evento } from "@/lib/types";
import { preco } from "@/lib/utils";

const CAMISETAS: Camiseta[] = ["PP", "P", "M", "G", "GG"];

export function FormularioInscricao({ evento }: { evento: Evento }) {
  const [confirmado, setConfirmado] = useState<string | null>(null);

  if (confirmado) {
    return (
      <div className="rounded-3xl border border-verde bg-verde-claro p-8">
        <p className="eyebrow text-verde">Inscrição confirmada</p>
        <h3 className="display mt-4 text-3xl">
          Até {evento.horario}, {confirmado}.
        </h3>
        <p className="mt-4 text-tinta/70">
          O comprovante e o número de peito chegam por e-mail até 48 horas antes
          da largada. A retirada do kit abre na véspera, no {evento.local}.
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
    inscrever({
      eventoId: evento.id,
      nome,
      email: String(dadosDoForm.get("email") ?? "").trim(),
      telefone: String(dadosDoForm.get("telefone") ?? "").trim(),
      nascimento: String(dadosDoForm.get("nascimento") ?? ""),
      sexo: dadosDoForm.get("sexo") as "F" | "M" | "Outro",
      distancia: String(dadosDoForm.get("distancia") ?? ""),
      camiseta: dadosDoForm.get("camiseta") as Camiseta,
      equipe: String(dadosDoForm.get("equipe") ?? "").trim(),
    });
    setConfirmado(nome.split(" ")[0]);
  }

  return (
    <form action={aoEnviar} className="grid gap-5 sm:grid-cols-2">
      <Campo label="Nome completo" className="sm:col-span-2">
        <input name="nome" required autoComplete="name" className={entrada} />
      </Campo>

      <Campo label="E-mail">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={entrada}
        />
      </Campo>

      <Campo label="Telefone">
        <input
          name="telefone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="15 99999-0000"
          className={entrada}
        />
      </Campo>

      <Campo label="Data de nascimento">
        <input name="nascimento" type="date" required className={entrada} />
      </Campo>

      <Campo label="Sexo">
        <select name="sexo" required defaultValue="F" className={entrada}>
          <option value="F">Feminino</option>
          <option value="M">Masculino</option>
          <option value="Outro">Outro</option>
        </select>
      </Campo>

      <Campo label="Distância">
        <select
          name="distancia"
          required
          defaultValue={evento.distancias[0]}
          className={entrada}
        >
          {evento.distancias.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </Campo>

      <Campo label="Camiseta">
        <select name="camiseta" required defaultValue="M" className={entrada}>
          {CAMISETAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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
