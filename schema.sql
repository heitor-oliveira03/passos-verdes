-- Schema do Passos Verdes. Espelha lib/types.ts.
-- Rodar: psql "$DATABASE_URL" -f schema.sql
-- `if not exists` em tudo: rodar de novo não quebra nem apaga dado.

create table if not exists banners (
  id        bigint generated always as identity primary key,
  eyebrow   text    not null default '',
  titulo    text    not null,
  destaque  text    not null default '',
  subtitulo text    not null default '',
  cta_label text    not null,
  cta_href  text    not null,
  imagem    text    not null default '',
  ativo     boolean not null default false
);

create table if not exists eventos (
  id          bigint  generated always as identity primary key,
  slug        text    not null unique,
  nome        text    not null,
  edicao      integer not null default 1,
  modalidade  text    not null check (modalidade in ('noturna', 'kids', 'rua', 'trail')),
  data        date    not null,
  horario     text    not null,
  local       text    not null,
  cidade      text    not null,
  distancias  text[]  not null default '{}',
  preco       numeric(10, 2) not null default 0,
  vagas       integer not null default 0,
  imagem      text    not null default '',
  descricao   text    not null default '',
  publicado   boolean not null default false
);

create table if not exists inscricoes (
  id           bigint  generated always as identity primary key,
  evento_id    bigint  not null references eventos (id) on delete cascade,
  nome         text    not null,
  email        text    not null,
  cpf          text,
  telefone     text    not null,
  nascimento   date    not null,
  sexo         text    not null check (sexo in ('F', 'M', 'Outro')),
  distancia    text    not null,
  camiseta     text    not null check (camiseta in ('PP', 'P', 'M', 'G', 'GG')),
  equipe       text    not null default '',
  criada_em    timestamptz not null default now(),
  numero_peito integer not null,

  -- O banco garante o que lib/store.ts emula hoje em 40 linhas de JS:
  -- número de peito é único dentro da prova, e nunca se repete.
  -- Este índice também serve as buscas por evento_id — por isso não
  -- criamos um índice separado pra chave estrangeira.
  unique (evento_id, numero_peito)
);
