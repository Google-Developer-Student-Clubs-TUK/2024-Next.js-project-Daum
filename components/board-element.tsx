"use client";

import { ElementRef, useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { KanbanBoardProps } from "@/hooks/use-kanban-board";
import TextareaAutoSize from "react-textarea-autosize";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Plus, Settings, Trash } from "lucide-react";
import { BoardDocument } from "./board-document";

export const BoardElement = ({
  editor: { 
    onRenameElement,
    onRemoveElement
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
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <div className="min-h-full w-64 min-w-48 ml-2 p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 shrink-[0.5]">
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
              <div>Add...</div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {content && content.length > 0 ? content.map(i => (
        <BoardDocument key={i} />
      )) : (
        <div className="flex flex-col items-center justify-center w-full h-48 text-muted-foreground">
          No documents.
        </div>
      )}
    </div>
  )
}