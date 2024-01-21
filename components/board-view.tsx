"use client";

import { useState } from "react";
import { useKanbanBoard } from "@/hooks/use-kanban-board";
import TextareaAutoSize from "react-textarea-autosize";
import { Button } from "./ui/button";
import { Plus, PlusCircle, Settings, Trash } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const BoardView = ({
  onChange,
  initialContent,
  editable,
}: {
  onChange: (value: string) => void,
  initialContent?: string,
  editable?: boolean
}) => {
  const [editElement, setEditElement] = useState("");
  const { 
    content,
    onNewElement,
    onRemoveElement,
    onRenameElement,
  } = useKanbanBoard({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onBoardChanged: (board) => {
      onChange(JSON.stringify(board, null, 2));
    }
  });

  const enableInput = (id: string) => {
    if (!editable) return;

    setEditElement(id);
  }

  const disableInput = () => setEditElement("");

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
    <div className="flex overflow-x-auto m-4 min-h-80">
      {content && content.map(v => (
        <div key={v._id} className="min-h-full w-64 min-w-48 ml-2 p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 shrink-[0.5]">
          <div className="mb-8 flex justify-between items-center">
            { editElement === v._id && editable ? (
              <TextareaAutoSize
                autoFocus
                onBlur={disableInput}
                onKeyDown={onKeyDown}
                value={v.name}
                onChange={(e) => onInput(v._id, e.target.value)}
                className="text-xl text-nowrap resize-none overflow-hidden"
                maxRows={1}
              />
            ) : (
              <div
                onClick={() => enableInput(v._id)}
                className="text-xl text-nowrap text-ellipsis overflow-hidden"
              >
                {v.name}
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
                      onClick={() => onRemoveElement(v._id)}
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
          {v.content && v.content.length > 0 ? v.content.map(i => (
            <div key={i}>
                
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center w-full h-48 text-muted-foreground">
              No documents.
            </div>
          )}
        </div>
      ))}
      <div
        className="min-h-full w-64 ml-2 p-2 rounded-md border-2 border-dashed flex justify-center items-center shrink-[3]"
        role="button"
        onClick={onNewElement}
      >
        <PlusCircle className="w-8 h-8 text-neutral-200"/>
      </div>
    </div>
  )
}

export default BoardView;