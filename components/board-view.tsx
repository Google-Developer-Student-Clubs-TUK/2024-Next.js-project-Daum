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

  const onDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types[0] === "elementid") {
      e.preventDefault();
    }
  }

  const onDrop = (e: React.DragEvent) => {
    if (e.dataTransfer.types[0] === "elementid") {
      const elementId = e.dataTransfer.getData("elementid");
      editor.onMoveElement(elementId);

      e.stopPropagation();
    }
  }

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
        className="flex flex-col h-min w-64 ml-2 p-2 rounded-md border-2 border-dashed text-muted-foreground border-neutral-200 dark:border-neutral-700 justify-center items-center shrink-[3]"
        role="button"
        onClick={editor.onNewElement}

        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className="h-80 flex justify-center items-center">
          <PlusCircle className="w-8 h-8"/>
        </div>
      </div>
    </div>
  )
}

export default BoardView;