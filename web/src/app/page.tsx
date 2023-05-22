import { EmptyMemories } from "@/components/EmptyMemories";
import { apis } from "@/lib/api";
import { cookies } from "next/headers";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import Image from "next/image";
import Link from "next/link";
import { ArrowBigRight } from "lucide-react";

dayjs.locale(ptBr);

interface Memory {
  coverUrl: string;
  id: string;
  createdAt: string;
  excerpt: string;
}

export default async function Home() {
  const isAutenticated = cookies().has("token");

  if (!isAutenticated) {
    return <EmptyMemories />;
  }

  const token = cookies().get("token")?.value;
  const response = await apis.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const memories: Memory[] = response.data;
  if (memories.length === 0) {
    return <EmptyMemories />;
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => {
        return (
          <div key={memory.id} className="space-y-4">
            <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
              {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}
            </time>
            <Image
              src={memory.coverUrl}
              alt=""
              width={592}
              height={280}
              className="aspect-video w-full rounded-lg object-cover"
            />
            <p className="text-lg leading-relaxed text-gray-100">
              {memory.excerpt}
            </p>

            <Link
              href={`/users/${memory.id}`}
              className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-200"
            >
              Ler mais <ArrowBigRight className="h-4 w-4" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
