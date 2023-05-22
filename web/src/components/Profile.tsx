import { getUser } from "@/lib/auth";
import Image from "next/image";

export function Profile() {
  const { name, avatar_url } = getUser();

  return (
    <div className="flex items-center gap-3 text-left">
      <Image
        src={avatar_url}
        alt=""
        className="h-10 w-10 rounded-full"
        width={40}
        height={40}
      />

      <p className="max-[140px] text-sm leading-snug">
        {name}
        <a
          href="/api/auth/logout"
          className="block text-red-400 hover:text-red-300"
        >
          Sair
        </a>
      </p>
    </div>
  );
}
