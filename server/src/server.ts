import "dotenv/config"; // automaticamente importa as var de ambiente

import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import { memoriesRootes } from "./routes/memories";
import { authRoutes } from "./routes/auth";
import { upload } from "./upload";
import { resolve } from "path";

//Cors - tecnica de segurança para definir quais endereçoes podem acessar nossa API

const app = fastify();

app.register(multipart);
app.register(require("@fastify/static"), {
  //root - em qual pasta vai os nossos arquivos que queremos que seja estáticos
  root: resolve(__dirname, "../uploads"),
  prefix: "/uploads",
});
app.register(jwt, {
  //Esse secret é uma maneira de diferenciar os tokens gerados, os jwt gerados pelo meu back-end por outros jwts gerados por outros back-ends. Como se fosse uma forma de criptografia. O token vai ser assinado com a palavra "spacetime"
  secret: "spacetime",
});
app.register(cors, {
  origin: true, // Todas URLs de front-end poderão acessar o nosso back-end
});
app.register(upload);
app.register(authRoutes);
app.register(memoriesRootes);

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => console.log("HTTP server running on http://localhost:3333 😴"));
