"use client";

import { ElementRef, useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { KanbanBoardProps } from "@/hooks/use-kanban-board";
import TextareaAutoSize from "react-textarea-autosize";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Plus, Search, Settings, Trash } from "lucide-react";
import { BoardDocument } from "./board-document";
import { Input } from "./ui/input";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const BoardElement = ({
  editor: { 
    onRenameElement,
    onRemoveElement,

    onAddDocument,
  },
  element: {
    name,
    _id,
    content
  },
  editable,
}: {
  editor: KanbanBoardProps,
  element: {
    _id: string,
    name: string,
    content: Id<"documents">[],
  },
  editable?: boolean,
}) => {
  const documents = useQuery(api.documents.getSearch, {});

  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  })

  const enableInput = () => {
    if (!editable) return;

    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  const disableInput = () => setIsEditing(false);

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  }

  const onInput = (id: string, value: string) => {
    onRenameElement(id, value);
  }

  const onDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types[0] === "documentid") {
      e.preventDefault();
    }
  }

  const onDrop = (e: React.DragEvent) => {
    if (e.dataTransfer.types[0] === "documentid") {
      const documentId = e.dataTransfer.getData("documentid") as Id<"documents">;
      onAddDocument(_id, documentId);
    }
  }

  return (
    <div
      className="flex flex-col h-min w-64 min-w-48 ml-2 p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 shrink-[0.5]"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="mb-8 flex justify-between items-center">
        { isEditing && editable ? (
          <TextareaAutoSize
            ref={inputRef}
            onBlur={() => { disableInput(); }}
            onKeyDown={(e) => { onKeyDown(e); }}
            value={name}
            onChange={(e) => onInput(_id, e.target.value)}
            className="text-xl text-nowrap resize-none overflow-hidden"
            maxRows={1}
          />
        ) : (
          <div
            onClick={() => enableInput()}
            className="text-xl text-nowrap text-ellipsis overflow-hidden"
          >
            {name}
          </div>
        )}

        <div className={cn(
          "hidden",
          editable && "flex",
        )}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size='sm'
                variant="ghost"
                className="hover:bg-neutral-200 dark:hover:bg-neutral-600 flex-1"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-48"
              side="bottom"
            >
              <div className="p-1">
                <Button
                  variant="ghost"
                  className="w-full flex justify-start"
                  onClick={() => onRemoveElement(_id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size='sm'
                variant="ghost"
                className="hover:bg-neutral-200 dark:hover:bg-neutral-600 flex-1"
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-48"
              side="bottom"
            >
              <div className="flex items-center gap-x-1 p-2">
                <Search className="h-4 w-4" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
                  placeholder="Filter by title..."
                />
              </div>
              <div className="m-2">
                <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
                  No documents found.
                </p>
                {filteredDocuments?.map((document) => (
                  <div
                    role="button"
                    className="flex text-sm rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-nowrap text-ellipsis overflow-hidden"
                    key={document._id}
                    onClick={() => onAddDocument(_id, document._id)}
                  >
                      {document.icon && (
                        <div className="shrink-0 mr-2 text-[18px]">{document.icon}</div>
                      )}
                      {document.title}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex flex-col min-h-64 space-y-2">
        {content && content.length > 0 ? content.map(i => (
          <BoardDocument 
            key={i}
            id={i}
            editable={editable}
          />
        )) : (
          <div className="flex flex-col items-center justify-center w-full text-muted-foreground">
            No documents.
          </div>
        )}
      </div>
    </div>
  )
}