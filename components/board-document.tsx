"use client";

import { Doc, Id } from "@/convex/_generated/dataModel"
import { Skeleton } from "./ui/skeleton"
import { File } from "lucide-react"
import Link from "next/link"
import { KanbanBoardProps } from "@/hooks/use-kanban-board"

export const BoardDocument = ({
  _id,
  document,
  editable,
  editor: {
    onAddDocumentIndex
  }
}: {
  _id: string,
  document: Doc<"documents">,
  editable?: boolean,
  editor: KanbanBoardProps
}) => {
  if (document === undefined) {
    return <Skeleton className="h-16 w-full"/>
  }

  if (document === null) {
    return null;
  }

  const onDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types[0] === "documentid") {
      e.preventDefault();
    }
  }

  const onDrop = (e: React.DragEvent) => {
    if (e.dataTransfer.types[0] === "documentid") {
      const documentId = e.dataTransfer.getData("documentid") as Id<"documents">;
      onAddDocumentIndex(_id, documentId, document._id);
      
      e.stopPropagation();
    }
  }

  return (
    <div
      className="w-full h-16 bg-green-200 dark:bg-green-700 rounded-md flex" 
      draggable={editable}
      onDragStart={(e) => e.dataTransfer.setData("documentid", document._id)}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="m-2 flex">
        <Link
          href={`/documents/${document._id}`}
          className="">
            {document.icon ? (
              <p className="mr-2 text-[18px]">{document.icon}</p>
            ) : (
              <File className="mr-2 h-4 w-4" />
            )}
        </Link>
        <div className="text-foreground">
          {document.title}
        </div>
      </div>
    </div>
  )
}