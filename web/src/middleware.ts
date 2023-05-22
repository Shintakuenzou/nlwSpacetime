import { NextRequest, NextResponse } from "next/server";

const signUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`;

// Para interseptar o acesso de um usuário em uma determinada rota ou página usamos o middleware e fazer isso no NExt da seguinte forma:
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  //Qual url original o usuário estava tentando acessar
  const urlOrigial = request.url;

  if (!token) {
    return NextResponse.redirect(signUrl, {
      headers: {
        "Set-Cookie": `redirectTo=${urlOrigial}; Path=/; httpOnly; max-age=20`,
      },
    });
  }

  //Significa que não vai fazer nada e deixar o usuário seguir em frente
  return NextResponse.next();
}

//Essa config tem que ter uma propriedade obrigatoria de "matcher" que significa em quais caminhos, quais endereçoes da minha aplicação eu quero disparar o middleware(a função), ou seja, quais endereço da minha aplicação eu quero que obrigar que para o usuário acessar ele vai ter que estar logado
export const config = {
  matcher: "/memories/:path*",
};
