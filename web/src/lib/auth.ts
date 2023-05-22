import decode from "jwt-decode";
import { cookies } from "next/headers";

interface User {
  name: string;
  sub: string;
  avatar_url: string;
}

export function getUser(): User {
  const token = cookies().get("token")?.value;

  if (!token) {
    throw new Error("Unauthenticated.");
  }

  const user: User = decode(token);
  console.log(user);
  return user;
}
