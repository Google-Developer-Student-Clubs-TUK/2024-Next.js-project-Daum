"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Item } from "./item";
import { FileIcon } from "lucide-react";

export const BoardList = () => {
  const params = useParams();
  const router = useRouter();
  const boards = useQuery(api.boards.getSidebar, {});

  const onRedirect = (boardId: string) => {
    router.push(`/boards/${boardId}`)
  }

  if (boards === undefined) {
    return (
      <>
        <Item.Skeleton />
        <Item.Skeleton />
        <Item.Skeleton />
      </>
    );
  }

  return (
    <>
    {boards.map((board) => (
      <div key={board._id}>
        <Item
          onClick={() => onRedirect(board._id)}
          label={board.title}
          icon={FileIcon}
          documentIcon={board.icon}
          active={params.boardId === board._id}
        />
      </div>
    ))}
    </>
  )
}