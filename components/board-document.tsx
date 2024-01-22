"use client";

import { Doc, Id } from "@/convex/_generated/dataModel"
import { Skeleton } from "./ui/skeleton"
import { File, MoreHorizontal, Trash, SquareSlash } from "lucide-react"
import Link from "next/link"
import { KanbanBoardProps } from "@/hooks/use-kanban-board"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { KanbanBoardDocument } from "@/types/kanbanboard";

export const BoardDocument = ({
  _id,
  boardDocument: {
    color,
  },
  document,
  editable,
  editor: {
    onAddDocumentIndex,
    onRemoveDocument,
    onDocumentSetColor,
  }
}: {
  _id: string,
  boardDocument: KanbanBoardDocument
  document: Doc<"documents">,
  editable?: boolean,
  editor: KanbanBoardProps
}) => {
  const { resolvedTheme } = useTheme();

  if (document === undefined) {
    return <Skeleton className="h-16 w-full"/>
  }

  if (document === null) {
    return null;
  }

  const colors = [
    { light: "#fecaca", dark: "#b91c1c" },
    { light: "#fed7aa", dark: "#c2410c" },
    { light: "#fef08a", dark: "#a16207" },
    { light: "#bbf7d0", dark: "#15803d" },
    { light: "#bae6fd", dark: "#0369a1" },
    { light: "#bfdbfe", dark: "#1d4ed8" },
    { light: "#e9d5ff", dark: "#7e22ce" },
  ];

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("documentid", document._id);
    e.stopPropagation();
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
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={!!color ? {
        backgroundColor: resolvedTheme === "dark" ? color.dark : color.light
      }
    : {}
    }
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
      <div className={cn(
        "m-2",
        !editable && "hidden"
      )}>
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
            <div className="p-1 flex justify-around">
              <SquareSlash
                className="h-4 w-4"
                role="button"
                onClick={() => onDocumentSetColor(document._id, undefined)}
              />
              {colors.map(c => (
                <div
                  key={c.light}
                  role="button"
                  className="h-4 w-4 rounded-sm"
                  style={{
                    backgroundColor: resolvedTheme === "dark" ? c.dark : c.light
                  }}
                  onClick={() => onDocumentSetColor(document._id, c)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}