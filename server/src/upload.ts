import { randomUUID } from "node:crypto";
import { extname, resolve } from "node:path";
import { FastifyInstance } from "fastify";
import { createWriteStream } from "node:fs";
// permite aguarda uma stream, espera o upload finalizar
import { pipeline } from "node:stream";
//o promisify permite transformar algumas funções do node mais antiga que não tinha suporte a promise para promises
import { promisify } from "node:util";

const pump = promisify(pipeline);

export async function upload(app: FastifyInstance) {
  app.post("/upload", async (request, reply) => {
    const upload = await request.file({
      //config - tamanho do arquivo
      limits: {
        fileSize: 5_242_880, //5mb
      },
    });

    if (!upload) {
      return reply.status(400).send();
    }

    //mimetype - categorização global de tipos de arquivos
    const mimetypeRegex = /^(image|video)\/[a-zA-Z]+/;
    const isValidFormatFormat = mimetypeRegex.test(upload.mimetype);

    if (!isValidFormatFormat) {
      return reply.status(400).send();
    }

    const extencion = extname(upload.filename); // pegando a extenção do arquivo original
    const fileId = randomUUID();
    //novo nome do arquivo
    const fileName = fileId.concat(extencion);

    const writeStream = createWriteStream(
      //essa função serve para determinar caminhos entre pastas, ela padroniza os caminhos
      resolve(__dirname, "../uploads/", fileName)
    );

    await pump(upload.file, writeStream);

    //Pegar URLs servidor
    const fullUrl = request.protocol.concat("://").concat(request.hostname);
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString();

    return { fileUrl };
  });
}
