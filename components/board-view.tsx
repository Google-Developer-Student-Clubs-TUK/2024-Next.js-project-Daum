"use client";

import { useKanbanBoard } from "@/hooks/use-kanban-board";
import { PlusCircle } from "lucide-react";

import { BoardElement } from "./board-element";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const BoardView = ({
  onChange,
  initialContent,
  editable,
}: {
  onChange: (value: string) => void,
  initialContent?: string,
  editable?: boolean
}) => {
  const documents = useQuery(api.documents.getSearch, {});

  const editor = useKanbanBoard({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onBoardChanged: (board) => {
      onChange(JSON.stringify(board, null, 2));
    }
  });

  return (
    <div className="flex overflow-x-auto m-4 min-h-80">
      {editor.content && editor.content.map(v => (
        <BoardElement
          key={v._id}
          element={v}
          editor={editor}
          editable={editable}
          documents={documents}
        />
      ))}
      <div
        className="flex flex-col h-min w-64 ml-2 p-2 rounded-md border-2 border-dashed justify-center items-center shrink-[3]"
        role="button"
        onClick={editor.onNewElement}
      >
        <div className="h-80 flex justify-center items-center">
          <PlusCircle className="w-8 h-8 text-neutral-200"/>
        </div>
      </div>
    </div>
  )
}

export default BoardView;