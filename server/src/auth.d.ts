import "@fastify/jwt";

declare module "@fastify/jwt" {
  export interface FastifyJWT {
    user: {
      sub: string;
      name: string;
      avatar_url: string;
    }; // user type is return type of `request.user` object
  }
}
