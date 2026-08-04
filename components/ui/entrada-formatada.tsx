"use client";

import type { FormEvent, InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onInput"> & {
  formato: "cpf" | "telefone" | "email";
};

export function formatarCpf(valor: string) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function formatarTelefone(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);
  if (digitos.length <= 2) return digitos ? `(${digitos}` : "";
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;

  const corte = digitos.length === 11 ? 7 : 6;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, corte)}-${digitos.slice(corte)}`;
}

/** Entrada sem dependências para os formatos usados nos formulários públicos. */
export function EntradaFormatada({ formato, ...props }: Props) {
  function aoDigitar(evento: FormEvent<HTMLInputElement>) {
    const input = evento.currentTarget;
    input.value =
      formato === "cpf"
        ? formatarCpf(input.value)
        : formato === "telefone"
          ? formatarTelefone(input.value)
          : input.value.replace(/\s/g, "").toLowerCase();
  }

  const comuns = { ...props, onInput: aoDigitar };

  if (formato === "cpf") {
    return (
      <input
        {...comuns}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={14}
        pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
      />
    );
  }

  if (formato === "telefone") {
    return (
      <input
        {...comuns}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={15}
        pattern="\(\d{2}\) \d{4,5}-\d{4}"
      />
    );
  }

  return (
    <input
      {...comuns}
      type="email"
      inputMode="email"
      autoComplete="email"
      autoCapitalize="none"
      spellCheck={false}
    />
  );
}
