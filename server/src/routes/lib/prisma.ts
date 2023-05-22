import { PrismaClient } from "@prisma/client";

//Conexão com o BD
/**
 * Podemos tbm passar um objeto de configuração para o prisma de log, assim ele irá fazer os logs de todas as querys
 */
export const prisma = new PrismaClient({
  log: ["query"],
});
