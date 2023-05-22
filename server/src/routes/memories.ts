import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "./lib/prisma";

export async function memoriesRootes(app: FastifyInstance) {
  //Aqui estamos dizendo que antes de executar o nosso handler de cada uma das rotas eu quero que verifique se o usuário está autenticado
  app.addHook("preHandler", async (request) => {
    //Verifica se na requisição que o front-end está fazendo para esta rota está vindo o token de autenticação. E se caso o token não estiver vindo ela bloqueia
    await request.jwtVerify();
  });

  //Rota de listagem
  app.get("/users", async (request) => {
    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerp: memory.content.substring(0, 115).concat("..."),
        createdAt: memory.createdAt,
      };
    });
  });

  //Rota de detalhes
  app.get("/users/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });
    //pegando o meu request.params e passando para dentro do Schema para o zod fazer validação
    const { id } = paramsSchema.parse(request.params);

    /**
     * findUnique - encontrar única coisa
     * findUniqueOrThrow - encontra uma unica coisa, se não encontrar dispara um erro
     */
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    return memory;
  });

  //Rota de criação
  app.post("/users", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: request.user.sub,
      },
    });

    return memory;
  });

  //Rota de atualização
  app.put("/users/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    });

    return memory;
  });

  //Rota de deletar
  app.delete("/user/:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send();
    }

    await prisma.memory.delete({
      where: {
        id,
      },
    });
  });
}
