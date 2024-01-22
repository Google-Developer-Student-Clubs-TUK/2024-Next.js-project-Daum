"use client";

import { Doc, Id } from "@/convex/_generated/dataModel"
import { Skeleton } from "./ui/skeleton"
import { File, MoreHorizontal, Trash } from "lucide-react"
import Link from "next/link"
import { KanbanBoardProps } from "@/hooks/use-kanban-board"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

export const BoardDocument = ({
  _id,
  document,
  editable,
  editor: {
    onAddDocumentIndex,
    onRemoveDocument
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
      className="w-full h-16 bg-green-200 dark:bg-green-700 rounded-md flex justify-between" 
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
      <div className="m-2">
        <Popover>
          <PopoverTrigger asChild>
            <div role="button">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground"/>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-48"
            side="bottom"
          >
            <div className="p-1">
              <Button
                variant="ghost"
                className="w-full flex justify-start"
                onClick={() => onRemoveDocument(document._id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}