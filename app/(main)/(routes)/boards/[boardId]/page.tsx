"use client";

import { BoardToolbar } from "@/components/board-toolbar";
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
      <BoardToolbar initialData={board}/>
      <BoardView
        onChange={() => {}}
        initialContent={board.content}
        editable={true}
      />
    </div>
  )
}

export default BoardIdPage;