import { FastifyInstance } from "fastify";
import axios from "axios";
import { z } from "zod";
import { prisma } from "./lib/prisma";
export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    });

    const { code } = bodySchema.parse(request.body);

    const accessTokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          code,
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
        },
        headers: {
          //Metadaos da requisição
          Accept: "application/json", //Estou dizendo para retornar os dados em JSON
        },
      }
    );

    const { access_token } = accessTokenResponse.data;
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    });
    const userInfo = userSchema.parse(userResponse.data);

    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url,
        },
      });
    }

    const token = app.jwt.sign(
      {
        // Quais informações do usuário queremos que esteja contida dentro do token, colocar coisa pública
        name: user.name,
        avatar_url: user.avatarUrl,
      },
      {
        // Aqui passamos duas configuração: uma se chama "sub" -que é a qual  usuário pertence esse token
        sub: user.id,
        //A outra configuração é quanto tempo esse token vai durar para expirar
        expiresIn: "30days",
      }
    );

    return {
      token,
    };
  });
}
