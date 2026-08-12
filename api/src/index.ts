import express from "express";
import { rotasDeAuth } from "./auth/rotas.ts";
import { rotasDeBanners } from "./banners/rotas.ts";
import { rotasDeEventos } from "./eventos/rotas.ts";
import { tratarErros } from "./infra/erros.ts";
import { rotasDeInscricoes } from "./inscricoes/rotas.ts";

const PORTA = Number(process.env.PORT ?? 3001);

const app = express();
app.use(express.json());

// O Next repassa /api/* pra cá e anexa o IP real em X-Forwarded-For. Sem isso,
// todo request pareceria vir de 127.0.0.1 e o limite de tentativas de login
// trancaria todo mundo junto.
app.set("trust proxy", 1);

app.use(rotasDeAuth);
app.use(rotasDeEventos);
app.use(rotasDeBanners);
app.use(rotasDeInscricoes);

// Depois das rotas: o Express só chama isto quando algo estoura.
app.use(tratarErros);

app.listen(PORTA, () => console.log(`api em http://localhost:${PORTA}`));
