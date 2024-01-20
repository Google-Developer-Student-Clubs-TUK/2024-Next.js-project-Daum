"use client";

import BoardView from "@/components/board-view";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

interface BoardIdPageProps {
  params: {
    boardId: Id<"boards">;
  };
}

const BoardIdPage = ({ params }: BoardIdPageProps) => {
  const board = useQuery(api.boards.getById, {
    boardId: params.boardId
  });

  if (board === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
      
      </nav>
    )
  }
  
  return (
    <div>
      <div className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] p-4">
        {board.title}
      </div>
      <BoardView
        onChange={() => {}}
        initialContent={board.content}
        editable={true}
      />
    </div>
  )
}

export default BoardIdPage;